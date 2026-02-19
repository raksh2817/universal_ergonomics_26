"""Competitor pricing and dynamic pricing rule models."""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import String, Numeric, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class CompetitorPrice(Base):
    """Scraped competitor prices from Amazon, Flipkart, etc."""
    __tablename__ = "competitor_prices"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id"), index=True
    )
    competitor_name: Mapped[str] = mapped_column(String(100))  # amazon, flipkart, greensoul, etc.
    competitor_product_url: Mapped[str] = mapped_column(String(1000))
    competitor_product_name: Mapped[str] = mapped_column(String(500), nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    mrp: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=True)
    rating: Mapped[Decimal] = mapped_column(Numeric(3, 2), nullable=True)
    review_count: Mapped[int] = mapped_column(nullable=True)
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)
    extra_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    scraped_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class PricingRule(Base):
    """Dynamic pricing rules engine."""
    __tablename__ = "pricing_rules"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, nullable=True)
    rule_type: Mapped[str] = mapped_column(String(50))  # undercut, margin_floor, demand_surge, clearance
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    priority: Mapped[int] = mapped_column(default=0)

    # Rule parameters stored as JSON for flexibility
    # e.g. {"undercut_percent": 5, "min_margin_percent": 15, "apply_to_categories": [...]}
    parameters: Mapped[dict] = mapped_column(JSON)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
