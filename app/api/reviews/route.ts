import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { createReview, findReviewsByInstructorId } from '@/lib/services/review'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const instructorId = searchParams.get('instructorId')

    if (!instructorId) {
      return NextResponse.json({ error: 'Instructor ID required' }, { status: 400 })
    }

    const reviews = await findReviewsByInstructorId(instructorId)
    return NextResponse.json(reviews)
  } catch (error: any) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user.student) {
      return NextResponse.json({ error: 'Only students can create reviews' }, { status: 403 })
    }

    const body = await request.json()
    const review = await createReview(user.student.id, body)

    return NextResponse.json(review)
  } catch (error: any) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
