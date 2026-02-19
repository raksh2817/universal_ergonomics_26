"""Tests for B2B lead scoring."""

from decimal import Decimal
from unittest.mock import MagicMock

from app.services.leads.scorer import LeadScorer


def _make_lead(**kwargs):
    lead = MagicMock()
    lead.industry = kwargs.get("industry", "technology")
    lead.employee_count = kwargs.get("employee_count", 50)
    lead.estimated_quantity = kwargs.get("estimated_quantity", 20)
    lead.source = kwargs.get("source", "website")
    return lead


def test_tech_startup_scores_high():
    scorer = LeadScorer()
    lead = _make_lead(industry="technology", employee_count=100, estimated_quantity=50)
    score = scorer.initial_score(lead)
    assert score >= 70


def test_small_unknown_company_scores_low():
    scorer = LeadScorer()
    lead = _make_lead(industry="other", employee_count=5, estimated_quantity=None)
    lead.estimated_quantity = None
    score = scorer.initial_score(lead)
    assert score < 30


def test_referral_bonus():
    scorer = LeadScorer()
    lead_referral = _make_lead(source="referral")
    lead_cold = _make_lead(source="cold_outreach")
    score_referral = scorer.initial_score(lead_referral)
    score_cold = scorer.initial_score(lead_cold)
    assert score_referral > score_cold


def test_activity_scores():
    scorer = LeadScorer()
    assert scorer.activity_score("quote_requested") > scorer.activity_score("page_view")


def test_stage_classification():
    scorer = LeadScorer()
    assert scorer.classify_stage(Decimal("90")) == "qualified"
    assert scorer.classify_stage(Decimal("60")) == "contacted"
    assert scorer.classify_stage(Decimal("20")) == "new"
