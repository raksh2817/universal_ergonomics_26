"""Competitor pricing and dynamic pricing endpoints."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.pricing import CompetitorPrice, PricingRule

router = APIRouter()


@router.get("/competitors/{product_id}")
async def get_competitor_prices(
    product_id: UUID,
    competitor: Optional[str] = None,
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(CompetitorPrice)
        .where(CompetitorPrice.product_id == product_id)
        .order_by(CompetitorPrice.scraped_at.desc())
        .limit(limit)
    )
    if competitor:
        query = query.where(CompetitorPrice.competitor_name == competitor)

    result = await db.execute(query)
    rows = result.scalars().all()
    return [
        {
            "competitor": r.competitor_name,
            "price": float(r.price),
            "mrp": float(r.mrp) if r.mrp else None,
            "rating": float(r.rating) if r.rating else None,
            "in_stock": r.in_stock,
            "scraped_at": r.scraped_at.isoformat(),
        }
        for r in rows
    ]


@router.get("/rules")
async def list_pricing_rules(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PricingRule).where(PricingRule.is_active == True).order_by(PricingRule.priority.desc())  # noqa: E712
    )
    rules = result.scalars().all()
    return [
        {
            "id": str(r.id),
            "name": r.name,
            "rule_type": r.rule_type,
            "priority": r.priority,
            "parameters": r.parameters,
        }
        for r in rules
    ]


@router.get("/recommendation/{product_id}")
async def get_price_recommendation(product_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Returns a recommended selling price based on competitor data and pricing rules.
    This is a placeholder — the actual logic lives in services/pricing/.
    """
    from app.services.pricing.engine import PricingEngine
    engine = PricingEngine(db)
    recommendation = await engine.recommend_price(product_id)
    return recommendation
