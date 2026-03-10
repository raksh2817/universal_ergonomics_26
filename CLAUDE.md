# CLAUDE.md — Universal Ergonomics

This file documents the codebase structure, conventions, and workflows for AI assistants working on this project.

## Project Overview

Universal Ergonomics is a full-stack e-commerce platform for a Bengaluru-based office chair manufacturer. It supports both B2C retail and B2B wholesale. The system includes dynamic pricing, competitor scraping, inventory management via Telegram bot, WhatsApp integration, Razorpay payments, and a B2B lead scoring engine.

---

## Repository Structure

```
universal_ergonomics_26/
├── backend/                # FastAPI + SQLAlchemy API server
│   ├── app/
│   │   ├── main.py         # App entry point, CORS, lifespan events
│   │   ├── core/           # Config, database engine, security utilities
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── api/v1/         # Route handlers and central router
│   │   ├── services/       # Business logic (pricing, leads, bot, scraping)
│   │   └── utils/          # Delivery calculations, DB seeding
│   ├── migrations/         # Alembic migrations (empty — no history yet)
│   ├── tests/              # Pytest test suite
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # All required environment variables
├── frontend/               # Next.js 15 + React 19 app
│   └── src/
│       ├── app/            # Next.js App Router pages
│       ├── components/     # Shared UI components (layout, product)
│       ├── hooks/          # Zustand state (cart, retail/wholesale mode)
│       ├── types/          # TypeScript interfaces
│       ├── lib/            # Utility functions
│       └── styles/         # Global CSS and Tailwind variables
├── docker/                 # docker-compose.yml and Dockerfiles
├── scripts/                # Local dev setup script
└── data/seed/              # Seed data (hero SKUs catalog)
```

---

## Technology Stack

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| FastAPI | 0.115.6 | API framework |
| SQLAlchemy | 2.0.36 | Async ORM |
| asyncpg | latest | PostgreSQL async driver |
| Alembic | 1.14.1 | Database migrations |
| Celery | 5.4.0 | Async task queue |
| Redis | 7 | Celery broker + cache |
| python-jose | latest | JWT token signing |
| passlib/bcrypt | latest | Password hashing |
| Razorpay | latest | Payment gateway |
| boto3 | latest | AWS S3 image storage |
| BeautifulSoup4/selectolax | latest | Competitor price scraping |
| pandas/scikit-learn | latest | Lead scoring, pricing ML |
| pytest / pytest-asyncio | 8.3.4 / 0.25.2 | Testing |

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 15.1.0 | React framework (App Router) |
| React | 19.0.0 | UI library |
| TypeScript | 5.7.2 | Type safety |
| TailwindCSS | 3.4.16 | Utility-first CSS |
| Zustand | 5.0.2 | Client state management |

---

## Development Setup

### Docker (recommended)

```bash
cd docker
docker compose up
```

This starts 6 services: PostgreSQL 16, Redis 7, FastAPI backend (`:8000`), Next.js frontend (`:3000`), Celery worker, Celery beat.

### Manual Setup

```bash
# Run the setup script first
bash scripts/setup.sh

# Backend (in one terminal)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Frontend (in another terminal)
cd frontend
npm run dev
```

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in all values. Key variables:

- `DATABASE_URL` — async PostgreSQL URL (`postgresql+asyncpg://...`)
- `DATABASE_URL_SYNC` — sync URL for Alembic migrations
- `REDIS_URL` — Redis connection
- `SECRET_KEY` — JWT signing key
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — payment gateway
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_WAREHOUSE_CHAT_ID` — inventory bot
- `WHATSAPP_API_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` — WhatsApp webhook
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_S3_BUCKET` — product images
- `FREE_DELIVERY_RADIUS_KM` — delivery zone (default: 50km from Bengaluru center)

---

## Running Tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

Test files:
- `tests/test_lead_scorer.py` — B2B lead scoring logic
- `tests/test_delivery.py` — Delivery zone/distance calculations
- `tests/test_bot_parser.py` — Telegram bot message parsing

---

## Database

### ORM Models (`backend/app/models/`)

| File | Models |
|------|--------|
| `user.py` | `User`, `B2BProfile` |
| `product.py` | `Category`, `Product`, `ProductVariant`, `ProductImage` |
| `order.py` | `Order`, `OrderItem`, `Address` |
| `inventory.py` | `InventoryRecord`, `InventoryLog` |
| `lead.py` | `Lead`, `LeadActivity` |
| `pricing.py` | `CompetitorPrice`, `PricingRule` |

### Conventions
- All PKs are UUIDs (not auto-increment integers)
- All timestamps are timezone-aware UTC
- Soft deletes via `is_active` boolean
- Flexible JSON columns for specs, parameters, extra_data
- Enums: `OrderStatus`, `PaymentStatus`, `OrderType` are `str` enums

### Migrations

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

---

## API Structure

Base URL: `http://localhost:8000/api/v1`

| Router | Prefix | File |
|--------|--------|------|
| Auth | `/auth` | `api/v1/endpoints/auth.py` |
| Products | `/products` | `api/v1/endpoints/products.py` |
| Orders | `/orders` | `api/v1/endpoints/orders.py` |
| Inventory | `/inventory` | `api/v1/endpoints/inventory.py` |
| Leads | `/leads` | `api/v1/endpoints/leads.py` |
| Pricing | `/pricing` | `api/v1/endpoints/pricing.py` |

