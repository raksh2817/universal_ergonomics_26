"""
Dynamic pricing engine.

Takes competitor data + pricing rules and recommends optimal selling prices.

Rule Types:
  - undercut: Price X% below cheapest competitor
  - margin_floor: Never go below cost + min margin %
  - demand_surge: Increase price when stock is low and demand is high
  - clearance: Discount slow-moving items
"""

import logging
from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.pricing import CompetitorPrice, PricingRule
from app.models.product import Product
from app.models.inventory import InventoryRecord

logger = logging.getLogger(__name__)


class PricingEngine:
    """
    Stateless pricing engine that takes a product_id and returns a price recommendation.

    Instantiated per-request by the pricing API endpoint with the request's DB session.
    """

    def __init__(self, db: AsyncSession):
        self.db = db  # Async SQLAlchemy session injected by FastAPI dependency

    async def recommend_price(self, product_id: UUID) -> dict:
        """
        Calculate a recommended selling price for a product.

        Algorithm:
          1. Start from the product's current selling_price as the baseline.
          2. Fetch the minimum competitor price (in-stock listings only).
          3. Fetch all active PricingRules sorted by priority (highest first).
          4. Fetch the current InventoryRecord to check stock levels.
          5. Apply each rule in priority order, mutating `recommended` as needed.
          6. Round to the nearest ₹x9 for psychological pricing (e.g. ₹9,999).
          7. Clamp the result to never go below cost_price.

        Returns:
            dict with keys:
              product_id          – UUID string
              current_price       – Existing selling_price (for comparison)
              cost_price          – Internal cost (for transparency in the admin UI)
              recommended_price   – Output of the engine
              min_competitor_price – Lowest in-stock competitor price or None
              rules_applied       – Names of rules that actually changed the price
              reasoning           – Human-readable explanation string
        """
        # ------------------------------------------------------------------
        # 1. Load product
        # ------------------------------------------------------------------
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            return {"error": "Product not found"}

        # ------------------------------------------------------------------
        # 2. Fetch minimum in-stock competitor price
        #    Only considers listings currently marked as in_stock=True so we
        #    don't undercut an out-of-stock competitor listing.
        # ------------------------------------------------------------------
        comp_result = await self.db.execute(
            select(func.min(CompetitorPrice.price))
            .where(CompetitorPrice.product_id == product_id)
            .where(CompetitorPrice.in_stock == True)  # noqa: E712
        )
        min_competitor = comp_result.scalar()  # None if no competitor data exists

        # ------------------------------------------------------------------
        # 3. Fetch active pricing rules in descending priority order
        #    Higher priority rules are applied first; each rule may further
        #    adjust the price set by a prior rule.
        # ------------------------------------------------------------------
        rules_result = await self.db.execute(
            select(PricingRule)
            .where(PricingRule.is_active == True)  # noqa: E712
            .order_by(PricingRule.priority.desc())
        )
        rules = rules_result.scalars().all()

        # ------------------------------------------------------------------
        # 4. Fetch inventory for stock-level-dependent rules
        # ------------------------------------------------------------------
        inv_result = await self.db.execute(
            select(InventoryRecord).where(InventoryRecord.product_id == product_id)
        )
        inventory = inv_result.scalar_one_or_none()

        # ------------------------------------------------------------------
        # 5. Apply rules sequentially
        # ------------------------------------------------------------------
        recommended = product.selling_price  # Starting price baseline
        rules_applied = []
        reasoning_parts = []

        for rule in rules:
            params = rule.parameters or {}

            # -- undercut: price X% below the cheapest in-stock competitor --
            if rule.rule_type == "undercut" and min_competitor:
                undercut_pct = Decimal(str(params.get("undercut_percent", 5)))
                undercut_price = min_competitor * (1 - undercut_pct / 100)
                # Only apply if it actually lowers the price
                if undercut_price < recommended:
                    recommended = undercut_price
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Undercut competitor at ₹{min_competitor} by {undercut_pct}%"
                    )

            # -- margin_floor: raise price if it would drop below cost + min margin --
            elif rule.rule_type == "margin_floor":
                min_margin = Decimal(str(params.get("min_margin_percent", 15)))
                floor_price = product.cost_price * (1 + min_margin / 100)
                if recommended < floor_price:
                    recommended = floor_price
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Raised to margin floor (cost ₹{product.cost_price} + {min_margin}%)"
                    )

            # -- demand_surge: increase price when stock is critically low --
            elif rule.rule_type == "demand_surge" and inventory:
                low_threshold = params.get("low_stock_threshold", 3)
                surge_pct = Decimal(str(params.get("surge_percent", 10)))
                if inventory.quantity_on_hand <= low_threshold:
                    recommended = recommended * (1 + surge_pct / 100)
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Low stock surge: only {inventory.quantity_on_hand} units left"
                    )

            # -- clearance: discount slow-moving overstock items --
            elif rule.rule_type == "clearance" and inventory:
                high_threshold = params.get("high_stock_threshold", 50)
                clearance_pct = Decimal(str(params.get("clearance_percent", 15)))
                if inventory.quantity_on_hand >= high_threshold:
                    recommended = recommended * (1 - clearance_pct / 100)
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Clearance: {inventory.quantity_on_hand} units in stock"
                    )

        # ------------------------------------------------------------------
        # 6. Psychological pricing: round to nearest ₹X9
        #    e.g. ₹10,000 → ₹9,999  |  ₹10,500 → ₹10,499
        # ------------------------------------------------------------------
        recommended = round(recommended / 10) * 10 - 1

        return {
            "product_id": str(product_id),
            "current_price": float(product.selling_price),
            "cost_price": float(product.cost_price),
            # 7. Clamp: never go below cost_price to avoid selling at a loss
            "recommended_price": float(max(recommended, product.cost_price)),
            "min_competitor_price": float(min_competitor) if min_competitor else None,
            "rules_applied": rules_applied,
            "reasoning": "; ".join(reasoning_parts) if reasoning_parts else "No rules triggered, using current price",
        }
