# TalentDash - Deployment Guide

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL
- **ORM**: Prisma 5.22.0
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network

## Quick Start

### 1. Database Setup (Neon)

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string from dashboard
4. Update `DATABASE_URL` in Vercel environment variables

### 2. Local Development

```bash
cd talentdash
npm install
cp .env.example .env
# Add your DATABASE_URL to .env
npm run dev
```

### 3. Database Migrations

```bash
# Push schema to Neon database
npx prisma db push

# Or use migrations for production
npx prisma migrate deploy
```

### 4. Deploy to Vercel

**Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option B: GitHub Integration**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure build settings (auto-detected for Next.js)
6. Add environment variables:
   - `DATABASE_URL` (Neon connection string)
7. Deploy!

**Option C: Vercel Dashboard**
1. Visit https://vercel.com/new
2. Import your Git repository
3. Vercel auto-detects Next.js configuration
4. Add environment variables
5. Click Deploy

### 5. Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Environment |
|----------|-------------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Production, Preview, Development |
| `NEXT_TELEMETRY_DISABLED` | `1` | All |

### 6. Post-Deployment

1. **Verify database connection**: Visit `/salaries` page
2. **Check ISR**: Pages should cache and revalidate every 3600 seconds
3. **Monitor**: Check Vercel Analytics for performance
4. **Custom Domain** (optional): Configure in Vercel dashboard

## Build Commands

```bash
npm run dev          # Local development
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema to database
vercel               # Preview deployment
vercel --prod        # Production deployment
```

## Architecture

- **Server Components**: All pages use React Server Components
- **ISR**: Pages revalidate every 3600 seconds
- **Minimal Client Hydration**: Only interactive components (filters, comparisons)
- **Static Generation**: Home page, company pages, salary listings

## Vercel-Specific Optimizations

- **Automatic ISR**: Next.js ISR works out of the box on Vercel
- **Edge Network**: Global CDN with edge caching
- **Analytics**: Built-in performance monitoring
- **Preview Deployments**: Every PR gets a unique URL
- **Automatic HTTPS**: SSL certificates managed automatically

## Performance

- Vercel Edge Network for global delivery
- ISR for fast page loads (3600s revalidation)
- Optimized images and assets
- Minimal JavaScript bundle
- Automatic code splitting

## Troubleshooting

**Build fails?**
- Check `DATABASE_URL` is set in Vercel environment variables
- Ensure Prisma schema is valid: `npx prisma validate`
- Run `npm run build` locally first to catch errors

**Database connection error?**
- Verify Neon connection string is correct
- Check Neon project is active
- Ensure SSL mode is set to `require`

**Page not updating?**
- ISR cache may need to clear
- Visit page with `?vercel-fresh` parameter
- Redeploy if needed
# TalentDash - Deployment Guide

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL
- **ORM**: Prisma 5.22.0
- **Hosting**: Cloudflare Pages
- **CDN**: Cloudflare CDN

## Quick Start

### 1. Database Setup (Neon)

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string from dashboard
4. Update `DATABASE_URL` in Cloudflare Pages environment variables

### 2. Local Development

```bash
cd talentdash
npm install
cp .env.example .env
# Add your DATABASE_URL to .env
npm run dev
```

### 3. Database Migrations

```bash
# Push schema to Neon database
npx prisma db push

# Or use migrations for production
npx prisma migrate deploy
```

### 4. Deploy to Cloudflare Pages

**Option A: Git Integration (Recommended)**
1. Push code to GitHub
2. Go to Cloudflare Pages dashboard
3. Connect repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. Add environment variables:
   - `DATABASE_URL` (Neon connection string)
6. Deploy!

**Option B: Wrangler CLI**
```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run build
wrangler pages deploy .next
```

### 5. Environment Variables

Set these in Cloudflare Pages dashboard → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NODE_ENV` | `production` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

### 6. Post-Deployment

1. **Verify database connection**: Visit `/salaries` page
2. **Check ISR**: Pages should cache and revalidate every 3600 seconds
3. **Monitor**: Check Cloudflare Analytics for performance

## Build Commands

```bash
npm run dev          # Local development
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema to database
```

## Architecture

- **Server Components**: All pages use React Server Components
- **ISR**: Pages revalidate every 3600 seconds
- **Minimal Client Hydration**: Only interactive components (filters, comparisons)
- **Static Generation**: Home page, company pages, salary listings

## Performance

- Cloudflare CDN for global edge delivery
- ISR for fast page loads
- Optimized images and assets
- Minimal JavaScript bundle
