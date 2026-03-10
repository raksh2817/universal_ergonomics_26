# Universal Ergonomics — Codebase Notes

> **Last updated:** 2026-03-08
> **Branch:** `claude/add-code-comments-HOo2Y`
> **Purpose:** Living document capturing what has been built, the key design decisions made, and the state of each subsystem.

---

## 1. Project Overview

Universal Ergonomics is a **Bangalore-based office chair manufacturer** that sells direct-to-consumer and B2B without middlemen. The codebase is a full-stack headless commerce platform composed of:

| Layer | Technology | Purpose |
|---|---|---|
| Backend API | FastAPI (Python) + PostgreSQL | All data persistence, business logic, auth |
| Frontend | Next.js 14 (TypeScript) + Tailwind | Customer-facing storefront |
| Messaging bots | python-telegram-bot + Meta WhatsApp API | Warehouse inventory sync |
| Competitor scraping | httpx + BeautifulSoup + Celery | Price intelligence |
| Payments | Razorpay (planned) | Indian payment gateway |
| Image storage | AWS S3 (ap-south-1) | Product image CDN |

---

## 2. Repository Structure

```
universal_ergonomics_26/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── main.py             # App factory, CORS, router registration
│   │   ├── core/
│   │   │   ├── config.py       # All env-var settings (pydantic-settings)
│   │   │   ├── database.py     # Async SQLAlchemy engine + session factory
│   │   │   └── security.py     # bcrypt hashing + JWT create/decode
│   │   ├── api/v1/
│   │   │   ├── router.py       # Central router — registers all endpoint modules
│   │   │   └── endpoints/
│   │   │       ├── auth.py         # POST /register, POST /login
│   │   │       ├── products.py     # GET/POST/PATCH products
│   │   │       ├── orders.py       # POST / GET / PATCH orders
│   │   │       ├── inventory.py    # GET / POST inventory (used by bots)
│   │   │       ├── pricing.py      # GET competitor prices + price recommendations
│   │   │       └── leads.py        # GET / POST B2B leads + activities
│   │   ├── models/
│   │   │   ├── product.py      # Category, Product, ProductVariant, ProductImage
│   │   │   ├── order.py        # Address, Order, OrderItem + enums
│   │   │   ├── user.py         # User, B2BProfile
│   │   │   ├── inventory.py    # InventoryRecord, InventoryLog
│   │   │   ├── pricing.py      # CompetitorPrice, PricingRule
│   │   │   └── lead.py         # Lead, LeadActivity
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── pricing/
│   │   │   │   └── engine.py   # Dynamic pricing rule engine
│   │   │   ├── leads/
│   │   │   │   └── scorer.py   # B2B lead scoring engine
│   │   │   ├── scraping/
│   │   │   │   ├── competitor_scraper.py  # Amazon + Flipkart price scrapers
│   │   │   │   └── tasks.py               # Celery periodic scrape task
│   │   │   └── bot/
│   │   │       ├── telegram_bot.py        # Warehouse inventory bot
│   │   │       └── whatsapp_handler.py    # WhatsApp webhook handler
│   │   └── utils/
│   │       ├── delivery.py     # Haversine distance + delivery zone logic
│   │       └── seed.py         # Database seeding script
│   ├── requirements.txt
│   └── alembic.ini
├── frontend/                   # Next.js storefront
│   └── src/
│       ├── app/                # Next.js App Router pages
│       │   ├── page.tsx            # Homepage
│       │   ├── products/           # Catalogue + product detail
│       │   ├── cart/               # Cart page
│       │   ├── checkout/           # Checkout form
│       │   ├── order-confirmation/ # Post-purchase confirmation
│       │   ├── b2b/                # B2B landing + enquiry form
│       │   └── about/              # Company page
│       ├── components/         # Reusable UI components
│       ├── hooks/
│       │   └── use-cart.ts     # Zustand cart state (localStorage-persisted)
│       ├── lib/
│       │   └── products.ts     # Static product data + helper functions
│       └── types/
│           └── product.ts      # TypeScript product/cart/order interfaces
├── docker/
│   ├── docker-compose.yml      # Full-stack orchestration
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── data/seed/
│   └── hero_skus.json          # Initial product seed data
└── scripts/
    └── setup.sh                # One-shot dev environment bootstrap
```

