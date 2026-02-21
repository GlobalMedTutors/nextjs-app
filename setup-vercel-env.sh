#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this after: vercel login

echo "Setting up Vercel environment variables..."

# NextAuth
vercel env add NEXTAUTH_URL production <<< "https://global-med-tutors.vercel.app"
vercel env add NEXTAUTH_SECRET production <<< "+0hIgTtfg7rIRQ1LtZob5TUYkIewwAjx7Z4fDOxWVVw="

# Application URLs
vercel env add INSTRUCTOR_URL production <<< "https://global-med-tutors.vercel.app"
vercel env add STUDENT_URL production <<< "https://global-med-tutors.vercel.app"
vercel env add PLATFORM_FEE production <<< "10"
vercel env add ENV production <<< "production"

echo "✅ Basic environment variables set!"
echo ""
echo "⚠️  You still need to manually set these in Vercel Dashboard:"
echo "   - DATABASE_URL (from Neon integration)"
echo "   - BLOB_READ_WRITE_TOKEN (from Vercel Blob)"
echo "   - COGNITO_CLIENT_ID"
echo "   - COGNITO_CLIENT_SECRET"
echo "   - COGNITO_ISSUER"
echo "   - COGNITO_JWKS_URL"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   - ZOOM_CLIENT_ID"
echo "   - ZOOM_CLIENT_SECRET"
echo "   - ZOOM_ACCOUNT_ID"
