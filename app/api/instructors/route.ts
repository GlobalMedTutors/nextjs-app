import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { findInstructorByUsername, searchInstructors, upsertInstructor } from '@/lib/services/instructor'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')
    const subjectId = searchParams.get('subjectId')
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (username) {
      const instructor = await findInstructorByUsername(username)
      if (!instructor) {
        return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
      }
      return NextResponse.json(instructor)
    }

    if (subjectId) {
      const instructors = await searchInstructors(subjectId, offset, limit)
      return NextResponse.json(instructors)
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error: any) {
    console.error('Error fetching instructors:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { bio, ratePerHour, subjects } = body

    if (!ratePerHour || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        { error: 'ratePerHour and subjects are required' },
        { status: 400 }
      )
    }

    const instructor = await upsertInstructor(user.id, {
      bio,
      ratePerHour: parseFloat(ratePerHour),
      subjects,
    })

    return NextResponse.json(instructor)
  } catch (error: any) {
    console.error('Error creating/updating instructor:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
