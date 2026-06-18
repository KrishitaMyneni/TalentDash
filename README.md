# TalentDash MVP

TalentDash is a production-quality compensation intelligence platform inspired by Levels.fyi, Glassdoor, and AmbitionBox. It surfaces verified salary data by company, role, level, and location with a static-first, SEO-optimized architecture.

> **Not a generic CRUD dashboard.** This MVP is intentionally focused on compensation discovery: database-driven static pages, programmatic SEO, and a clean data quality layer.

---

## Tech Stack

- **Framework:** Next.js 15.5.19 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL
- **ORM:** Prisma 5.22.0
- **Validation:** Zod 4
- **Runtime:** Node.js 20+

---

## Architecture Decisions

### Static-First / CDN-First Delivery

Pages are pre-rendered at build time or regenerated via ISR. This minimizes request-time database load, maximizes cache hit ratios, and keeps Time to First Byte (TTFB) low.

### Database-Driven Static Generation

Company pages use `generateStaticParams()` to read real slugs from PostgreSQL at build time. Adding a new company via the ingestion API will eventually create a new static page after ISR revalidation.

### Server Components Query Prisma Directly

Frontend pages do **not** call their own internal API routes. Server Components import `prisma` from `lib/prisma.ts` and query the database directly. API routes exist for ingestion, external consumers, and reviewer testing.

### Minimal Client Hydration

Client Components are reserved for interactive elements (filters, comparison selectors). Data fetching happens on the server by default.

### Data Quality Layer

Company names, roles, and locations are normalized before storage. `Google India`, `GOOGLE`, and `google` resolve to a single `Company` entity. Duplicate detection prevents near-identical submissions within 48 hours and 10% base salary variance.

### Statistics Service Layer

All median, range, percentile, and level-distribution calculations live in `lib/statistics.ts` and are reused across pages and API routes.

---

## Rendering Strategy

| Route | Strategy | Revalidate | Rationale |
|-------|----------|------------|-----------|
| `/companies/[slug]` | SSG via `generateStaticParams()` | 86400 s (1 day) | Company metadata changes rarely; ideal for CDN caching. |
| `/salaries` | ISR Server Component | 3600 s (1 hour) | Salary data changes through ingestion; hourly freshness. |
| `/compare` | Dynamic Server Component | 3600 s (1 hour) | URLs are shareable and state is query-param driven. |
| `/api/*` | Dynamic (force-dynamic) | - | APIs read request bodies/URL params; cannot be static. |

---

## Pagination Strategy

- `/salaries` displays **25 records per page**.
- `/api/salaries` enforces pagination with `page` and `limit` parameters.
- Maximum API page size is **100**.
- Response includes `meta` with `total`, `page`, `limit`, and `totalPages`.

---

## SEO & Structured Data Strategy

- Dynamic `generateMetadata()` on every page.
- Canonical URL helpers strip duplicate variants (e.g., default values, trailing empty params).
- JSON-LD structured data on `/salaries`, `/companies/[slug]`, and `/compare`.
- Internal linking strategy connects company pages, salary listings, and comparisons for crawl optimization.
- Open Graph metadata on company pages includes median compensation.

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
│   ├── features/     # Page-level feature components
│   └── ui/           # Reusable UI primitives
├── lib/
│   ├── currency.ts
│   ├── data-quality.ts
│   ├── prisma.ts
│   ├── schemas.ts
│   ├── seo.ts
│   └── statistics.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/
│   └── index.ts
├── .env
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally or a remote Postgres URL

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create or update `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=disable"
```

For local development without a password:

```env
DATABASE_URL="postgresql://postgres@127.0.0.1:51220/postgres?sslmode=disable"
```

### 3. Run Migrations & Seed

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed script inserts 61 realistic salary records across 12 companies and multiple locations, including normalization edge cases.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production Build

```bash
npm run build
npm run start
```

---

## Reviewer Quick Start

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Test URLs

- `/salaries` — browse and filter salary records
- `/companies/google` — company detail page with median, range, and level distribution
- `/companies/amazon`
- `/companies/meta`
- `/compare?s1=<id>&s2=<id>` — side-by-side comparison

### Sample API Requests

**Ingest a salary:**

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

**List salaries with filters:**

```bash
curl "http://localhost:3000/api/salaries?company=google&level=L4&page=1&limit=10"
```

