"""
B2B lead scoring engine.

Scores leads based on firmographic data and engagement signals.
Higher score = more likely to convert. Used to prioritize sales outreach.

Scoring Factors:
  - Employee count (proxy for order size)
  - Industry fit (tech companies are primary target)
  - Location (Bangalore = higher score due to free delivery moat)
  - Estimated quantity
  - Engagement signals (page views, quote requests, etc.)
"""

from decimal import Decimal
from typing import Optional

from app.models.lead import Lead


# Industry weights — tech companies in Bangalore are the sweet spot
INDUSTRY_WEIGHTS = {
    "technology": 20,
    "software": 20,
    "fintech": 18,
    "saas": 18,
    "startup": 15,
    "ecommerce": 12,
    "consulting": 10,
    "healthcare": 8,
    "education": 8,
    "manufacturing": 5,
    "other": 3,
}

# Engagement action scores
ACTIVITY_SCORES = {
    "page_view": Decimal("1.0"),
    "product_view": Decimal("2.0"),
    "quote_requested": Decimal("15.0"),
    "email_opened": Decimal("3.0"),
    "email_clicked": Decimal("5.0"),
    "call": Decimal("10.0"),
    "meeting_scheduled": Decimal("20.0"),
    "proposal_sent": Decimal("15.0"),
    "sample_requested": Decimal("12.0"),
}


class LeadScorer:
    """Calculates and updates lead scores."""

    def initial_score(self, lead: Lead) -> Decimal:
        """Calculate the initial score when a lead is created."""
        score = Decimal("0")

        # Industry fit
        industry = (lead.industry or "other").lower()
        for key, weight in INDUSTRY_WEIGHTS.items():
            if key in industry:
                score += Decimal(str(weight))
                break
        else:
            score += Decimal(str(INDUSTRY_WEIGHTS["other"]))

        # Employee count (more employees = larger potential order)
        if lead.employee_count:
            if lead.employee_count >= 500:
                score += Decimal("25")
            elif lead.employee_count >= 100:
                score += Decimal("20")
            elif lead.employee_count >= 50:
                score += Decimal("15")
            elif lead.employee_count >= 10:
                score += Decimal("10")
            else:
                score += Decimal("5")

        # Estimated quantity
        if lead.estimated_quantity:
            if lead.estimated_quantity >= 100:
                score += Decimal("30")
            elif lead.estimated_quantity >= 50:
                score += Decimal("25")
            elif lead.estimated_quantity >= 20:
                score += Decimal("20")
            elif lead.estimated_quantity >= 10:
                score += Decimal("15")
            elif lead.estimated_quantity >= 5:
                score += Decimal("10")

        # Source quality
        source_scores = {
            "referral": Decimal("15"),
            "website": Decimal("10"),
            "event": Decimal("8"),
            "cold_outreach": Decimal("3"),
        }
        score += source_scores.get(lead.source, Decimal("5"))

        return score

    def activity_score(self, activity_type: str) -> Decimal:
        """Return the score delta for a given activity type."""
        return ACTIVITY_SCORES.get(activity_type, Decimal("1.0"))

    def classify_stage(self, score: Decimal) -> str:
        """Suggest a lead stage based on score."""
        if score >= 80:
            return "qualified"
        elif score >= 50:
            return "contacted"
        else:
            return "new"
