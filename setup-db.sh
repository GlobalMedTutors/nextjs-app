#!/bin/bash
echo "Setting up database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set. Please:"
  echo "1. Get your Neon connection string from Neon dashboard"
  echo "2. Run: vercel env add DATABASE_URL production"
  echo "3. Paste your Neon connection string"
  echo ""
  echo "Or set it locally: export DATABASE_URL='your-neon-connection-string'"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""
echo "Creating initial migration..."
npx prisma migrate dev --name init

echo ""
echo "✅ Migration created!"
echo ""
echo "To apply to production database:"
echo "npx prisma migrate deploy"