---

## 3. Backend Deep-Dive

### 3.1 Application Startup (`main.py`)

- `FastAPI` app is created using settings pulled from `config.py`.
- `CORSMiddleware` allows the Next.js frontend on `localhost:3000` and the production domain.
- All REST routes are mounted under `/api/v1` via `api_router`.
- The WhatsApp webhook is mounted at the root (no version prefix) because Meta's API calls a fixed URL.
- A `/health` endpoint is provided for Docker and load-balancer health checks.
- The Telegram bot (`start_telegram_bot`) is wired into the `lifespan` hook but left commented-out until `TELEGRAM_BOT_TOKEN` is set in `.env`.

### 3.2 Configuration (`core/config.py`)

All configuration is loaded from environment variables (or `.env` file) via `pydantic-settings`. Key groups:

- **Database**: Two URLs — async (`asyncpg` driver for SQLAlchemy) and sync (`psycopg2` for Alembic migrations).
- **Auth**: HS256 JWT with a configurable expiry (default 30 minutes).
- **Integrations**: Telegram, WhatsApp (Meta Business API), Razorpay, AWS S3 — all optional; features degrade gracefully when tokens are absent.
- **Business rules**: Free delivery radius (50 km from Bangalore centre), B2B minimum order quantity (5 units), B2B discount (15%).

### 3.3 Database (`core/database.py`)

- Async SQLAlchemy engine with a pool of 20 connections and 10 overflow.
- `expire_on_commit=False` prevents lazy-load errors when returning ORM instances after a commit in async context.
- `get_db` is a FastAPI dependency that provides a per-request session, commits on success, and rolls back on exception.

### 3.4 Security (`core/security.py`)

- Passwords hashed with `bcrypt` via `passlib`.
- JWT tokens created with `python-jose` using `HS256` + `SECRET_KEY`.
- `decode_access_token` returns `None` (never raises) so callers handle authentication uniformly.

---

## 4. Data Models

### Product Catalogue

```
Category (hierarchical, parent_id self-join)
  └── Product (core chair model)
        ├── ProductVariant (colour/material options, price_adjustment)
        └── ProductImage   (ordered gallery, is_primary flag)
```

**Three-tier pricing on Product:**
- `base_price` — MRP shown crossed-out on storefront
- `selling_price` — Actual checkout price; starting point for pricing engine
- `cost_price` — Internal manufacturing cost (hidden from customers)

**Special flags:**
- `is_hero` — marks launch-lineup SKUs shown in the homepage hero grid
- `is_b2b_available` — controls whether a product appears in B2B catalogue
- `ar_model_url` — reserved for a future AR "try in your space" feature

### Orders

```
User
  └── Address (saved delivery addresses with lat/lng)
      └── Order (order_number: UE-YYYYMMDD-XXXXXX)
            └── OrderItem (snapshot of product_name + sku at purchase time)
```

**Order number format:** `UE-20240315-AB12CD` — brand prefix + UTC date + 6-char hex suffix.

**Address denormalization:** `shipping_address_text` stores a plain-text copy of the address at order time so order history is never corrupted by address edits.

**Enums:**
- `OrderStatus`: pending → confirmed → processing → shipped → out_for_delivery → delivered / cancelled / returned
- `PaymentStatus`: pending → paid / failed / refunded

### Inventory

```
InventoryRecord   (current stock: quantity_on_hand, quantity_reserved, reorder_point)
InventoryLog      (immutable audit trail: every stock change event)
```

