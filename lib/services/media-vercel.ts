import { put, list, del } from '@vercel/blob'
import crypto from 'crypto'

export type MediaUploadUrlPart = {
  uploadUrl: string
  partNumber: number
}

export type MediaMultipartUploadPart = {
  PartNumber: number
  ETag: string
}

/**
 * Get download URL for a file stored in Vercel Blob
 * Vercel Blob URLs are public by default, but you can generate signed URLs if needed
 */
export async function getDownloadUrl(filepath: string): Promise<string> {
  // Vercel Blob URLs are already accessible, but you can add expiration if needed
  // For now, return the filepath as-is (assuming it's a full URL)
  return filepath
}

/**
 * Upload file to Vercel Blob Storage
 * Note: Vercel Blob doesn't support multipart uploads like S3
 * For large files, you might need to upload directly from the client
 */
export async function uploadFile(
  filename: string,
  entityType: string,
  userId: string,
  file: Buffer | File
): Promise<string | null> {
  try {
    const uniqueFilename = generateUniqueFilename(filename)
    const filepath = `${entityType.toLowerCase()}/${userId}/${uniqueFilename}`

    const blob = await put(filepath, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return blob.url
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error)
    return null
  }
}

/**
 * Get upload URL for client-side uploads
 * Vercel Blob supports direct client uploads with tokens
 */
export async function getUploadUrl(
  filename: string,
  entityType: string,
  userId: string
): Promise<{ url: string; filepath: string }> {
  const uniqueFilename = generateUniqueFilename(filename)
  const filepath = `${entityType.toLowerCase()}/${userId}/${uniqueFilename}`

  // For client-side uploads, you'll need to generate a token
  // This is a simplified version - you might want to use Vercel's client upload API
  return {
    url: '', // Will be generated on client side
    filepath,
  }
}

function generateUniqueFilename(filename: string): string {
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(8).toString('hex')
  const extension = filename.split('.').pop()
  const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.')) || filename
  return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`
}
