import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { upsertStudent } from '@/lib/services/student'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { bio } = body

    const student = await upsertStudent(user.id, { bio })

    return NextResponse.json(student)
  } catch (error: any) {
    console.error('Error creating/updating student:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