**Compare two records:**

```bash
curl "http://localhost:3000/api/compare?s1=<id>&s2=<id>"
```

**Get company details:**

```bash
curl "http://localhost:3000/api/companies/google"
```

---

## API Documentation

### `POST /api/ingest-salary`

Submits a new salary record.

**Request Body (Zod validated):**

| Field | Type | Notes |
|-------|------|-------|
| `company` | string | Normalized to a canonical company entity |
| `role` | string | Trimmed and title-cased |
| `level` | enum | `L3` \| `L4` \| `L5` \| `L6` \| `SDE_I` \| `SDE_II` \| `SDE_III` \| `STAFF` \| `PRINCIPAL` \| `IC4` \| `IC5` |
| `location` | string | Trimmed and normalized |
| `experience_years` | int | 0-50 |
| `base_salary` | decimal | Positive |
| `bonus` | decimal | Optional, defaults to 0 |
| `stock` | decimal | Optional, defaults to 0 |
| `currency` | enum | `INR` \| `USD` \| `EUR` \| `GBP` |
| `source` | enum | `CONTRIBUTOR` \| `SCRAPED` \| `AI_INFERRED` |

**Behavior:**

- Total compensation is recomputed server-side: `base + bonus + stock`.
- Duplicate detection rejects submissions matching `company + role + level + location` within 48 hours and within 10% base salary variance.
- Returns `201` on success, `400` on validation failure, `409` on duplicate.

### `GET /api/salaries`

Returns paginated salary records.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `company` | string | - | Partial company name (ILIKE) |
| `role` | string | - | Partial role match (ILIKE) |
| `level` | enum | - | Exact level filter |
| `location` | string | - | Partial location match (ILIKE) |
| `currency` | enum | - | Exact currency filter |
| `page` | int | 1 | Page number |
| `limit` | int | 25 | Page size (max 100) |
| `sort` | string | `total_compensation` | Sort field |
| `order` | `asc` \| `desc` | `desc` | Sort order |

**Response:**

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

### `GET /api/companies/[slug]`

Returns company metadata, salary records sorted by total compensation descending, true median TC, salary range, and level distribution.

**Response:** `200` with company payload, `404` if company not found.

### `GET /api/compare`

Compares two salary records by ID.

**Query Parameters:** `s1`, `s2` (UUID salary record IDs)

**Response:** `200` with both records and deltas, `400` if IDs are identical or invalid, `404` if a record is missing.

---

## Data Quality & Statistics Layers

### `lib/data-quality.ts`

- `normalizeCompanyName(name)` — strips geographic/corporate suffixes and title-cases.
- `normalizeRole(role)` — trims and title-cases role strings.
- `normalizeLocation(location)` — trims and normalizes location strings.
- `isPotentialDuplicate(existing, incoming)` — 48-hour + 10% base variance check.

### `lib/statistics.ts`

- `calculateMedianCompensation(records)` — true median total compensation.
- `calculateSalaryRange(records)` — min/max TC.
- `calculateLevelDistribution(records)` — count per level.
- `calculatePercentiles(records, percentiles)` — configurable percentile values.

---

## What Was Intentionally NOT Built

To keep the MVP focused and production-quality within scope:

- Authentication / authorization
- User reviews, interviews, or workplace indexes
- Social features (forums, comments, voting)
- Admin dashboards or SaaS billing
- Redis, queues, scrapers, background jobs, or AI inference endpoints
- Image assets (opportunistic `next/image` usage only)

---

## Future Improvements

- Add role and location faceted search with aggregated counts.
- Implement full-text search via PostgreSQL `tsvector`.
- Add salary trend charts over time.
- Introduce verified submissions (email domain / offer letter verification).
- Add GraphQL or tRPC API for richer client queries.
- Deploy to Vercel with Neon PostgreSQL for serverless compatibility.

---

## Deployment

This project is designed for Vercel or any Node.js hosting platform with PostgreSQL access.

1. Set `DATABASE_URL` in your hosting environment.
2. Run `npx prisma migrate deploy` during the build/release phase.
3. Run `npx prisma db seed` for the first deployment (optional for subsequent deploys).
4. Build with `npm run build`.

> **Note:** API routes are marked `dynamic = "force-dynamic"` because they depend on request bodies and URL parameters. Pages use SSG/ISR where possible.

---

## License

MIT
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