All routes registered in `api/v1/router.py`. FastAPI auto-generates OpenAPI docs at `/docs`.

---

## Backend Conventions

- **Async everywhere:** All route handlers and DB queries use `async/await`. The session is always `AsyncSession`.
- **SQLAlchemy 2.0 style:** Use `Mapped[T]` annotations and `mapped_column()` — not the legacy `Column()` syntax.
- **Pydantic v2:** Use `model_config = ConfigDict(from_attributes=True)` in schema classes for ORM serialization.
- **Decimal for money:** Always use `Python Decimal`, not floats, for prices and amounts.
- **Dependency injection:** Use `Depends()` for DB sessions, authentication, and shared utilities.
- **Services layer:** Business logic lives in `app/services/`, not in route handlers.
- **Error handling:** Use `HTTPException(status_code=..., detail=...)` — no bare exceptions in route handlers.
- **Seeding data:** Run `python -m app.utils.seed` to populate the database with products from `data/seed/`.

---

## Frontend Conventions

- **Server components by default:** Add `"use client"` only for pages/components with state or browser APIs.
- **Path aliasing:** `@/*` maps to `src/*`. Always use this alias for imports.
- **Zustand for state:** Cart state (`use-cart.ts`) and retail/wholesale mode (`use-mode.ts`) are persisted to `localStorage`.
- **TailwindCSS:** Use utility classes. Custom CSS variables are defined in `styles/globals.css` (e.g., `--color-border`, `--color-foreground`).
- **Fonts:** DM Sans (body), DM Serif Display (headings), JetBrains Mono (code) — all loaded via `next/font/google` in `layout.tsx`.
- **Icons:** Google Material Symbols font loaded via CDN in `layout.tsx`.
- **Responsive design:** Mobile-first. Use `md:` and `lg:` Tailwind breakpoints for larger screens.
- **Forms:** Use `FormData` API. Validate client-side before API calls.
- **TypeScript interfaces** for all data structures live in `src/types/product.ts`.

---

## Key Services

### Dynamic Pricing Engine (`services/pricing/engine.py`)
Four rule types: `undercut` (beat competitor price), `margin_floor` (protect minimum margin), `demand_surge` (increase price when demand is high), `clearance` (discount slow-moving stock). Rules are stored in the `pricing_rules` table and applied in priority order.

### B2B Lead Scoring (`services/leads/scorer.py`)
Scores leads based on: industry weight, employee count, estimated order quantity, referral source bonus, and activity log. Stage thresholds: `new` → `warm` (score ≥ 30) → `hot` (score ≥ 60) → `qualified` (score ≥ 80).

### Telegram Inventory Bot (`services/bot/telegram_bot.py`)
Warehouse team sends stock updates via Telegram. The bot parses messages and calls the inventory API to update `inventory_records`. Logs changes to `inventory_logs` with source `bot_telegram`.

### Competitor Scraping (`services/scraping/`)
Celery beat task runs every `SCRAPE_INTERVAL_HOURS` hours to scrape prices from competitor sites. Results stored in `competitor_prices` table and used by the pricing engine.

### Delivery Calculation (`utils/delivery.py`)
Uses the Haversine formula to calculate distance from Bengaluru center. Free delivery + assembly within `FREE_DELIVERY_RADIUS_KM` (default 50km). Orders outside that radius incur delivery charges with estimated days based on pincode.

---

## Services and Ports (Docker)

| Service | Port | Notes |
|---------|------|-------|
| PostgreSQL | 5432 | |
| Redis | 6379 | |
| FastAPI backend | 8000 | Hot reload in dev |
| Next.js frontend | 3000 | Hot reload in dev |
| Celery worker | — | No exposed port |
| Celery beat | — | Scheduler, no exposed port |

---

## Business Domain Notes

- **Delivery region:** Bengaluru-centric. Center coordinates configured via `BENGALURU_CENTER_LAT` / `BENGALURU_CENTER_LNG`.
- **B2B discounts:** Three tiers — standard, silver, gold. Assigned in `b2b_profiles.discount_tier`.
- **GST:** Orders include `gst_amount` as a separate field. GST number stored in `B2BProfile.gst_number`.
- **Order flow:** `pending` → `confirmed` → `processing` → `shipped` → `delivered` / `cancelled`.
- **Payment flow:** Razorpay order created on checkout, `razorpay_payment_id` stored on confirmation.
- **Hero products:** Products marked `is_hero=True` appear on the homepage. 15 curated SKUs in `data/seed/hero_skus.json`.
- **AR models:** `product.ar_model_url` reserved for future augmented reality try-on feature.

---

## Git Workflow

The working development branch for Claude-assisted work is `claude/add-claude-documentation-iG7XL`.

```bash
# Always push to the designated branch
git push -u origin claude/add-claude-documentation-iG7XL
```

Commit messages should be descriptive and imperative (e.g., `Add competitor scraping Celery task`, `Fix order status transition validation`).
