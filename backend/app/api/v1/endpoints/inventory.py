"""Inventory management endpoints (used by bot + admin)."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.inventory import InventoryRecord, InventoryLog
from app.models.product import Product
from app.schemas.inventory import InventoryOut, InventoryUpdate

router = APIRouter()


@router.get("/", response_model=list[InventoryOut])
async def list_inventory(
    low_stock_only: bool = False,
    db: AsyncSession = Depends(get_db),
):
    query = select(InventoryRecord)
    if low_stock_only:
        query = query.where(
            InventoryRecord.quantity_on_hand <= InventoryRecord.reorder_point
        )
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{product_id}", response_model=InventoryOut)
async def get_inventory(product_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InventoryRecord).where(InventoryRecord.product_id == product_id)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Inventory record not found")
    return record


@router.post("/update", response_model=InventoryOut)
async def update_inventory(payload: InventoryUpdate, db: AsyncSession = Depends(get_db)):
    """
    Primary endpoint for the Telegram/WhatsApp bot and admin panel
    to update stock levels.
    """
    # Find product by SKU
    prod_result = await db.execute(
        select(Product).where(Product.sku == payload.product_sku)
    )
    product = prod_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product SKU {payload.product_sku} not found")

    # Find or create inventory record
    inv_result = await db.execute(
        select(InventoryRecord).where(InventoryRecord.product_id == product.id)
    )
    record = inv_result.scalar_one_or_none()
    if not record:
        record = InventoryRecord(product_id=product.id)
        db.add(record)
        await db.flush()

    # Apply change
    if payload.change_type == "add":
        record.quantity_on_hand += payload.quantity_change
    elif payload.change_type == "remove":
        record.quantity_on_hand = max(0, record.quantity_on_hand - payload.quantity_change)
    elif payload.change_type == "adjust":
        record.quantity_on_hand = payload.quantity_change
    else:
        raise HTTPException(status_code=400, detail=f"Invalid change_type: {payload.change_type}")

    # Create audit log
    log = InventoryLog(
        inventory_record_id=record.id,
        change_type=payload.change_type,
        quantity_change=payload.quantity_change,
        source=payload.source,
        note=payload.note,
        created_by=payload.created_by,
    )
    db.add(log)
    await db.flush()
    await db.refresh(record)
    return record
