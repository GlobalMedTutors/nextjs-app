# Database Setup Guide

## Option 1: Vercel Postgres (Recommended)

### Step 1: Create Vercel Postgres Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `nextjs-app`
3. Click the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a plan:
   - **Hobby** (Free): 256 MB storage, 60 hours compute/month
   - **Pro** ($20/month): 8 GB storage, unlimited compute
7. Name it: `global-med-tutors-db` (or any name)
8. Click **Create**

### Step 2: Set DATABASE_URL

Vercel automatically creates `POSTGRES_URL`. You need to set `DATABASE_URL`:

1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. You should see `POSTGRES_URL` (auto-created)
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Copy the value from `POSTGRES_URL`
   - **Environment**: Select **Production**, **Preview**, and **Development**
   - Click **Save**

### Step 3: Run Database Migrations

After setting DATABASE_URL, run migrations:

```bash
cd /Users/naveen/global-med-tutors/nextjs-app

# Pull environment variables locally
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

Or migrations will run automatically during build (already configured in `package.json`).

## Option 2: External PostgreSQL (Neon, Supabase, etc.)

If you prefer an external database:

1. Create a PostgreSQL database (Neon, Supabase, Railway, etc.)
2. Get the connection string
3. In Vercel Dashboard → **Settings** → **Environment Variables**:
   - Add `DATABASE_URL` with your connection string
   - Select all environments
4. Run migrations as above

## Verify Setup

After setup, verify the connection:

```bash
# Test connection
npx prisma db pull

# Or check in Vercel logs after deployment
```

## Troubleshooting

**Error: "Can't reach database server"**
- Check DATABASE_URL is set correctly
- Verify database is running
- Check firewall/network settings

**Error: "relation does not exist"**
- Run migrations: `npx prisma migrate deploy`
- Check migrations ran successfully

**Error: "Connection timeout"**
- Verify DATABASE_URL format
- Check if database allows connections from Vercel IPs
