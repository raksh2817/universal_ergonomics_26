"""
Seed script to load 15 Hero SKUs and initial data into the database.

Usage: python -m app.utils.seed
"""

import asyncio
import json
from decimal import Decimal
from pathlib import Path

from sqlalchemy import select
from slugify import slugify

from app.core.database import engine, async_session_factory, Base
from app.models.product import Product, Category
from app.models.inventory import InventoryRecord
from app.models.pricing import PricingRule


SEED_FILE = Path(__file__).parent.parent.parent.parent / "data" / "seed" / "hero_skus.json"


async def seed_categories(session):
    """Create product categories."""
    categories = [
        "Executive Chairs", "Mid-Back Chairs", "Task Chairs",
        "Gaming Chairs", "Ergonomic Chairs", "Visitor Chairs",
        "Drafting Stools", "B2B Bulk Chairs",
    ]
    cat_map = {}
    for name in categories:
        slug = slugify(name)
        result = await session.execute(select(Category).where(Category.slug == slug))
        existing = result.scalar_one_or_none()
        if not existing:
            cat = Category(name=name, slug=slug)
            session.add(cat)
            await session.flush()
            cat_map[name] = cat
        else:
            cat_map[name] = existing
    return cat_map


async def seed_products(session, cat_map):
    """Load hero SKUs from JSON."""
    with open(SEED_FILE) as f:
        products_data = json.load(f)

    for item in products_data:
        result = await session.execute(
            select(Product).where(Product.sku == item["sku"])
        )
        if result.scalar_one_or_none():
            continue

        category = cat_map.get(item.pop("category", None))
        product = Product(
            sku=item["sku"],
            name=item["name"],
            slug=item["slug"],
            tagline=item.get("tagline"),
            description=item.get("description"),
            base_price=Decimal(str(item["base_price"])),
            selling_price=Decimal(str(item["selling_price"])),
            cost_price=Decimal(str(item["cost_price"])),
            specs=item.get("specs"),
            warranty_years=item.get("warranty_years", 1),
            weight_kg=Decimal(str(item["weight_kg"])) if item.get("weight_kg") else None,
            is_hero=item.get("is_hero", False),
            is_b2b_available=item.get("is_b2b_available", True),
            category_id=category.id if category else None,
        )
        session.add(product)
        await session.flush()

        # Create initial inventory record
        inv = InventoryRecord(
            product_id=product.id,
            quantity_on_hand=20,  # Default starting stock
            reorder_point=5,
        )
        session.add(inv)

    await session.commit()


async def seed_pricing_rules(session):
    """Create default dynamic pricing rules."""
    rules = [
        {
            "name": "Undercut Competitors by 5%",
            "rule_type": "undercut",
            "priority": 10,
            "parameters": {"undercut_percent": 5},
        },
        {
            "name": "Minimum 15% Margin Floor",
            "rule_type": "margin_floor",
            "priority": 20,
            "parameters": {"min_margin_percent": 15},
        },
        {
            "name": "Low Stock Surge Pricing",
            "rule_type": "demand_surge",
            "priority": 5,
            "parameters": {"low_stock_threshold": 3, "surge_percent": 10},
        },
        {
            "name": "Overstock Clearance",
            "rule_type": "clearance",
            "priority": 1,
            "parameters": {"high_stock_threshold": 50, "clearance_percent": 15},
        },
    ]

    for rule_data in rules:
        result = await session.execute(
            select(PricingRule).where(PricingRule.name == rule_data["name"])
        )
        if not result.scalar_one_or_none():
            session.add(PricingRule(**rule_data))

    await session.commit()


async def run_seed():
    """Main seed function."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        cat_map = await seed_categories(session)
        await seed_products(session, cat_map)
        await seed_pricing_rules(session)
        print("Seed complete: 15 Hero SKUs, categories, and pricing rules loaded.")


if __name__ == "__main__":
    asyncio.run(run_seed())
