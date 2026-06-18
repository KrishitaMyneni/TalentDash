# TalentDash

**Compensation intelligence for the modern job market.**

TalentDash is a production-quality salary data platform inspired by Levels.fyi, Glassdoor, and AmbitionBox. It surfaces verified compensation data by company, role, level, and location — built with a static-first, SEO-optimized architecture.

🌐 **Live demo:** [talentdash-gamma.vercel.app](https://talentdash-gamma.vercel.app)

---

## What It Does

- Browse and filter salary records by company, role, level, location, and currency
- View per-company pages with median TC, salary range, and level distribution
- Compare two salary records side-by-side
- Ingest new salary data via a REST API with built-in validation and duplicate detection
- Fully SEO-optimized with JSON-LD structured data, Open Graph metadata, and canonical URLs

> **Not a generic CRUD dashboard.** This MVP is intentionally scoped around compensation discovery: database-driven static pages, programmatic SEO, and a clean data quality layer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL 14+ |
| ORM | Prisma 5.22.0 |
| Validation | Zod 4 |
| Runtime | Node.js 20+ |

---

## Architecture Highlights

**Static-first delivery** — Pages are pre-rendered at build time or regenerated via ISR, keeping TTFB low and cache hit ratios high.

**Database-driven static generation** — Company pages use `generateStaticParams()` to pull real slugs from PostgreSQL at build time. New companies appear after ISR revalidation.

**Server Components query Prisma directly** — No internal API round-trips from the frontend. API routes exist for ingestion, external consumers, and testing.

**Minimal client hydration** — Client Components are reserved for interactive elements (filters, comparison selectors). Everything else is server-rendered.

**Data quality layer** — Company names, roles, and locations are normalized before storage. `Google India`, `GOOGLE`, and `google` all resolve to the same entity. Duplicate detection rejects near-identical submissions within 48 hours and 10% base salary variance.

**Statistics service** — All median, range, percentile, and level-distribution calculations live in `lib/statistics.ts` and are reused across pages and API routes.

---

## Rendering Strategy

| Route | Strategy | Revalidation | Rationale |
|---|---|---|---|
| `/companies/[slug]` | SSG via `generateStaticParams()` | 24 hours | Company metadata changes rarely |
| `/salaries` | ISR Server Component | 1 hour | Fresh enough for ingested data |
| `/compare` | Dynamic Server Component | 1 hour | Query-param driven, shareable URLs |
| `/api/*` | Dynamic (`force-dynamic`) | — | Reads request bodies and URL params |

---

## Project Structure

```
talentdash/
├── app/
│   ├── api/
│   │   ├── companies/[slug]/route.ts
│   │   ├── compare/route.ts
│   │   ├── ingest-salary/route.ts
│   │   └── salaries/route.ts
│   ├── companies/[slug]/page.tsx
│   ├── compare/page.tsx
│   ├── salaries/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── features/        # Page-level feature components
│   └── ui/              # Reusable UI primitives
├── lib/
│   ├── currency.ts
│   ├── data-quality.ts
│   ├── prisma.ts
│   ├── schemas.ts
│   ├── seo.ts
│   └── statistics.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts          # 61 records across 12 companies
└── types/
    └── index.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or remote)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=disable"
```

For local development without a password:

```env
DATABASE_URL="postgresql://postgres@127.0.0.1:5432/postgres?sslmode=disable"
```

### 3. Run migrations and seed

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed script inserts 61 realistic salary records across 12 companies and multiple locations, including normalization edge cases.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production build

```bash
npm run build
npm run start
```

---

## Quick Test URLs

Once the dev server is running:

| URL | What it shows |
|---|---|
| `/salaries` | Browse and filter all salary records |
| `/companies/google` | Google's median TC, range, and level breakdown |
| `/companies/amazon` | Amazon company page |
| `/companies/meta` | Meta company page |
| `/compare?s1=<id>&s2=<id>` | Side-by-side salary comparison |

---

## API Reference

### `POST /api/ingest-salary`

Submit a new salary record.

```bash
curl -X POST http://localhost:3000/api/ingest-salary \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "role": "Software Engineer",
    "level": "L4",
    "location": "Bangalore, India",
    "experience_years": 5,
    "base_salary": 4200000,
    "bonus": 420000,
    "stock": 800000,
    "currency": "INR",
    "source": "CONTRIBUTOR",
    "confidence_score": 0.85
  }'
```

**Request body fields:**

| Field | Type | Notes |
|---|---|---|
| `company` | string | Normalized to a canonical entity |
| `role` | string | Trimmed and title-cased |
| `level` | enum | `L3` · `L4` · `L5` · `L6` · `SDE_I` · `SDE_II` · `SDE_III` · `STAFF` · `PRINCIPAL` · `IC4` · `IC5` |
| `location` | string | Trimmed and normalized |
| `experience_years` | int | 0–50 |
| `base_salary` | decimal | Positive |
| `bonus` | decimal | Optional, defaults to 0 |
| `stock` | decimal | Optional, defaults to 0 |
| `currency` | enum | `INR` · `USD` · `EUR` · `GBP` |
| `source` | enum | `CONTRIBUTOR` · `SCRAPED` · `AI_INFERRED` |

**Responses:** `201` success · `400` validation error · `409` duplicate detected

---

### `GET /api/salaries`

Returns paginated, filterable salary records.

```bash
curl "http://localhost:3000/api/salaries?company=google&level=L4&page=1&limit=10"
```

**Query parameters:**

| Parameter | Default | Description |
|---|---|---|
| `company` | — | Partial match (case-insensitive) |
| `role` | — | Partial match (case-insensitive) |
| `level` | — | Exact level filter |
| `location` | — | Partial match (case-insensitive) |
| `currency` | — | Exact currency filter |
| `page` | `1` | Page number |
| `limit` | `25` | Page size (max 100) |
| `sort` | `total_compensation` | Sort field |
| `order` | `desc` | `asc` or `desc` |

**Response shape:**

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 25,
    "totalPages": 4
  }
}
```

---

### `GET /api/companies/[slug]`

Returns company metadata, salary records (sorted by total compensation), true median TC, salary range, and level distribution.

```bash
curl "http://localhost:3000/api/companies/google"
```

**Responses:** `200` with payload · `404` if company not found

---

### `GET /api/compare`

Compares two salary records by ID.

```bash
curl "http://localhost:3000/api/compare?s1=<uuid>&s2=<uuid>"
```

**Responses:** `200` with both records and deltas · `400` invalid/identical IDs · `404` record not found

---

## Data Quality & Statistics

### `lib/data-quality.ts`

- `normalizeCompanyName(name)` — strips geographic/corporate suffixes, title-cases the result
- `normalizeRole(role)` — trims and title-cases role strings
- `normalizeLocation(location)` — trims and normalizes location strings
- `isPotentialDuplicate(existing, incoming)` — 48-hour window + 10% base salary variance check

### `lib/statistics.ts`

- `calculateMedianCompensation(records)` — true median total compensation
- `calculateSalaryRange(records)` — min/max TC
- `calculateLevelDistribution(records)` — count per level
- `calculatePercentiles(records, percentiles)` — configurable percentile values

---

## Deployment

This project is designed for Vercel or any Node.js host with PostgreSQL access.

1. Set `DATABASE_URL` in your hosting environment
2. Run `npx prisma migrate deploy` during the build/release phase
3. Run `npx prisma db seed` on first deploy (skip on subsequent deploys)
4. Build with `npm run build`

> API routes are marked `force-dynamic` because they depend on request bodies and URL parameters. Pages use SSG/ISR wherever possible.

---

## Intentional Scope

To keep this MVP focused and production-quality within its boundaries, the following were deliberately left out:

- Authentication / authorization
- User reviews, interviews, or workplace indexes
- Social features (comments, voting, forums)
- Admin dashboards or billing
- Redis, queues, scrapers, or background jobs

---

## Roadmap

- Faceted search with aggregated role and location counts
- Full-text search via PostgreSQL `tsvector`
- Salary trend charts over time
- Verified submissions via email domain or offer letter upload
- GraphQL or tRPC API for richer client queries
- Neon PostgreSQL for serverless Vercel compatibility

---

## License

MIT
