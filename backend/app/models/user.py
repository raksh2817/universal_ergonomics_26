"""
User and B2B profile models.

Two tables are defined here:
  - User       : Core authentication and identity record for all customers
                 (both B2C shoppers and B2B account holders)
  - B2BProfile : Extended one-to-one record for corporate customers;
                 stores company details, GST number, credit limit, and a
                 tiered discount level (standard → silver → gold)

Flags on User:
  is_b2b    – Signals that a B2BProfile row exists for this user and that
              bulk/B2B pricing rules should apply
  is_admin  – Grants access to admin-only endpoints (inventory management,
              lead scoring, pricing rules)
  is_active – Soft-disable flag; inactive users cannot log in
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import String, Boolean, DateTime, ForeignKey, Numeric, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(Base):
    """
    Core user record shared by B2C shoppers and B2B account holders.

    Authentication uses email + bcrypt-hashed password.  Phone is optional
    but must be unique when provided (used for WhatsApp order notifications).
    """
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(15), unique=True, index=True, nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255))  # bcrypt hash — never store plaintext
    full_name: Mapped[str] = mapped_column(String(200))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)   # False = account suspended
    is_b2b: Mapped[bool] = mapped_column(Boolean, default=False)     # True = B2BProfile row exists
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)   # True = full admin access
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class B2BProfile(Base):
    """
    Extended profile for B2B customers (startups/SMEs).

    `unique=True` on user_id enforces the one-to-one relationship with User.
    `discount_tier` controls which pricing tier is applied beyond the base
    B2B discount: standard (15%) → silver → gold (higher % TBD by sales team).
    `gst_number` enables the platform to issue GST-compliant invoices to the
    company, which is a key purchase requirement for Indian corporate buyers.
    `credit_limit` is reserved for future net-30 / invoice payment support.
    """
    __tablename__ = "b2b_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    company_name: Mapped[str] = mapped_column(String(255))
    gst_number: Mapped[str] = mapped_column(String(20), nullable=True)          # For GST invoice generation
    industry: Mapped[str] = mapped_column(String(100), nullable=True)           # Used by lead scorer
    employee_count: Mapped[int] = mapped_column(Integer, nullable=True)         # Proxy for order size
    billing_address: Mapped[str] = mapped_column(Text, nullable=True)           # Separate from shipping
    credit_limit: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))  # For future net-30
    discount_tier: Mapped[str] = mapped_column(String(20), default="standard")  # standard, silver, gold
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)           # Set by sales after vetting
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
