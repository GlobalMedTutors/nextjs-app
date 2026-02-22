# Neon Database Setup

## Step 1: Get Your Neon Connection String

1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project
3. Go to **Connection Details**
4. Copy the **Connection String** (it looks like: `postgresql://user:password@host/database?sslmode=require`)

## Step 2: Add DATABASE_URL to Vercel

Run this command and paste your Neon connection string when prompted:

```bash
cd /Users/naveen/global-med-tutors/nextjs-app
vercel env add DATABASE_URL production
```

When prompted:
- **Value**: Paste your Neon connection string
- **Environment**: Select **Production**, **Preview**, and **Development**

Or add it via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Click **Add New**
4. Name: `DATABASE_URL`
5. Value: Your Neon connection string
6. Select all environments
7. Click **Save**

## Step 3: Create Initial Migration

After setting DATABASE_URL, create the migration:

```bash
cd /Users/naveen/global-med-tutors/nextjs-app

# Option A: Set DATABASE_URL locally first
export DATABASE_URL="your-neon-connection-string"

# Create migration
npx prisma migrate dev --name init
```

## Step 4: Deploy Migration to Production

The migration will run automatically during Vercel build (configured in `package.json`), but you can also run it manually:

```bash
# Pull env vars from Vercel
vercel env pull .env.local

# Deploy migration
npx prisma migrate deploy
```

## Step 5: Verify

After deployment, test the connection:

```bash
# Test locally
npx prisma db pull

# Or check Vercel logs after deployment
vercel logs --follow
```

## Troubleshooting

**Error: "Can't reach database server"**
- Verify DATABASE_URL is correct
- Check Neon dashboard - database should be running
- Ensure connection string includes `?sslmode=require`

**Error: "relation does not exist"**
- Run migrations: `npx prisma migrate deploy`
- Check migrations folder exists in `prisma/migrations/`

**Error: "Connection timeout"**
- Check Neon project is active (not paused)
- Verify network/firewall settings in Neon

## Quick Commands

```bash
# Add DATABASE_URL to Vercel
vercel env add DATABASE_URL production

# Create migration (local)
npx prisma migrate dev --name init

# Deploy migration (production)
npx prisma migrate deploy

# Check database connection
npx prisma db pull
```
