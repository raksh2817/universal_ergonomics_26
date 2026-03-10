"""
Product catalog models for office chairs.

Three entity types are defined here:
  - Category       : Hierarchical product categories (supports parent_id self-join)
  - Product        : Core chair model with pricing, specs, SEO and display flags
  - ProductVariant : Color/material options sharing a base product (may carry a
                     price adjustment, e.g. leather costs ₹500 more)
  - ProductImage   : Ordered gallery images linked to a product

Relationships:
  Category  1 ──< Product  1 ──< ProductVariant
                            1 ──< ProductImage

Pricing Fields (on Product):
  base_price    – Original / MRP shown as crossed-out price on the storefront
  selling_price – Actual checkout price; also the starting point for the
                  dynamic pricing engine before rules are applied
  cost_price    – Manufacturing / landed cost (private, used for margin-floor rule)
  gst_percent   – GST rate applied at checkout (18 % for office furniture in India)
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    String, Text, Numeric, Integer, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Category(Base):
    """
    Product category tree.

    `parent_id` creates a self-referential FK enabling nested categories
    (e.g. "Chairs" > "Executive Chairs").  Currently one level of nesting is used.
    """
    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)  # URL-safe identifier
    description: Mapped[str] = mapped_column(Text, nullable=True)
    # Self-referential FK — nullable means this is a root-level category
    parent_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Back-reference to all products belonging to this category
    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(Base):
    """
    Core product model. Each product = one office chair model.
    Variants handle color/material options.
    """
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku: Mapped[str] = mapped_column(String(50), unique=True, index=True)    # e.g. "UE-EXEC-001"
    name: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(280), unique=True, index=True)  # URL path segment
    tagline: Mapped[str] = mapped_column(String(255), nullable=True)         # Short marketing line
    description: Mapped[str] = mapped_column(Text, nullable=True)            # Long-form copy

    # ------------------------------------------------------------------
    # Pricing  (all amounts in INR)
    # ------------------------------------------------------------------
    base_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))              # MRP / original price
    selling_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))           # Actual checkout price
    cost_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))              # Internal cost (private)
    gst_percent: Mapped[Decimal] = mapped_column(Numeric(4, 2), default=Decimal("18.00"))

    # ------------------------------------------------------------------
    # Chair-specific attributes
    # ------------------------------------------------------------------
    # Flexible JSON blob stores per-model specs shown in the product detail table
    specs: Mapped[dict] = mapped_column(JSON, nullable=True, comment="weight_capacity_kg, seat_height_range, tilt_mechanism, armrest_type, etc.")
    warranty_years: Mapped[int] = mapped_column(Integer, default=1)
    weight_kg: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=True)    # Shipping weight
    is_assembly_required: Mapped[bool] = mapped_column(Boolean, default=True)   # True for most chairs

    # ------------------------------------------------------------------
    # SEO & Display flags
    # ------------------------------------------------------------------
    meta_title: Mapped[str] = mapped_column(String(255), nullable=True)
    meta_description: Mapped[str] = mapped_column(Text, nullable=True)
    is_hero: Mapped[bool] = mapped_column(Boolean, default=False, comment="Hero SKU flag for launch lineup")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)           # Soft-delete / hide
    is_b2b_available: Mapped[bool] = mapped_column(Boolean, default=True)    # Show in B2B catalogue

    # ------------------------------------------------------------------
    # 3D / AR (planned future feature)
    # ------------------------------------------------------------------
    ar_model_url: Mapped[str] = mapped_column(String(500), nullable=True, comment="URL to .glb model for AR view")

    # ------------------------------------------------------------------
    # Relations
    # ------------------------------------------------------------------
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True
    )
    category: Mapped["Category"] = relationship(back_populates="products")
    # cascade ensures variants/images are deleted when the parent product is removed
    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    images: Mapped[list["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")

    # ------------------------------------------------------------------
    # Timestamps (UTC, timezone-aware)
    # ------------------------------------------------------------------
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),  # Auto-updated by SQLAlchemy on every flush
    )


class ProductVariant(Base):
    """
    Color / material variants of a product.

    Full variant SKU = parent SKU + "-" + sku_suffix (e.g. "UE-EXEC-001-BLK").
    `price_adjustment` is added to (or subtracted from) the parent's selling_price
    to derive the effective variant price.
    """
    __tablename__ = "product_variants"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"))
    sku_suffix: Mapped[str] = mapped_column(String(20))               # e.g. "BLK", "GRY", "NVY"
    color: Mapped[str] = mapped_column(String(50))
    material: Mapped[str] = mapped_column(String(100), nullable=True)
    # Delta added to parent selling_price; positive = surcharge, negative = discount
    price_adjustment: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    product: Mapped["Product"] = relationship(back_populates="variants")


class ProductImage(Base):
    """
    Ordered gallery images for a product.

    `sort_order` controls display sequence (lower = shown first).
    `is_primary` marks the thumbnail shown on product listing cards.
    Images are stored on S3; this table only holds URLs and metadata.
    """
    __tablename__ = "product_images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"))
    url: Mapped[str] = mapped_column(String(500))                         # S3 or CDN URL
    alt_text: Mapped[str] = mapped_column(String(255), nullable=True)     # Accessibility alt text
    sort_order: Mapped[int] = mapped_column(Integer, default=0)           # Display order
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)      # Listing card thumbnail

    product: Mapped["Product"] = relationship(back_populates="images")
