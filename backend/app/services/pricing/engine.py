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
    def __init__(self, db: AsyncSession):
        self.db = db

    async def recommend_price(self, product_id: UUID) -> dict:
        """
        Calculate a recommended selling price for a product.

        Returns:
            {
                "product_id": str,
                "current_price": float,
                "recommended_price": float,
                "min_competitor_price": float | None,
                "rules_applied": [str],
                "reasoning": str,
            }
        """
        # Fetch product
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            return {"error": "Product not found"}

        # Fetch latest competitor prices
        comp_result = await self.db.execute(
            select(func.min(CompetitorPrice.price))
            .where(CompetitorPrice.product_id == product_id)
            .where(CompetitorPrice.in_stock == True)  # noqa: E712
        )
        min_competitor = comp_result.scalar()

        # Fetch active rules ordered by priority
        rules_result = await self.db.execute(
            select(PricingRule)
            .where(PricingRule.is_active == True)  # noqa: E712
            .order_by(PricingRule.priority.desc())
        )
        rules = rules_result.scalars().all()

        # Fetch inventory
        inv_result = await self.db.execute(
            select(InventoryRecord).where(InventoryRecord.product_id == product_id)
        )
        inventory = inv_result.scalar_one_or_none()

        # Calculate recommended price
        recommended = product.selling_price
        rules_applied = []
        reasoning_parts = []

        for rule in rules:
            params = rule.parameters or {}

            if rule.rule_type == "undercut" and min_competitor:
                undercut_pct = Decimal(str(params.get("undercut_percent", 5)))
                undercut_price = min_competitor * (1 - undercut_pct / 100)
                if undercut_price < recommended:
                    recommended = undercut_price
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Undercut competitor at ₹{min_competitor} by {undercut_pct}%"
                    )

            elif rule.rule_type == "margin_floor":
                min_margin = Decimal(str(params.get("min_margin_percent", 15)))
                floor_price = product.cost_price * (1 + min_margin / 100)
                if recommended < floor_price:
                    recommended = floor_price
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Raised to margin floor (cost ₹{product.cost_price} + {min_margin}%)"
                    )

            elif rule.rule_type == "demand_surge" and inventory:
                low_threshold = params.get("low_stock_threshold", 3)
                surge_pct = Decimal(str(params.get("surge_percent", 10)))
                if inventory.quantity_on_hand <= low_threshold:
                    recommended = recommended * (1 + surge_pct / 100)
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Low stock surge: only {inventory.quantity_on_hand} units left"
                    )

            elif rule.rule_type == "clearance" and inventory:
                high_threshold = params.get("high_stock_threshold", 50)
                clearance_pct = Decimal(str(params.get("clearance_percent", 15)))
                if inventory.quantity_on_hand >= high_threshold:
                    recommended = recommended * (1 - clearance_pct / 100)
                    rules_applied.append(rule.name)
                    reasoning_parts.append(
                        f"Clearance: {inventory.quantity_on_hand} units in stock"
                    )

        # Round to nearest ₹9 (psychological pricing)
        recommended = round(recommended / 10) * 10 - 1

        return {
            "product_id": str(product_id),
            "current_price": float(product.selling_price),
            "cost_price": float(product.cost_price),
            "recommended_price": float(max(recommended, product.cost_price)),
            "min_competitor_price": float(min_competitor) if min_competitor else None,
            "rules_applied": rules_applied,
            "reasoning": "; ".join(reasoning_parts) if reasoning_parts else "No rules triggered, using current price",
        }
