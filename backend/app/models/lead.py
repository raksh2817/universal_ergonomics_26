"""B2B lead scoring models."""

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import String, Numeric, DateTime, Integer, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Lead(Base):
    """B2B lead for startups and SMEs in Bangalore."""
    __tablename__ = "leads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name: Mapped[str] = mapped_column(String(255))
    contact_name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(15), nullable=True)
    source: Mapped[str] = mapped_column(String(100))  # website, referral, cold_outreach, event
    industry: Mapped[str] = mapped_column(String(100), nullable=True)
    employee_count: Mapped[int] = mapped_column(Integer, nullable=True)
    estimated_quantity: Mapped[int] = mapped_column(Integer, nullable=True)

    # Scoring
    score: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("0.00"))
    stage: Mapped[str] = mapped_column(String(50), default="new")  # new, contacted, qualified, proposal, won, lost

    notes: Mapped[str] = mapped_column(Text, nullable=True)
    extra_data: Mapped[dict] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class LeadActivity(Base):
    """Activity log for lead interactions."""
    __tablename__ = "lead_activities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True)
    activity_type: Mapped[str] = mapped_column(String(50))  # email_opened, page_view, quote_requested, call
    description: Mapped[str] = mapped_column(Text, nullable=True)
    score_delta: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("0.00"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
