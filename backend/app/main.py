"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router
from app.services.bot.whatsapp_handler import router as whatsapp_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: optionally start Telegram bot in background
    # (Uncomment when TELEGRAM_BOT_TOKEN is configured)
    # import asyncio
    # from app.services.bot.telegram_bot import start_telegram_bot
    # asyncio.create_task(start_telegram_bot())
    yield
    # Shutdown cleanup here if needed


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Headless commerce API for Universal Ergonomics — office chairs manufactured in Bangalore",
    lifespan=lifespan,
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://universalergonomics.in",
        "https://www.universalergonomics.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# WhatsApp webhook (outside versioned API)
app.include_router(whatsapp_router)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
