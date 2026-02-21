export const ENV = {
  ENV: process.env.ENV ?? 'development',
  // AWS Cognito (still required)
  COGNITO_JWKS_URL: process.env.COGNITO_JWKS_URL,
  // Zoom (still required)
  ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID ?? '',
  ZOOM_CLIENT_SECRET: process.env.ZOOM_CLIENT_SECRET ?? '',
  ZOOM_ACCOUNT_ID: process.env.ZOOM_ACCOUNT_ID ?? '',
  // Application URLs
  INSTRUCTOR_URL: process.env.INSTRUCTOR_URL ?? '',
  STUDENT_URL: process.env.STUDENT_URL ?? '',
  // Stripe (still required)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  PLATFORM_FEE: parseInt(process.env.PLATFORM_FEE ?? '10'),
  // Vercel Blob (auto-configured)
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ?? '',
}
