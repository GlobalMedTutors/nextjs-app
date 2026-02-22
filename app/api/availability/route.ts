import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { findAvailabilityByInstructorId, upsertAvailability } from '@/lib/services/availability'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const paramInstructorId = searchParams.get('instructorId')
    
    // Type-safe way to get instructor ID
    let instructorId: string | null = paramInstructorId
    if (!instructorId && user.instructor) {
      instructorId = user.instructor.id
    }

    if (!instructorId) {
      return NextResponse.json({ error: 'Instructor ID required' }, { status: 400 })
    }

    const availability = await findAvailabilityByInstructorId(instructorId)
    return NextResponse.json(availability)
  } catch (error: any) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user.instructor) {
      return NextResponse.json({ error: 'Only instructors can set availability' }, { status: 403 })
    }

    const body = await request.json()
    const { availabilities } = body

    if (!Array.isArray(availabilities)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const result = await upsertAvailability(user.instructor.id, availabilities)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
