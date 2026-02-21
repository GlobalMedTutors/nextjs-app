import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'

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

    // Dynamic import to avoid build-time initialization
    const { put } = await import('@vercel/blob')
    const blob = await put(filepath, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url: blob.url, filepath: blob.pathname })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
