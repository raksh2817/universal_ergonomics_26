# Universal Ergonomics — Codebase Context

## Project Overview

Universal Ergonomics is a Bangalore-based office chair manufacturer selling direct-to-consumer (D2C) and B2B without middlemen. This repository contains a full-stack headless e-commerce platform with a FastAPI backend, Next.js frontend, warehouse bots, dynamic pricing engine, and B2B lead management.

**Value proposition**: Free 48-hour delivery with on-site assembly within the Bangalore metro area (50 km radius from city centre).

---

## Repository Structure

```
universal_ergonomics_26/
├── backend/          # FastAPI Python application
├── frontend/         # Next.js 15 storefront
├── docker/           # Docker Compose and Dockerfiles
├── data/             # Seed data (product SKUs)
├── scripts/          # Dev environment setup
└── CODEBASE_NOTES.md # Living project documentation
```

---

## Folder Breakdown

### `backend/`

The core API and business logic layer, built with FastAPI (Python 3.12) and async SQLAlchemy against PostgreSQL.

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point; CORS config, router registration
│   ├── core/
│   │   ├── config.py        # Pydantic-based settings loaded from environment variables
│   │   ├── database.py      # Async SQLAlchemy engine and session factory
│   │   └── security.py      # bcrypt password hashing and JWT token creation/verification
│   ├── api/v1/
│   │   ├── router.py        # Central router that registers all endpoint modules
│   │   └── endpoints/
│   │       ├── auth.py      # User registration and login (JWT issuance)
│   │       ├── products.py  # Product CRUD, listing with filters, slug lookup
│   │       ├── orders.py    # Order creation, status lifecycle management
│   │       ├── inventory.py # Stock level queries and updates (bot-accessible)
│   │       ├── pricing.py   # Dynamic pricing recommendations and competitor price history
│   │       └── leads.py     # B2B lead creation, scoring, activity tracking
│   ├── models/              # SQLAlchemy ORM model definitions
│   │   ├── product.py       # Category, Product, ProductVariant, ProductImage
│   │   ├── order.py         # Order, OrderItem, Address, payment/status enums
│   │   ├── user.py          # User, B2BProfile (company_name, GST, discount tier)
│   │   ├── inventory.py     # InventoryRecord (current stock), InventoryLog (audit trail)
│   │   ├── pricing.py       # CompetitorPrice, PricingRule
│   │   └── lead.py          # Lead, LeadActivity
│   ├── schemas/             # Pydantic schemas for request/response validation
│   ├── services/
│   │   ├── pricing/
│   │   │   └── engine.py    # Rules-based dynamic pricing algorithm
│   │   ├── leads/
│   │   │   └── scorer.py    # B2B lead scoring engine (0–90 point scale)
│   │   ├── scraping/
│   │   │   ├── competitor_scraper.py  # HTML scrapers for Amazon and Flipkart
│   │   │   └── tasks.py               # Celery periodic tasks (runs every 6 hours)
│   │   └── bot/
│   │       ├── telegram_bot.py        # Telegram warehouse bot for inventory sync
│   │       └── whatsapp_handler.py    # Meta WhatsApp webhook handler
│   ├── utils/
│   │   ├── delivery.py      # Haversine distance calculation and delivery zone logic
│   │   └── seed.py          # Database seeding script
│   └── migrations/          # Alembic migration placeholder
├── tests/                   # Test directory (minimal coverage currently)
├── requirements.txt         # Production Python dependencies
├── requirements-dev.txt     # Development dependencies (pytest, etc.)
├── .env.example             # Environment variable template with all required keys
└── alembic.ini              # Alembic database migration configuration
```

**Key backend services:**

| Service | File | Purpose |
|---|---|---|
| Pricing Engine | `services/pricing/engine.py` | Recommends sell prices using 6 rules: undercut competitors, margin floor, demand surge, clearance, psychological pricing (₹X9), safety floor |
| Lead Scorer | `services/leads/scorer.py` | Scores B2B prospects 0–90 pts based on industry, employee count, quantity intent, lead source |
| Telegram Bot | `services/bot/telegram_bot.py` | Parses `ADD`, `REMOVE`, `CHECK`, `LOW STOCK` commands from warehouse group chat |
| WhatsApp Handler | `services/bot/whatsapp_handler.py` | Receives Meta Business API webhooks; reuses Telegram command parser |
| Competitor Scraper | `services/scraping/competitor_scraper.py` | Scrapes Amazon and Flipkart product pages for price data |
| Delivery Logic | `utils/delivery.py` | Determines `bangalore_metro` (≤50 km, free) vs `outstation` (>50 km, ₹500 + ₹10/km) zone |

---

### `frontend/`

The customer-facing storefront built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Zustand for cart state. Currently standalone — not yet wired to the backend API.

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Homepage: hero section, categories, featured products
│   │   ├── products/
│   │   │   ├── page.tsx              # Product catalogue with category and price filters
│   │   │   └── [slug]/page.tsx       # Product detail page with specs and color picker
│   │   ├── cart/page.tsx             # Shopping cart line items and totals
│   │   ├── checkout/page.tsx         # Shipping address form and order summary
│   │   ├── order-confirmation/page.tsx  # Post-purchase confirmation screen
│   │   ├── b2b/page.tsx              # B2B enquiry form and volume pricing information
│   │   ├── about/page.tsx            # Company story and information
│   │   └── layout.tsx                # Root layout with Header and Footer
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx            # Top navigation bar and logo
│   │   │   └── footer.tsx            # Footer links and company info
│   │   └── product/
│   │       ├── product-card.tsx      # Card used in catalogue listing
│   │       └── product-image.tsx     # Image gallery with thumbnail navigation
│   ├── hooks/
│   │   └── use-cart.ts              # Zustand cart store with localStorage persistence
│   ├── lib/
│   │   └── products.ts              # Static product data for 16 SKUs (temporary)
│   ├── types/
│   │   └── product.ts               # TypeScript interfaces for Product, Variant, etc.
│   └── styles/                       # Global styles
├── package.json                       # Dependencies and npm scripts
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
└── tailwind.config.ts                 # Tailwind CSS configuration
```

