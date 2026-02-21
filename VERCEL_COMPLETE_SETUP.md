# Complete Vercel Setup Guide

This guide shows you how to use Vercel services for everything possible.

## 🎯 What Vercel Provides

✅ **Vercel Postgres** - Database (replaces external PostgreSQL)  
✅ **Vercel Blob Storage** - File storage (replaces S3/CloudFront)  
✅ **Vercel Edge Network** - CDN (built-in, replaces CloudFront)  
✅ **Vercel Functions** - Serverless functions (already using)  
✅ **Vercel Analytics** - Optional analytics  

## 📋 Step-by-Step Setup

### 1. Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose a plan (Hobby free tier available)
5. Vercel automatically creates `POSTGRES_URL` environment variable

**Update your code:**
- In Vercel, add environment variable: `DATABASE_URL` = same value as `POSTGRES_URL`
- Or update your Prisma config to use `POSTGRES_URL` directly

### 2. Create Vercel Blob Storage

1. In your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database** → Select **Blob**
4. Choose a plan (Hobby free tier available)
5. Vercel automatically creates `BLOB_READ_WRITE_TOKEN` environment variable

**No additional setup needed** - the code is already updated to use Vercel Blob!

### 3. Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add:

#### Database (Auto-configured by Vercel Postgres)
```
DATABASE_URL = [Auto-filled from Vercel Postgres]
# OR use POSTGRES_URL directly
```

#### NextAuth
```
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = [Generate with: openssl rand -base64 32]
```

#### AWS Cognito (Still Required)
```
COGNITO_CLIENT_ID = [Your Cognito Client ID]
COGNITO_CLIENT_SECRET = [Your Cognito Client Secret]
COGNITO_ISSUER = https://cognito-idp.REGION.amazonaws.com/POOL_ID
COGNITO_JWKS_URL = https://cognito-idp.REGION.amazonaws.com/POOL_ID/.well-known/jwks.json
```

#### Stripe (Still Required)
```
STRIPE_SECRET_KEY = sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_... or pk_test_...
```

#### Zoom (Still Required)
```
ZOOM_CLIENT_ID = [Your Zoom Client ID]
ZOOM_CLIENT_SECRET = [Your Zoom Client Secret]
ZOOM_ACCOUNT_ID = [Your Zoom Account ID]
```

#### Application URLs
```
INSTRUCTOR_URL = https://your-app.vercel.app
STUDENT_URL = https://your-app.vercel.app
PLATFORM_FEE = 10
ENV = production
```

#### Vercel Blob (Auto-configured)
```
BLOB_READ_WRITE_TOKEN = [Auto-filled from Vercel Blob]
```

### 4. Remove S3/CloudFront Variables

You can **remove** these since we're using Vercel Blob:
- ❌ `AWS_REGION`
- ❌ `S3_BUCKET_NAME`
- ❌ `S3_URL_EXPIRATION_SEC`
- ❌ `CF_PUBLIC_KEY_ID`
- ❌ `CF_PRIVATE_KEY`
- ❌ `CF_DISTRIBUTION_URL`

### 5. Database Migrations

After deploying, run migrations:

**Option A: Via Vercel CLI**
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Add to package.json scripts**
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### 6. Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 7. Configure Cognito

1. Go to AWS Cognito Console
2. Add to **Allowed callback URLs**: `https://your-app.vercel.app/api/auth/callback/cognito`
3. Add to **Allowed sign-out URLs**: `https://your-app.vercel.app`
4. Save changes

### 8. Deploy

1. Push your code to GitHub/GitLab
2. Vercel will auto-deploy
3. Or deploy manually: `vercel --prod`

## 📊 What You're Using

### Vercel Services ✅
- **Vercel Postgres** - Database
- **Vercel Blob** - File storage
- **Vercel Edge Network** - CDN (automatic)
- **Vercel Functions** - API routes

### External Services (Required)
- **AWS Cognito** - Authentication
- **Stripe** - Payments
- **Zoom** - Video meetings

## 💰 Estimated Costs

### Vercel Hobby (Free Tier)
- Postgres: 256 MB storage, 60 hours compute/month
- Blob: 1 GB storage, 1 GB bandwidth/month
- Functions: 100 GB-hours/month
- **Total: $0/month** (for small apps)

### Vercel Pro ($20/month)
- Postgres: 8 GB storage, unlimited compute
- Blob: 100 GB storage, 1 TB bandwidth
- Functions: 1000 GB-hours/month
- **Total: $20/month** (much cheaper than AWS!)

## 🚀 Quick Start Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
cd nextjs-app
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Deploy
vercel --prod
```

## ✅ Checklist

- [ ] Create Vercel Postgres database
- [ ] Create Vercel Blob storage
- [ ] Set all environment variables in Vercel
- [ ] Configure Stripe webhook
- [ ] Configure Cognito callback URLs
- [ ] Run database migrations
- [ ] Deploy to Vercel
- [ ] Test authentication
- [ ] Test file uploads
- [ ] Test payments

That's it! You're now using Vercel for database, storage, and hosting. 🎉
