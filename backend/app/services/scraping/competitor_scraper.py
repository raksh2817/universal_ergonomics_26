"""
Competitor price scraping framework.

Scrapes Amazon.in and Flipkart for office chair prices.
Designed to be run as a Celery periodic task every N hours.

IMPORTANT: Implement respectful scraping — use delays, respect robots.txt,
and rotate user agents. For production, consider using official APIs
(Amazon Product Advertising API, Flipkart Affiliate API) where available.
"""

import logging
import random
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]


class CompetitorScraper:
    """Base scraper with common functionality."""

    def __init__(self):
        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={"User-Agent": random.choice(USER_AGENTS)},
            follow_redirects=True,
        )
        return self

    async def __aexit__(self, *args):
        if self.client:
            await self.client.aclose()

    async def fetch_page(self, url: str) -> Optional[str]:
        """Fetch a page with error handling."""
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            return response.text
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch {url}: {e}")
            return None


class AmazonScraper(CompetitorScraper):
    """
    Amazon.in price scraper for office chairs.

    NOTE: For production, use the Amazon Product Advertising API (PA-API 5.0)
    instead of HTML scraping. This scraper is a development placeholder.
    """

    def parse_product_page(self, html: str) -> dict:
        """Extract price and metadata from an Amazon product page."""
        soup = BeautifulSoup(html, "html.parser")
        data = {}

        # Price
        price_span = soup.select_one("#priceblock_ourprice, .a-price .a-offscreen, #price_inside_buybox")
        if price_span:
            price_text = price_span.get_text().replace("₹", "").replace(",", "").strip()
            try:
                data["price"] = Decimal(price_text)
            except Exception:
                data["price"] = None

        # MRP
        mrp_span = soup.select_one(".priceBlockStrikePriceString, .a-text-price .a-offscreen")
        if mrp_span:
            mrp_text = mrp_span.get_text().replace("₹", "").replace(",", "").strip()
            try:
                data["mrp"] = Decimal(mrp_text)
            except Exception:
                data["mrp"] = None

        # Rating
        rating_span = soup.select_one("#acrPopover .a-icon-alt, [data-hook='rating-out-of-text']")
        if rating_span:
            try:
                data["rating"] = Decimal(rating_span.get_text().split()[0])
            except Exception:
                data["rating"] = None

        # Review count
        review_span = soup.select_one("#acrCustomerReviewText")
        if review_span:
            try:
                data["review_count"] = int(
                    review_span.get_text().replace(",", "").split()[0]
                )
            except Exception:
                data["review_count"] = None

        # In stock
        avail = soup.select_one("#availability")
        data["in_stock"] = bool(avail and "In stock" in avail.get_text())

        # Title
        title = soup.select_one("#productTitle")
        data["title"] = title.get_text().strip() if title else None

        return data

    async def scrape_product(self, url: str) -> Optional[dict]:
        html = await self.fetch_page(url)
        if not html:
            return None
        return self.parse_product_page(html)


class FlipkartScraper(CompetitorScraper):
    """
    Flipkart price scraper for office chairs.

    NOTE: For production, use the Flipkart Affiliate API.
    """

    def parse_product_page(self, html: str) -> dict:
        soup = BeautifulSoup(html, "html.parser")
        data = {}

        # Price (Flipkart uses dynamic class names, these are common patterns)
        price_div = soup.select_one("div._30jeq3, div._16Jk6d")
        if price_div:
            price_text = price_div.get_text().replace("₹", "").replace(",", "").strip()
            try:
                data["price"] = Decimal(price_text)
            except Exception:
                data["price"] = None

        # MRP
        mrp_div = soup.select_one("div._3I9_wc, div._2p6lqe")
        if mrp_div:
            mrp_text = mrp_div.get_text().replace("₹", "").replace(",", "").strip()
            try:
                data["mrp"] = Decimal(mrp_text)
            except Exception:
                data["mrp"] = None

        # Rating
        rating_div = soup.select_one("div._3LWZlK, span._1lRcqv")
        if rating_div:
            try:
                data["rating"] = Decimal(rating_div.get_text().strip())
            except Exception:
                data["rating"] = None

        # Title
        title = soup.select_one("span.B_NuCI, h1._9E25nV")
        data["title"] = title.get_text().strip() if title else None

        data["in_stock"] = True  # Default; check for OOS markers

        return data

    async def scrape_product(self, url: str) -> Optional[dict]:
        html = await self.fetch_page(url)
        if not html:
            return None
        return self.parse_product_page(html)


# Mapping of competitor names to scraper classes
SCRAPERS = {
    "amazon": AmazonScraper,
    "flipkart": FlipkartScraper,
}
