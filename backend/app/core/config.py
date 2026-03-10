"""
Application configuration via environment variables.

All settings are loaded by pydantic-settings from the .env file (or real
environment variables).  `case_sensitive=True` means variable names in .env
must exactly match the field names below.

Sections:
  App        – Service identity and global flags
  Database   – Async (asyncpg) and sync (psycopg2) PostgreSQL connection URLs
  Redis      – Broker URL used by Celery for scraping tasks
  Auth       – JWT algorithm and token lifetime
  Telegram   – Optional warehouse bot credentials
  WhatsApp   – Optional Meta Business API credentials for inventory sync
  Razorpay   – Indian payment gateway keys
  AWS S3     – Product image storage bucket
  Scraping   – Competitor price-scraping schedule and affiliate tag
  Delivery   – Free-delivery radius and promise window centred on Bangalore HQ
  B2B        – Minimum order quantity and bulk discount for corporate buyers
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # ------------------------------------------------------------------
    # App identity
    # ------------------------------------------------------------------
    APP_NAME: str = "Universal Ergonomics"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False                          # Enables SQLAlchemy echo when True
    SECRET_KEY: str = "change-me-in-production"  # Signs JWT tokens — MUST be rotated in prod
    API_V1_PREFIX: str = "/api/v1"               # Prefix for all versioned REST routes

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------
    # asyncpg driver is required for SQLAlchemy async sessions throughout the app
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/universal_ergonomics"
    # Sync URL used by Alembic migration scripts (which run synchronously)
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/universal_ergonomics"

    # ------------------------------------------------------------------
    # Redis
    # ------------------------------------------------------------------
    REDIS_URL: str = "redis://localhost:6379/0"  # Celery broker for periodic scrape tasks

    # ------------------------------------------------------------------
    # Auth (JWT)
    # ------------------------------------------------------------------
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Bearer tokens expire after 30 minutes
    ALGORITHM: str = "HS256"               # HMAC-SHA256 symmetric signing

    # ------------------------------------------------------------------
    # Telegram Bot (warehouse inventory sync)
    # ------------------------------------------------------------------
    # Leave None to skip bot startup (see lifespan hook in main.py)
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    # Restricts bot commands to a specific warehouse group chat; None = any chat
    TELEGRAM_WAREHOUSE_CHAT_ID: Optional[str] = None

    # ------------------------------------------------------------------
    # WhatsApp (via Twilio or Meta Business API)
    # ------------------------------------------------------------------
    WHATSAPP_API_TOKEN: Optional[str] = None          # Bearer token for Meta Graph API calls
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None    # Sender phone number ID from Meta dashboard

    # ------------------------------------------------------------------
    # Razorpay (Indian payment gateway)
    # ------------------------------------------------------------------
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None

    # ------------------------------------------------------------------
    # AWS S3 (product images)
    # ------------------------------------------------------------------
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: str = "universal-ergonomics-assets"
    AWS_REGION: str = "ap-south-1"  # Mumbai — closest AWS region to Bangalore

    # ------------------------------------------------------------------
    # Competitor price scraping (Celery periodic task)
    # ------------------------------------------------------------------
    SCRAPE_INTERVAL_HOURS: int = 6              # How often the scrape beat task runs
    AMAZON_AFFILIATE_TAG: Optional[str] = None  # Appended to Amazon URLs for affiliate revenue

    # ------------------------------------------------------------------
    # Delivery (Bangalore-centric logistics model)
    # ------------------------------------------------------------------
    FREE_DELIVERY_RADIUS_KM: int = 50    # Haversine radius qualifying for free 48-hr delivery
    DELIVERY_PROMISE_HOURS: int = 48     # Delivery SLA for Bangalore metro zone
    # Geographic centre of Bangalore — origin point for haversine distance checks
    BANGALORE_CENTER_LAT: float = 12.9716
    BANGALORE_CENTER_LNG: float = 77.5946

    # ------------------------------------------------------------------
    # B2B / Corporate sales
    # ------------------------------------------------------------------
    B2B_MIN_ORDER_QUANTITY: int = 5       # Minimum chairs to unlock B2B pricing
    B2B_DISCOUNT_PERCENT: float = 15.0    # Flat % discount applied on selling_price for B2B orders

    model_config = {"env_file": ".env", "case_sensitive": True}


# Module-level singleton — import `settings` everywhere instead of re-instantiating
settings = Settings()
