"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional


_INSECURE_DEFAULTS = frozenset({"change-me-in-production", "secret", "changeme", ""})


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Universal Ergonomics"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    SECRET_KEY: str = "change-me-in-production"
    API_V1_PREFIX: str = "/api/v1"

    @field_validator("SECRET_KEY")
    @classmethod
    def secret_key_must_be_set(cls, v: str) -> str:
        if v in _INSECURE_DEFAULTS:
            import warnings
            warnings.warn(
                "SECRET_KEY is set to an insecure default. "
                "Set a strong, unique value in production via the SECRET_KEY env var. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\"",
                stacklevel=2,
            )
        return v

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
    Bengaluru_CENTER_LAT: float = 12.9716
    Bengaluru_CENTER_LNG: float = 77.5946

    # B2B
    B2B_MIN_ORDER_QUANTITY: int = 5
    B2B_DISCOUNT_PERCENT: float = 15.0

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
