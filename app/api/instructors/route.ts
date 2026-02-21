import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/get-session'
import { findInstructorByUsername, searchInstructors } from '@/lib/services/instructor'

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