**Cart state** (`hooks/use-cart.ts`): Zustand store persisted to `localStorage` under key `"ue-cart"`. Tracks items, quantities, last order reference for confirmation page.

---

### `docker/`

Orchestrates the full development stack across 6 services.

```
docker/
├── docker-compose.yml    # Full-stack orchestration
├── Dockerfile.backend    # Python 3.12 slim image for FastAPI
└── Dockerfile.frontend   # Node.js 20 Alpine image for Next.js
```

| Service | Port | Description |
|---|---|---|
| `db` | 5432 | PostgreSQL 16 Alpine |
| `redis` | 6379 | Redis 7 Alpine (Celery broker) |
| `backend` | 8000 | FastAPI app with live code mounting |
| `frontend` | 3000 | Next.js dev server with live code mounting |
| `celery-worker` | — | Async task processor (competitor scraping) |
| `celery-beat` | — | Periodic task scheduler (every 6 hours) |

---

### `data/`

```
data/
└── seed/
    └── hero_skus.json    # 16 product templates across 6 categories
```

Contains seed data for the 16 hero SKUs used to populate the database. Categories: Executive, Mid-Back, Task, Gaming, Ergonomic, Visitor/Bulk chairs. Each SKU includes three-tier pricing (`base_price`, `selling_price`, `cost_price`) and rich specifications in JSON.

---

### `scripts/`

```
scripts/
└── setup.sh    # One-shot development environment bootstrap script
```

Automates local dev setup: creates Python virtual environment, installs backend dependencies, installs frontend packages, copies `.env.example` to `.env`.

---

## Data Models

