"""B2B lead management endpoints."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import require_admin
from app.models.lead import Lead, LeadActivity

router = APIRouter()


class LeadCreate(BaseModel):
    company_name: str
    contact_name: str
    email: EmailStr
    source: str = "website"
    phone: Optional[str] = None
    industry: Optional[str] = None
    employee_count: Optional[int] = None
    estimated_quantity: Optional[int] = None


@router.get("/")
async def list_leads(
    stage: Optional[str] = None,
    min_score: Optional[float] = None,
    sort_by: str = Query("score", pattern="^(score|created_at|company_name)$"),
    skip: int = 0,
    limit: int = Query(20, le=100),
    _admin=Depends(require_admin),
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
            "id": str(lead.id),
            "company_name": lead.company_name,
            "contact_name": lead.contact_name,
            "email": lead.email,
            "source": lead.source,
            "score": float(lead.score),
            "stage": lead.stage,
            "estimated_quantity": lead.estimated_quantity,
            "created_at": lead.created_at.isoformat(),
        }
        for lead in leads
    ]


@router.post("/", status_code=201)
async def create_lead(
    payload: LeadCreate,
    db: AsyncSession = Depends(get_db),
):
    lead = Lead(
        company_name=payload.company_name,
        contact_name=payload.contact_name,
        email=payload.email,
        phone=payload.phone,
        source=payload.source,
        industry=payload.industry,
        employee_count=payload.employee_count,
        estimated_quantity=payload.estimated_quantity,
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
async def get_lead_activities(
    lead_id: UUID,
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
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
