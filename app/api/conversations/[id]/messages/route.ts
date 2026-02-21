import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { createMessage, markMessagesAsRead } from '@/lib/services/conversation'
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
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: true,
          },
        },
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

    // Mark messages as read
    await markMessagesAsRead(params.id, user.id)

    return NextResponse.json(conversation.messages)
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { content, media } = body

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
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

    const message = await createMessage(params.id, user.id, content, media)
    return NextResponse.json(message)
  } catch (error: any) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
