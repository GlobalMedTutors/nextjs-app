import { prisma } from '@/lib/db/prisma'

export async function findConversationByParticipants(studentId: string, instructorId: string) {
  return await prisma.conversation.findUnique({
    where: {
      studentId_instructorId: {
        studentId,
        instructorId,
      },
    },
    include: {
      student: { include: { user: true } },
      instructor: { include: { user: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function findConversationsByStudentId(studentId: string) {
  return await prisma.conversation.findMany({
    where: { studentId },
    include: {
      instructor: { include: { user: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function findConversationsByInstructorId(instructorId: string) {
  return await prisma.conversation.findMany({
    where: { instructorId },
    include: {
      student: { include: { user: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function createConversation(studentId: string, instructorId: string) {
  return await prisma.conversation.upsert({
    where: {
      studentId_instructorId: {
        studentId,
        instructorId,
      },
    },
    create: {
      studentId,
      instructorId,
    },
    update: {},
    include: {
      student: { include: { user: true } },
      instructor: { include: { user: true } },
    },
  })
}

export async function createMessage(
  conversationId: string,
  senderId: string,
  content?: string,
  media?: string
) {
  return await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
      media,
    },
    include: {
      sender: true,
    },
  })
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  return await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  })
}
