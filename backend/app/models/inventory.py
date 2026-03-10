"""
Inventory models — synced via Telegram/WhatsApp bot from warehouse.

Two tables are defined here:
  - InventoryRecord : Current stock snapshot for each product (or variant).
                      Updated by the bot commands (ADD / REMOVE / ADJUST) and
                      by the order placement flow (reserve) and cancellation (release).
  - InventoryLog    : Immutable audit trail — one row per stock change event,
                      capturing who changed it, why, and from which source system.

Available quantity formula:
  available = quantity_on_hand - quantity_reserved

quantity_reserved is incremented when an order is placed but not yet shipped,
preventing overselling when multiple orders arrive simultaneously.

Change sources (stored in InventoryLog.source):
  bot_telegram   – Warehouse team via Telegram bot command
  bot_whatsapp   – Warehouse team via WhatsApp message
  order          – Automated deduction when an order is confirmed
  manual         – Direct admin panel adjustment
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class InventoryRecord(Base):
    """
    Current stock level for a product (or a specific variant when variant_id is set).

    `reorder_point` triggers a LOW STOCK alert in the Telegram/WhatsApp bot
    when quantity_on_hand falls to or below this threshold.
    `warehouse_location` is a bin/shelf reference for physical picking.
    """
    __tablename__ = "inventory_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"), index=True)
    # None means the record applies to all variants of the product (base-level tracking)
    variant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=True
    )
    quantity_on_hand: Mapped[int] = mapped_column(Integer, default=0)      # Physical units in warehouse
    quantity_reserved: Mapped[int] = mapped_column(Integer, default=0)     # Units held for pending orders
    reorder_point: Mapped[int] = mapped_column(Integer, default=5)         # Alert threshold
    warehouse_location: Mapped[str] = mapped_column(String(100), default="BLR-MAIN")  # Bin reference
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    @property
    def available_quantity(self) -> int:
        """Units that can still be sold: on-hand minus already-reserved stock."""
        return self.quantity_on_hand - self.quantity_reserved


class InventoryLog(Base):
    """
    Audit trail for every stock change.
    Sources: bot_telegram, bot_whatsapp, order_placed, order_cancelled, manual.
    """
    __tablename__ = "inventory_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inventory_record_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inventory_records.id")
    )
    change_type: Mapped[str] = mapped_column(String(30))  # add, remove, adjust, reserve, release
    quantity_change: Mapped[int] = mapped_column(Integer)
    source: Mapped[str] = mapped_column(String(50))  # bot_telegram, bot_whatsapp, order, manual
    note: Mapped[str] = mapped_column(Text, nullable=True)
    created_by: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
