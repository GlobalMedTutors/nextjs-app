# Global Med Tutors - Next.js Application

This is the Next.js migration of the Global Med Tutors platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.example` to `.env` and fill in the required values.

3. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/lib` - Shared utilities, services, and configurations
- `/prisma` - Database schema and migrations
- `/components` - React components (to be added)

## API Routes

- `/api/users` - User management
- `/api/lessons` - Lesson management
- `/api/instructors` - Instructor management
- `/api/subjects` - Subject management
- `/api/payments/intent` - Payment intent creation
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/upload` - File upload (S3)

## Authentication

Uses NextAuth.js with AWS Cognito provider. Configure in `lib/auth/config.ts`.

## Deployment

Deploy to Vercel:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.
