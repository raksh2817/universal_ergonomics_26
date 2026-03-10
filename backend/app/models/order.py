"""
Order management models.

Five entities are defined here:
  - OrderStatus   : Enum for the lifecycle of a fulfilment (pending → delivered)
  - OrderType     : Enum distinguishing B2C (individual) from B2B (corporate) orders
  - PaymentStatus : Enum tracking Razorpay payment state
  - Address       : Saved delivery address belonging to a user; also provides the
                    lat/lng needed for the delivery zone/charge calculation
  - Order         : Master order record with denormalized address snapshot, totals,
                    payment references, and delivery timestamps
  - OrderItem     : Line items inside an order; product name/SKU are snapshot-stored
                    so the order history is immune to future product changes

Key design decision — address denormalization:
  `shipping_address_text` stores a plain-text copy of the address at order time.
  This means that if a user later edits or deletes their address, previous orders
  still display the correct shipping information.
"""

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
    """
    Fulfilment lifecycle states in chronological order.
    Inherits from str so FastAPI can serialize/deserialize the enum directly.
    """
    PENDING = "pending"               # Created but not yet confirmed
    CONFIRMED = "confirmed"           # Payment received, being prepared
    PROCESSING = "processing"         # Being packed / loaded for dispatch
    SHIPPED = "shipped"               # Dispatched to logistics partner
    OUT_FOR_DELIVERY = "out_for_delivery"  # On the delivery vehicle
    DELIVERED = "delivered"           # Received by customer
    CANCELLED = "cancelled"           # Cancelled before delivery
    RETURNED = "returned"             # Post-delivery return initiated


class OrderType(str, enum.Enum):
    """Distinguishes direct consumer orders from bulk corporate (B2B) orders."""
    B2C = "b2c"
    B2B = "b2b"


class PaymentStatus(str, enum.Enum):
    """Tracks the Razorpay payment state independently of order fulfilment."""
    PENDING = "pending"     # Payment initiated but not captured
    PAID = "paid"           # Payment successfully captured
    FAILED = "failed"       # Payment attempt failed
    REFUNDED = "refunded"   # Refund issued (on cancellation / return)


class Address(Base):
    """
    Saved delivery address belonging to a user.

    lat/lng are populated via a geocoding step after address entry and are
    used by `delivery.py` to calculate the haversine distance from the
    Bangalore warehouse to determine free-delivery eligibility.
    """
    __tablename__ = "addresses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    label: Mapped[str] = mapped_column(String(50), default="Home")       # Display label e.g. "Home", "Office"
    full_name: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(15))
    line1: Mapped[str] = mapped_column(String(255))
    line2: Mapped[str] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Bangalore")
    state: Mapped[str] = mapped_column(String(100), default="Karnataka")
    pincode: Mapped[str] = mapped_column(String(10))
    # Coordinates populated by geocoding; used for delivery zone calculation
    latitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)  # Pre-selected at checkout


class Order(Base):
    """
    Master order record.

    `order_number` follows the pattern UE-YYYYMMDD-XXXXXX (generated in the
    orders endpoint) and is the human-readable reference shown to customers.

    Financial fields:
      total = subtotal + gst_amount + delivery_charge - discount_amount
    """
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number: Mapped[str] = mapped_column(String(30), unique=True, index=True)  # e.g. "UE-20240315-AB12CD"
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    order_type: Mapped[OrderType] = mapped_column(SAEnum(OrderType), default=OrderType.B2C)

    # ------------------------------------------------------------------
    # Address snapshot (denormalized for immutable order history)
    # ------------------------------------------------------------------
    shipping_address_text: Mapped[str] = mapped_column(Text)        # Human-readable full address
    shipping_pincode: Mapped[str] = mapped_column(String(10))       # Kept separate for zone lookup

    # ------------------------------------------------------------------
    # Financial totals (all in INR)
    # ------------------------------------------------------------------
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2))                                # Sum of line totals
    gst_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))                              # 18% of subtotal
    delivery_charge: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))  # 0 within Bangalore
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))  # Coupon / B2B discount
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2))                                   # Grand total charged

    # ------------------------------------------------------------------
    # Status tracking
    # ------------------------------------------------------------------
    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), default=OrderStatus.PENDING)
    payment_status: Mapped[PaymentStatus] = mapped_column(SAEnum(PaymentStatus), default=PaymentStatus.PENDING)
    # Razorpay IDs stored for webhook reconciliation and refunds
    razorpay_order_id: Mapped[str] = mapped_column(String(100), nullable=True)
    razorpay_payment_id: Mapped[str] = mapped_column(String(100), nullable=True)

    # ------------------------------------------------------------------
    # Delivery & assembly
    # ------------------------------------------------------------------
    estimated_delivery_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)  # Set when status→DELIVERED
    assembly_required: Mapped[bool] = mapped_column(Boolean, default=True)       # Checked at checkout
    assembly_completed: Mapped[bool] = mapped_column(Boolean, default=False)     # Marked by delivery team

    # ------------------------------------------------------------------
    # Notes
    # ------------------------------------------------------------------
    customer_notes: Mapped[str] = mapped_column(Text, nullable=True)   # Shown to warehouse team
    internal_notes: Mapped[str] = mapped_column(Text, nullable=True)   # Admin / ops notes (hidden from customer)

    # ------------------------------------------------------------------
    # Relations
    # ------------------------------------------------------------------
    # cascade ensures line items are deleted when the order is deleted
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")

    # ------------------------------------------------------------------
    # Timestamps (UTC)
    # ------------------------------------------------------------------
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class OrderItem(Base):
    """
    A single line item within an order.

    `product_name` and `product_sku` are intentionally snapshotted at order
    creation time so that future changes to the product catalogue do not alter
    the historical record shown to customers and operations teams.
    """
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"))
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"))
    # variant_id is nullable — None means the base product with no colour variant
    variant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=True
    )
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))            # Price per chair at order time
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))           # unit_price × quantity

    # Snapshot fields — immutable record of what was purchased
    product_name: Mapped[str] = mapped_column(String(255))
    product_sku: Mapped[str] = mapped_column(String(50))

    order: Mapped["Order"] = relationship(back_populates="items")
