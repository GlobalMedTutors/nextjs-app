import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import {
  findConversationsByStudentId,
  findConversationsByInstructorId,
  createConversation,
} from '@/lib/services/conversation'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const instructorId = searchParams.get('instructorId')

    if (user.student) {
      const conversations = await findConversationsByStudentId(user.student.id)
      return NextResponse.json(conversations)
    }

    if (user.instructor) {
      const conversations = await findConversationsByInstructorId(user.instructor.id)
      return NextResponse.json(conversations)
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error: any) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { studentId, instructorId } = body

    if (!studentId || !instructorId) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Only students can initiate conversations
    if (!user.student || user.student.id !== studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const conversation = await createConversation(studentId, instructorId)
    return NextResponse.json(conversation)
  } catch (error: any) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