```
User
  └── B2BProfile           (company_name, gst_number, discount_tier)
  └── Address              (saved delivery addresses with lat/lng)
      └── Order            (order_number, totals, payment_status)
            └── OrderItem  (product_name snapshot, qty, price_snapshot)

Category (hierarchical, self-referential parent_id)
  └── Product              (3-tier pricing, specs JSON, hero/B2B flags)
        ├── ProductVariant (color/material options with price adjustment)
        └── ProductImage   (S3 URL, is_primary flag, sort_order)

InventoryRecord            (current stock per product)
  └── InventoryLog         (immutable audit trail of all stock changes)

CompetitorPrice            (scraped prices from Amazon/Flipkart)
PricingRule                (active rules fed into pricing engine)

Lead                       (B2B prospect with score and stage)
  └── LeadActivity         (engagement timeline events)
```

**Order number format**: `UE-YYYYMMDD-XXXXXX`

**Order lifecycle**: `pending` → `confirmed` → `processing` → `shipped` → `out_for_delivery` → `delivered` (or `cancelled` / `returned`)

**B2B lead stages**: score ≥ 80 → `qualified` | score ≥ 50 → `contacted` | score < 50 → `new`

---

## API Routes (`/api/v1`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create user account |
| POST | `/auth/login` | Issue JWT token |
| GET/POST | `/products` | List products / create product |
| PATCH | `/products/{id}` | Update product |
| GET/POST | `/orders` | List orders / create order |
| GET/PATCH | `/orders/{id}` | Order detail / update status |
| GET/POST | `/inventory` | Query / update stock levels |
| GET | `/pricing/recommendation/{id}` | Dynamic price recommendation |
| GET | `/pricing/competitors/{id}` | Competitor price history |
| GET/POST | `/leads` | List / create B2B lead |
| GET | `/leads/{id}/activities` | Lead engagement timeline |
| POST | `/webhook/whatsapp` | Meta WhatsApp message handler |
| GET | `/health` | Liveness probe |

---

## Environment Variables

All configuration is via environment variables. Copy `backend/.env.example` to `backend/.env` to get started.

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | — | Async PostgreSQL connection string |
| `REDIS_URL` | — | Redis connection for Celery |
| `SECRET_KEY` | — | JWT signing key |
| `FREE_DELIVERY_RADIUS_KM` | 50 | Bangalore metro delivery radius |
| `DELIVERY_PROMISE_HOURS` | 48 | Free delivery promise window |
| `B2B_MIN_ORDER_QUANTITY` | 5 | Minimum chairs for B2B pricing |
| `B2B_DISCOUNT_PERCENT` | 15 | Bulk discount percentage |
| `SCRAPE_INTERVAL_HOURS` | 6 | Competitor price scrape frequency |
| `TELEGRAM_BOT_TOKEN` | — | Warehouse Telegram bot token |
| `WHATSAPP_API_TOKEN` | — | Meta WhatsApp Business API token |
| `RAZORPAY_KEY_ID` | — | Indian payment gateway key |
| `AWS_S3_BUCKET` | — | Product image storage bucket |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend API | FastAPI (Python 3.12) + Uvicorn |
| Database | PostgreSQL 16 + SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Task Queue | Celery + Redis 7 |
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Cart State | Zustand v5 (localStorage-persisted) |
| Bots | python-telegram-bot + Meta WhatsApp API |
| Payments | Razorpay (planned) |
| Image CDN | AWS S3 (ap-south-1) |

---

## Known Gaps / Not Yet Implemented

- Frontend not wired to backend API (product data is static in `lib/products.ts`)
- No authentication middleware enforced on admin endpoints
- Razorpay payment flow incomplete (`payment_status` stays `pending`)
- Celery scraping task configured but not actively scheduled
- Address geocoding not implemented (lat/lng fields not populated)
- B2B discount not applied during order creation
- Alembic migrations not created (using `create_all()` instead)
- AR/3D product viewer planned but not built
