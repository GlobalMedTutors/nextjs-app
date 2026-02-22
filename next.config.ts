import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Skip static optimization for API routes that use Vercel Blob
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Ensure BLOB_READ_WRITE_TOKEN is available during build
  env: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || '',
  },
};

export default nextConfig;
