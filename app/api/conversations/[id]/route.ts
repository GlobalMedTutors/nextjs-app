import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { findConversationByParticipants } from '@/lib/services/conversation'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        student: { include: { user: true } },
        instructor: { include: { user: true } },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Check authorization
    if (
      (user.student && conversation.studentId !== user.student.id) ||
      (user.instructor && conversation.instructorId !== user.instructor.id)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(conversation)
  } catch (error: any) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
