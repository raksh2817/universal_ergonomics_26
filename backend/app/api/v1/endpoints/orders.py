"""
Order management endpoints — /api/v1/orders/

Three routes:
  POST /        – Create a new order from a cart payload.  Resolves products,
                  calculates totals (subtotal, 18% GST, delivery), and generates
                  a unique order number in the format UE-YYYYMMDD-XXXXXX.
  GET  /{id}    – Retrieve a single order with all its line items.
  PATCH/{id}/status – Advance an order through its fulfilment lifecycle.
                      Automatically stamps `delivered_at` when status = DELIVERED.

Order number format: UE-20240315-AB12CD
  UE      = brand prefix
  date    = creation date in UTC (YYYYMMDD)
  suffix  = 6-char uppercase hex from a random UUID (collision probability ~1 in 16M)
"""

import uuid as uuid_mod
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, OrderType, Address
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderOut

router = APIRouter()


@router.post("/", response_model=OrderOut, status_code=201)
async def create_order(payload: OrderCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new order from a checkout payload.

    Flow:
      1. Validate the shipping address belongs to a known user.
      2. Loop over requested line items, fetching each product and computing
         the line total (selling_price × quantity).
      3. Compute financials: subtotal, 18% GST, and delivery charge.
      4. Generate a unique human-readable order number.
      5. Persist the Order and its OrderItems in a single transaction via flush.

    Note: product_name and product_sku are snapshotted onto each OrderItem so
    that future catalogue changes do not alter the order history.
    """
    # ------------------------------------------------------------------
    # 1. Resolve shipping address → also derives user_id for the order
    # ------------------------------------------------------------------
    addr_result = await db.execute(
        select(Address).where(Address.id == payload.shipping_address_id)
    )
    address = addr_result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=400, detail="Invalid shipping address")

    # ------------------------------------------------------------------
    # 2. Build line items and accumulate subtotal
    # ------------------------------------------------------------------
    order_items = []
    subtotal = Decimal("0.00")

    for item in payload.items:
        prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = prod_result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")

        line_total = product.selling_price * item.quantity
        subtotal += line_total

        order_items.append(OrderItem(
            product_id=product.id,
            variant_id=item.variant_id,
            quantity=item.quantity,
            unit_price=product.selling_price,  # Price locked at checkout time
            total_price=line_total,
            product_name=product.name,  # Snapshot — immune to future name changes
            product_sku=product.sku,
        ))

    # ------------------------------------------------------------------
    # 3. Calculate order financials
    # ------------------------------------------------------------------
    gst_amount = subtotal * Decimal("0.18")         # 18% GST on pre-tax subtotal
    delivery_charge = Decimal("0.00")               # Free delivery within Bangalore metro
    total = subtotal + gst_amount + delivery_charge

    # ------------------------------------------------------------------
    # 4. Generate order number: UE-YYYYMMDD-XXXXXX
    # ------------------------------------------------------------------
    order_number = f"UE-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid_mod.uuid4().hex[:6].upper()}"

    # ------------------------------------------------------------------
    # 5. Persist order (items are linked via the relationship)
    # ------------------------------------------------------------------
    order = Order(
        order_number=order_number,
        user_id=address.user_id,
        order_type=OrderType(payload.order_type),
        # Denormalize address as plain text for immutable order history
        shipping_address_text=f"{address.line1}, {address.line2 or ''}, {address.city} - {address.pincode}",
        shipping_pincode=address.pincode,
        subtotal=subtotal,
        gst_amount=gst_amount,
        delivery_charge=delivery_charge,
        total=total,
        estimated_delivery_at=datetime.now(timezone.utc) + timedelta(hours=settings.DELIVERY_PROMISE_HOURS),
        customer_notes=payload.customer_notes,
        items=order_items,
    )

    db.add(order)
    await db.flush()                    # Assigns UUIDs and FK constraints
    await db.refresh(order, ["items"])  # Eagerly load items for the response
    return order


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: UUID, new_status: str, db: AsyncSession = Depends(get_db)
):
    """
    Advance an order through its fulfilment lifecycle.

    Used by warehouse staff and ops dashboards to progress orders.
    When `new_status` is "delivered", the `delivered_at` timestamp is
    automatically set to the current UTC time.

    Returns HTTP 400 if `new_status` is not a valid OrderStatus enum value.
    """
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        # OrderStatus(new_status) raises ValueError for invalid strings
        order.status = OrderStatus(new_status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {new_status}")

    # Automatically record the delivery timestamp when the order is marked delivered
    if order.status == OrderStatus.DELIVERED:
        order.delivered_at = datetime.now(timezone.utc)

    await db.flush()
    return {"order_id": str(order.id), "status": order.status.value}
