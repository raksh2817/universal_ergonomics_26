"""B2B lead management endpoints."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.lead import Lead, LeadActivity

router = APIRouter()


@router.get("/")
async def list_leads(
    stage: Optional[str] = None,
    min_score: Optional[float] = None,
    sort_by: str = Query("score", pattern="^(score|created_at|company_name)$"),
    skip: int = 0,
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Lead)
    if stage:
        query = query.where(Lead.stage == stage)
    if min_score is not None:
        query = query.where(Lead.score >= min_score)

    order_col = getattr(Lead, sort_by)
    query = query.order_by(order_col.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    leads = result.scalars().all()
    return [
        {
            "id": str(l.id),
            "company_name": l.company_name,
            "contact_name": l.contact_name,
            "email": l.email,
            "source": l.source,
            "score": float(l.score),
            "stage": l.stage,
            "estimated_quantity": l.estimated_quantity,
            "created_at": l.created_at.isoformat(),
        }
        for l in leads
    ]


@router.post("/", status_code=201)
async def create_lead(
    company_name: str,
    contact_name: str,
    email: str,
    source: str = "website",
    phone: Optional[str] = None,
    industry: Optional[str] = None,
    employee_count: Optional[int] = None,
    estimated_quantity: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    lead = Lead(
        company_name=company_name,
        contact_name=contact_name,
        email=email,
        phone=phone,
        source=source,
        industry=industry,
        employee_count=employee_count,
        estimated_quantity=estimated_quantity,
    )
    # Auto-score on creation
    from app.services.leads.scorer import LeadScorer
    scorer = LeadScorer()
    lead.score = scorer.initial_score(lead)

    db.add(lead)
    await db.flush()
    await db.refresh(lead)
    return {"id": str(lead.id), "score": float(lead.score), "stage": lead.stage}


@router.get("/{lead_id}/activities")
async def get_lead_activities(lead_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LeadActivity)
        .where(LeadActivity.lead_id == lead_id)
        .order_by(LeadActivity.created_at.desc())
    )
    activities = result.scalars().all()
    return [
        {
            "activity_type": a.activity_type,
            "description": a.description,
            "score_delta": float(a.score_delta),
            "created_at": a.created_at.isoformat(),
        }
        for a in activities
    ]
