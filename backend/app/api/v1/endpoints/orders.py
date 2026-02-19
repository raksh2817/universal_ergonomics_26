"""Order management endpoints."""

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
    # Resolve address
    addr_result = await db.execute(
        select(Address).where(Address.id == payload.shipping_address_id)
    )
    address = addr_result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=400, detail="Invalid shipping address")

    # Build order items and calculate totals
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
            unit_price=product.selling_price,
            total_price=line_total,
            product_name=product.name,
            product_sku=product.sku,
        ))

    gst_amount = subtotal * Decimal("0.18")
    delivery_charge = Decimal("0.00")  # Free delivery in Bangalore
    total = subtotal + gst_amount + delivery_charge

    order_number = f"UE-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid_mod.uuid4().hex[:6].upper()}"

    order = Order(
        order_number=order_number,
        user_id=address.user_id,
        order_type=OrderType(payload.order_type),
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
    await db.flush()
    await db.refresh(order, ["items"])
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
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        order.status = OrderStatus(new_status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {new_status}")

    if order.status == OrderStatus.DELIVERED:
        order.delivered_at = datetime.now(timezone.utc)

    await db.flush()
    return {"order_id": str(order.id), "status": order.status.value}
