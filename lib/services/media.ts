import {
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer'
import crypto from 'crypto'
import { lookup } from 'mrmime'
import { ENV } from '@/lib/config/env'

const s3Client = new S3Client({ region: ENV.AWS_REGION })

export type MediaUploadUrlPart = {
  uploadUrl: string
  partNumber: number
}

export type MediaMultipartUploadPart = {
  PartNumber: number
  ETag: string
}

export async function getDownloadUrl(filepath: string): Promise<string> {
  const expirationTime = new Date()
  expirationTime.setSeconds(expirationTime.getSeconds() + ENV.S3_URL_EXPIRATION_SEC)

  return getCloudFrontSignedUrl({
    url: `${ENV.CF_DISTRIBUTION_URL}/${filepath}`,
    keyPairId: ENV.CF_PUBLIC_KEY_ID,
    privateKey: ENV.CF_PRIVATE_KEY,
    dateLessThan: expirationTime.toISOString(),
  })
}

export async function getMultipartUploadUrls(
  filename: string,
  entityType: string,
  partCount: number,
  userId: string,
  replace: boolean = false
) {
  const uniqueFilename = generateUniqueFilename(filename)
  const filepath = replace ? `${entityType.toLowerCase()}/${userId}/${uniqueFilename}` : filename
  const contentType = lookup(filepath)
  
  const createMultipartUploadParams = {
    Bucket: ENV.S3_BUCKET_NAME,
    Key: filepath,
    ...(contentType ? { ContentType: contentType } : {}),
  }

  const { UploadId: fileId } = await s3Client.send(new CreateMultipartUploadCommand(createMultipartUploadParams))

  const putObjectParams = {
    Bucket: ENV.S3_BUCKET_NAME,
    Key: filepath,
    UploadId: fileId,
  }
  
  const parts: MediaUploadUrlPart[] = []

  for (let idx = 0; idx < partCount; idx++) {
    const partNumber = idx + 1
    const uploadUrl = await getS3SignedUrl(
      s3Client,
      new UploadPartCommand({ ...putObjectParams, PartNumber: partNumber }),
      {
        expiresIn: ENV.S3_URL_EXPIRATION_SEC,
      }
    )

    parts.push({ uploadUrl, partNumber })
  }

  if (!replace) {
    await invalidateCache(filepath)
  }

  return { fileId, filepath, parts }
}

function generateUniqueFilename(filename: string): string {
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(8).toString('hex')
  const extension = filename.split('.').pop()
  const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.')) || filename
  return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`
}

async function invalidateCache(filepath: string) {
  // CloudFront invalidation logic if needed
  // This would require CloudFront client setup
}
