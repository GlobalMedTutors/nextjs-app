/**
 * Wrapper for Vercel Blob to prevent build-time initialization
 * This ensures the blob client is only created at runtime
 */

let blobModule: typeof import('@vercel/blob') | null = null

async function getBlobModule() {
  if (!blobModule) {
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
