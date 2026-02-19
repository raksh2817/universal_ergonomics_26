"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Universal Ergonomics"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    SECRET_KEY: str = "change-me-in-production"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/universal_ergonomics"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/universal_ergonomics"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Auth
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_WAREHOUSE_CHAT_ID: Optional[str] = None

    # WhatsApp (via Twilio or Meta Business API)
    WHATSAPP_API_TOKEN: Optional[str] = None
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None

    # Razorpay
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None

    # AWS S3 (product images)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: str = "universal-ergonomics-assets"
    AWS_REGION: str = "ap-south-1"

    # Scraping
    SCRAPE_INTERVAL_HOURS: int = 6
    AMAZON_AFFILIATE_TAG: Optional[str] = None

    # Delivery
    FREE_DELIVERY_RADIUS_KM: int = 50
    DELIVERY_PROMISE_HOURS: int = 48
    BANGALORE_CENTER_LAT: float = 12.9716
    BANGALORE_CENTER_LNG: float = 77.5946

    # B2B
    B2B_MIN_ORDER_QUANTITY: int = 5
    B2B_DISCOUNT_PERCENT: float = 15.0

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
