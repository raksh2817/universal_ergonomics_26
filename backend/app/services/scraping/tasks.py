"""
Celery tasks for periodic competitor price scraping.

Schedule: Every SCRAPE_INTERVAL_HOURS (default 6h).
"""

import logging
from datetime import datetime, timezone

from sqlalchemy import select, create_engine
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.pricing import CompetitorPrice
from app.services.scraping.competitor_scraper import SCRAPERS

logger = logging.getLogger(__name__)

# Sync engine for Celery tasks (Celery doesn't support async natively)
sync_engine = create_engine(settings.DATABASE_URL_SYNC)


# Competitor URL mappings to be populated via admin or seed data
# Format: {product_id: [{competitor: "amazon", url: "https://..."}, ...]}
# In production, store this in a DB table or config file.


async def scrape_all_competitors():
    """
    Main scraping job: iterate over all tracked competitor URLs
    and store the results.
    """
    from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

    engine = create_async_engine(settings.DATABASE_URL)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    # Fetch all unique competitor URLs from existing records
    async with async_session() as session:
        result = await session.execute(
            select(
                CompetitorPrice.product_id,
                CompetitorPrice.competitor_name,
                CompetitorPrice.competitor_product_url,
            ).distinct(
                CompetitorPrice.product_id,
                CompetitorPrice.competitor_name,
            )
        )
        tracking_list = result.all()

    for product_id, competitor_name, url in tracking_list:
        scraper_cls = SCRAPERS.get(competitor_name)
        if not scraper_cls:
            logger.warning(f"No scraper for competitor: {competitor_name}")
            continue

        async with scraper_cls() as scraper:
            data = await scraper.scrape_product(url)
            if not data or data.get("price") is None:
                logger.warning(f"Failed to scrape {url}")
                continue

            async with async_session() as session:
                record = CompetitorPrice(
                    product_id=product_id,
                    competitor_name=competitor_name,
                    competitor_product_url=url,
                    competitor_product_name=data.get("title"),
                    price=data["price"],
                    mrp=data.get("mrp"),
                    rating=data.get("rating"),
                    review_count=data.get("review_count"),
                    in_stock=data.get("in_stock", True),
                )
                session.add(record)
                await session.commit()

            logger.info(f"Scraped {competitor_name} for product {product_id}: ₹{data['price']}")

    await engine.dispose()
