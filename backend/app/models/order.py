"""Order management models."""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    String, Text, Numeric, Integer, Boolean, DateTime, ForeignKey, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.core.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"


class OrderType(str, enum.Enum):
    B2C = "b2c"
    B2B = "b2b"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    label: Mapped[str] = mapped_column(String(50), default="Home")
    full_name: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(15))
    line1: Mapped[str] = mapped_column(String(255))
    line2: Mapped[str] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Bangalore")
    state: Mapped[str] = mapped_column(String(100), default="Karnataka")
    pincode: Mapped[str] = mapped_column(String(10))
    latitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    order_type: Mapped[OrderType] = mapped_column(SAEnum(OrderType), default=OrderType.B2C)

    # Address snapshot (denormalized for order history)
    shipping_address_text: Mapped[str] = mapped_column(Text)
    shipping_pincode: Mapped[str] = mapped_column(String(10))

    # Totals
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    gst_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    delivery_charge: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    # Status
    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), default=OrderStatus.PENDING)
    payment_status: Mapped[PaymentStatus] = mapped_column(SAEnum(PaymentStatus), default=PaymentStatus.PENDING)
    razorpay_order_id: Mapped[str] = mapped_column(String(100), nullable=True)
    razorpay_payment_id: Mapped[str] = mapped_column(String(100), nullable=True)

    # Delivery
    estimated_delivery_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    assembly_required: Mapped[bool] = mapped_column(Boolean, default=True)
    assembly_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Notes
    customer_notes: Mapped[str] = mapped_column(Text, nullable=True)
    internal_notes: Mapped[str] = mapped_column(Text, nullable=True)

    # Relations
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"))
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"))
    variant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=True
    )
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    # Snapshot for historical record
    product_name: Mapped[str] = mapped_column(String(255))
    product_sku: Mapped[str] = mapped_column(String(50))

    order: Mapped["Order"] = relationship(back_populates="items")
