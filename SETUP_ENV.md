# Setting Up Vercel Environment Variables

## Step 1: Login to Vercel CLI

```bash
cd /Users/naveen/global-med-tutors/nextjs-app
vercel login
```

This will open a browser for authentication.

## Step 2: Link Your Project

```bash
vercel link
```

Select your project: `global-med-tutors` or `nextjs-app`

## Step 3: Set Environment Variables

### Option A: Use the Script (Quick)

```bash
./setup-vercel-env.sh
```

### Option B: Manual Setup via CLI

```bash
# NextAuth
vercel env add NEXTAUTH_URL production
# Enter: https://global-med-tutors.vercel.app

vercel env add NEXTAUTH_SECRET production
# Enter: +0hIgTtfg7rIRQ1LtZob5TUYkIewwAjx7Z4fDOxWVVw=

# Application URLs
vercel env add INSTRUCTOR_URL production
# Enter: https://global-med-tutors.vercel.app

vercel env add STUDENT_URL production
# Enter: https://global-med-tutors.vercel.app

vercel env add PLATFORM_FEE production
# Enter: 10

vercel env add ENV production
# Enter: production
```

### Option C: Set via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable manually

## Step 4: Set Sensitive Variables (Dashboard Recommended)

These should be set in the Vercel Dashboard for security:

- `DATABASE_URL` (from Neon integration - auto-set)
- `BLOB_READ_WRITE_TOKEN` (from Vercel Blob - auto-set)
- `COGNITO_CLIENT_ID`
- `COGNITO_CLIENT_SECRET`
- `COGNITO_ISSUER`
- `COGNITO_JWKS_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `ZOOM_CLIENT_ID`
- `ZOOM_CLIENT_SECRET`
- `ZOOM_ACCOUNT_ID`

## Quick Commands

```bash
# Login
vercel login

# Link project
vercel link

# Run setup script
./setup-vercel-env.sh

# Or set manually
vercel env add VARIABLE_NAME production
```
