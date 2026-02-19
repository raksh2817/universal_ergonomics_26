"""Pydantic schemas for product endpoints."""

from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None


class ProductImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    url: str
    alt_text: Optional[str] = None
    sort_order: int
    is_primary: bool


class ProductVariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    sku_suffix: str
    color: str
    material: Optional[str] = None
    price_adjustment: Decimal


class ProductListOut(BaseModel):
    """Lightweight product for listing pages."""
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    sku: str
    name: str
    slug: str
    tagline: Optional[str] = None
    base_price: Decimal
    selling_price: Decimal
    is_hero: bool
    is_b2b_available: bool
    ar_model_url: Optional[str] = None


class ProductDetailOut(ProductListOut):
    """Full product detail for PDP."""
    description: Optional[str] = None
    specs: Optional[dict] = None
    warranty_years: int
    weight_kg: Optional[Decimal] = None
    is_assembly_required: bool
    gst_percent: Decimal
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    category: Optional[CategoryOut] = None
    variants: list[ProductVariantOut] = []
    images: list[ProductImageOut] = []


class ProductCreate(BaseModel):
    sku: str
    name: str
    slug: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    base_price: Decimal
    selling_price: Decimal
    cost_price: Decimal
    gst_percent: Decimal = Decimal("18.00")
    specs: Optional[dict] = None
    warranty_years: int = 1
    weight_kg: Optional[Decimal] = None
    is_assembly_required: bool = True
    is_hero: bool = False
    is_b2b_available: bool = True
    ar_model_url: Optional[str] = None
    category_id: Optional[UUID] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    cost_price: Optional[Decimal] = None
    specs: Optional[dict] = None
    is_hero: Optional[bool] = None
    is_active: Optional[bool] = None
    ar_model_url: Optional[str] = None