`available_quantity = quantity_on_hand - quantity_reserved`
`quantity_reserved` is incremented when an order is placed to prevent overselling under concurrent load.

### Users & B2B

```
User  (email + bcrypt password, is_b2b, is_admin, is_active flags)
  └── B2BProfile  (company_name, gst_number, discount_tier: standard/silver/gold)
```

---

## 5. Services

### 5.1 Dynamic Pricing Engine (`services/pricing/engine.py`)

Called via `GET /api/v1/pricing/recommendation/{product_id}`.

**Algorithm:**
1. Start from `selling_price` as the baseline.
2. Fetch minimum in-stock competitor price from `CompetitorPrice` table.
3. Fetch active `PricingRule` rows sorted by `priority` descending.
4. Apply rules in order:
   - `undercut` — price X% below cheapest competitor (only if it lowers the price)
   - `margin_floor` — raise price if it would drop below `cost_price + min_margin%`
   - `demand_surge` — increase price when stock ≤ `low_stock_threshold`
   - `clearance` — decrease price when stock ≥ `high_stock_threshold`
5. Round to nearest ₹X9 (psychological pricing, e.g. ₹9,999).
6. Clamp to never go below `cost_price`.

### 5.2 Lead Scoring Engine (`services/leads/scorer.py`)

B2B leads are scored at creation time and incremented with each engagement activity.

**Initial score dimensions (max ~90 points):**
| Dimension | Max pts | Signal |
|---|---|---|
| Industry fit | 20 | Tech/software companies score highest |
| Employee count | 25 | More employees = larger order potential |
| Quantity intent | 30 | Explicit chair count requested |
| Lead source | 15 | Referrals > website form > event > cold outreach |

**Stage thresholds:**
- `score ≥ 80` → "qualified" (priority outreach)
- `score ≥ 50` → "contacted"
- `score < 50`  → "new"

### 5.3 Competitor Scraping (`services/scraping/competitor_scraper.py`)

- `AmazonScraper` and `FlipkartScraper` extend `CompetitorScraper` base class.
- Random user-agent rotation to reduce block rate.
- **Production note:** HTML selectors are brittle; Amazon PA-API 5.0 and Flipkart Affiliate API should be used instead.
- Scraped prices are stored in the `CompetitorPrice` table and consumed by the pricing engine.

### 5.4 Warehouse Bots

**Telegram bot (`services/bot/telegram_bot.py`)**
- Parses plain-text commands via regex: `ADD`, `REMOVE`, `CHECK`, `LOW STOCK`.
- Calls the internal `POST /api/v1/inventory/update` API endpoint.
- Restricted to a configured warehouse group chat (`TELEGRAM_WAREHOUSE_CHAT_ID`).

**WhatsApp handler (`services/bot/whatsapp_handler.py`)**
- Receives webhooks from Meta Business API at `POST /webhook/whatsapp`.
- Reuses the exact same `parse_message` + `handle_inventory_command` functions from the Telegram bot.
- Sends replies back via `https://graph.facebook.com/v18.0/{phone_id}/messages`.

---

## 6. Delivery Logic (`utils/delivery.py`)

Universal Ergonomics' key differentiator is **free 48-hour delivery with on-site assembly** within Bangalore.

**Zone determination:**
- Compute haversine distance from Bangalore city centre (12.9716°N, 77.5946°E) to the delivery address.
- Within 50 km → `bangalore_metro`: ₹0 charge, 48 hrs, assembly included.
- Beyond 50 km → `outstation`: ₹500 + ₹10/km beyond radius, 5 days, no assembly.

---

## 7. API Routes Summary

