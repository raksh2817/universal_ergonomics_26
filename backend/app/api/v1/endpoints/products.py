"""Product catalog endpoints."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.product import Product, ProductVariant, ProductImage
from app.schemas.product import (
    ProductCreate, ProductDetailOut, ProductListOut, ProductUpdate,
)

router = APIRouter()


@router.get("/", response_model=list[ProductListOut])
async def list_products(
    category_slug: Optional[str] = None,
    hero_only: bool = False,
    b2b_only: bool = False,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", pattern="^(selling_price|name|created_at)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    skip: int = 0,
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.is_active == True)  # noqa: E712

    if hero_only:
        query = query.where(Product.is_hero == True)  # noqa: E712
    if b2b_only:
        query = query.where(Product.is_b2b_available == True)  # noqa: E712
    if min_price is not None:
        query = query.where(Product.selling_price >= min_price)
    if max_price is not None:
        query = query.where(Product.selling_price <= max_price)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))

    order_col = getattr(Product, sort_by)
    query = query.order_by(order_col.desc() if sort_order == "desc" else order_col.asc())
    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{slug}", response_model=ProductDetailOut)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    query = (
        select(Product)
        .where(Product.slug == slug, Product.is_active == True)  # noqa: E712
        .options(
            selectinload(Product.variants),
            selectinload(Product.images),
            selectinload(Product.category),
        )
    )
    result = await db.execute(query)
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=ProductDetailOut, status_code=201)
async def create_product(payload: ProductCreate, db: AsyncSession = Depends(get_db)):
    product = Product(**payload.model_dump())
    db.add(product)
    await db.flush()
    await db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=ProductDetailOut)
async def update_product(
    product_id: UUID, payload: ProductUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    await db.flush()
    await db.refresh(product)
    return product
