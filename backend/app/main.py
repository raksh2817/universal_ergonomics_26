"""
FastAPI application entry point for Universal Ergonomics.

This module bootstraps the entire web server:
  - Creates the FastAPI app instance with metadata pulled from settings
  - Registers CORS middleware to allow the Next.js frontend (localhost:3000
    in development, universalergonomics.in in production) to call the API
  - Mounts the versioned REST API router at /api/v1
  - Mounts the WhatsApp webhook router at the root level (outside versioning)
  - Exposes a /health endpoint for Docker / load-balancer health checks

Lifespan Notes:
  The `lifespan` async context manager runs on startup and shutdown.
  Telegram bot polling is intentionally commented-out; uncomment and set
  TELEGRAM_BOT_TOKEN in .env to activate warehouse inventory sync via Telegram.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router
from app.services.bot.whatsapp_handler import router as whatsapp_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Async context manager executed once on server startup (before `yield`)
    and once on server shutdown (after `yield`).

    Currently only used as a hook placeholder. To enable the Telegram
    warehouse bot, uncomment the lines below and ensure the bot token is
    set in the environment.
    """
    # Startup: optionally start Telegram bot in background
    # (Uncomment when TELEGRAM_BOT_TOKEN is configured)
    # import asyncio
    # from app.services.bot.telegram_bot import start_telegram_bot
    # asyncio.create_task(start_telegram_bot())
    yield
    # Shutdown cleanup here if needed


# Create the FastAPI application.
# `title` and `version` come from Settings so they stay in sync with the env.
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Headless commerce API for Universal Ergonomics — office chairs manufactured in Bangalore",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
# Allow the Next.js frontend to make cross-origin requests.
# `allow_credentials=True` is required so the browser sends cookies / auth
# headers.  The wildcard methods/headers keep the config simple; tighten
# per-method in production if needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",            # Local Next.js dev server
        "https://universalergonomics.in",   # Production domain
        "https://www.universalergonomics.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Router Registration
# ---------------------------------------------------------------------------
# All REST endpoints are versioned under /api/v1 (auth, products, orders,
# inventory, pricing, leads).
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# The WhatsApp webhook is registered without a version prefix because Meta's
# Business API calls a fixed URL that we cannot change after verification.
app.include_router(whatsapp_router)


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
@app.get("/health")
async def health_check():
    """
    Simple liveness probe used by Docker health-checks and load balancers.
    Returns HTTP 200 with app name and version when the process is alive.
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
