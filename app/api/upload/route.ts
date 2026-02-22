import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'

// Force dynamic rendering to avoid build-time evaluation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType') as string

    if (!file || !entityType) {
      return NextResponse.json({ error: 'File and entityType required' }, { status: 400 })
    }

    const filename = file.name
    const filepath = `${entityType.toLowerCase()}/${user.id}/${filename}`

    // Use wrapper to prevent build-time initialization
    const { uploadToBlob } = await import('@/lib/services/blob-wrapper')
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not configured' }, { status: 500 })
    }
    
    const blob = await uploadToBlob(filepath, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    })

    return NextResponse.json({ url: blob.url, filepath: blob.pathname })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