All versioned routes are under `/api/v1`:

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Issue JWT token |
| GET | `/products/` | List products (filterable, paginated) |
| GET | `/products/{slug}` | Product detail with variants + images |
| POST | `/products/` | Create product (admin) |
| PATCH | `/products/{id}` | Update product fields (admin) |
| POST | `/orders/` | Place order from cart |
| GET | `/orders/{id}` | Get order detail |
| PATCH | `/orders/{id}/status` | Advance order status |
| GET | `/inventory/` | List stock (supports `low_stock_only` filter) |
| GET | `/inventory/{product_id}` | Get stock for a product |
| POST | `/inventory/update` | Update stock (used by bots) |
| GET | `/pricing/competitors/{product_id}` | Competitor price history |
| GET | `/pricing/rules` | Active pricing rules |
| GET | `/pricing/recommendation/{product_id}` | Engine price recommendation |
| GET | `/leads/` | List B2B leads (filterable by stage/score) |
| POST | `/leads/` | Create lead + auto-score |
| GET | `/leads/{id}/activities` | Lead engagement history |
| GET | `/webhook/whatsapp` | Meta webhook verification |
| POST | `/webhook/whatsapp` | Incoming WhatsApp message handler |
| GET | `/health` | Liveness probe |

---

## 8. Frontend Architecture

The Next.js frontend uses the **App Router** and is currently **standalone** (no live API calls — product data comes from `src/lib/products.ts`).

### Key decisions:
- **Static product data** (`lib/products.ts`) — intentional choice for launch; easy to migrate to API calls later.
- **Zustand cart** (`hooks/use-cart.ts`) — persisted to `localStorage` under key `"ue-cart"`. Cart survives page refreshes. Tracks `lastOrder` for the confirmation page.
- **No authentication flow** on the frontend yet — the backend auth endpoints exist but are not wired to the storefront.

### Pages:
| Page | Route | Notes |
|---|---|---|
| Homepage | `/` | Hero, featured products, trust signals, B2B CTA |
| Catalogue | `/products` | Grid with category/price filters |
| Product detail | `/products/[slug]` | Specs table, colour picker, add-to-cart |
| Cart | `/cart` | Line items, totals, proceed to checkout |
| Checkout | `/checkout` | Shipping address form, order summary |
| Confirmation | `/order-confirmation` | Reads `lastOrder` from cart store |
| B2B | `/b2b` | Volume pricing info + enquiry form |
| About | `/about` | Company story |

---

## 9. What Has Been Built (Commit History)

| Commit | Summary |
|---|---|
| `d02ca52` | First commit — empty repo scaffold |
| `d609859` | Full-stack headless commerce platform scaffold (backend + frontend skeleton) |
| `5a2b196` | Rebuilt frontend as standalone e-commerce with complete shopping workflow |
| `866752a` | Added `next-env.d.ts` and `package-lock.json` |
| `943bb86` | Merged furniture business setup branch |
| `1f2bb8b` | Removed unused dependencies, optimised Docker builds |
| `2ad2137` | Merged slow-dependencies investigation branch |
| _(current)_ | Added comprehensive code comments to all source files + this document |

---

## 10. Environment Variables Quick Reference

Copy `.env.example` to `.env` and fill in the values below:

```dotenv
# Required for any local run
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/universal_ergonomics
DATABASE_URL_SYNC=postgresql://postgres:postgres@localhost:5432/universal_ergonomics
SECRET_KEY=<your-secret-key>

# Optional integrations (service degrades gracefully without these)
TELEGRAM_BOT_TOKEN=
TELEGRAM_WAREHOUSE_CHAT_ID=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## 11. Known Gaps / Next Steps

- [ ] Frontend is not wired to the backend API — product data is static.
- [ ] No authentication middleware on protected endpoints (is_admin checks missing).
- [ ] Razorpay payment flow is not implemented (payment_status stays PENDING).
- [ ] Celery worker and Redis are configured but the scraping task is not scheduled.
- [ ] AR/3D model viewer (`ar_model_url`) is a placeholder — no viewer component exists.
- [ ] Address geocoding (populating lat/lng on Address) is not implemented.
- [ ] B2B discount is documented in settings but not applied in the order creation logic.
- [ ] Alembic migrations have not been created — `create_all` or manual DDL needed.
