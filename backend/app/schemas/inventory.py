"""Pydantic schemas for inventory endpoints."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class InventoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    product_id: UUID
    variant_id: Optional[UUID] = None
    quantity_on_hand: int
    quantity_reserved: int
    reorder_point: int
    warehouse_location: str
    updated_at: datetime


class InventoryUpdate(BaseModel):
    """Used by the bot and admin to update stock."""
    product_sku: str
    variant_sku_suffix: Optional[str] = None
    quantity_change: int
    change_type: str  # add, remove, adjust
    source: str  # bot_telegram, bot_whatsapp, manual
    note: Optional[str] = None
    created_by: Optional[str] = None


class InventoryBotMessage(BaseModel):
    """Parsed message from Telegram/WhatsApp bot."""
    raw_text: str
    product_sku: Optional[str] = None
    quantity: Optional[int] = None
    action: Optional[str] = None  # add, remove, check
