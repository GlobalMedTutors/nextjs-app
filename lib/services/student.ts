import { prisma } from '@/lib/db/prisma'

export async function findStudentById(id: string | null) {
  if (!id) return null
  return await prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      profilePage: true,
    },
  })
}

export async function findStudentByUserId(userId: string) {
  return await prisma.student.findUnique({
    where: { userId },
    include: {
      user: true,
      profilePage: true,
    },
  })
}

export async function upsertStudent(
  userId: string,
  data?: {
    bio?: string
  }
) {
  return await prisma.student.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      profilePage: data?.bio
        ? {
            create: {
              bio: data.bio,
            },
          }
        : undefined,
    },
    include: {
      user: true,
      profilePage: true,
    },
  })
}
