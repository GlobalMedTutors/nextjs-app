/**
 * Wrapper for Vercel Blob to prevent build-time initialization
 * This ensures the blob client is only created at runtime
 * 
 * IMPORTANT: This module should NEVER be imported at the top level
 * Only use dynamic imports: const { uploadToBlob } = await import('@/lib/services/blob-wrapper')
 */

let blobModule: typeof import('@vercel/blob') | null = null

async function getBlobModule() {
  if (!blobModule) {
    // Ensure token is available before importing
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      throw new Error('BLOB_READ_WRITE_TOKEN is required for blob operations')
    }
    // Dynamic import - should only happen at runtime, not during build
    blobModule = await import('@vercel/blob')
  }
  return blobModule
}

export async function uploadToBlob(
  filepath: string,
  file: File | Buffer,
  options: { access: 'public' | 'private'; addRandomSuffix?: boolean; token: string }
) {
  const { put } = await getBlobModule()
  return put(filepath, file, options)
}

export async function listBlobs(options: { prefix?: string; token?: string }) {
  const { list } = await getBlobModule()
  return list(options)
}

export async function deleteBlob(url: string, options: { token?: string }) {
  const { del } = await getBlobModule()
  return del(url, options)
}
