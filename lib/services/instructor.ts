import { prisma } from '@/lib/db/prisma'

export async function findInstructorById(id: string | null) {
  if (!id) return null
  return await prisma.instructor.findUnique({
    where: { id },
    include: {
      user: true,
      profilePage: true,
      subjects: true,
      availability: true,
    },
  })
}

export async function findInstructorByUserId(userId: string) {
  return await prisma.instructor.findUnique({
    where: { userId },
    include: {
      user: true,
      profilePage: true,
      subjects: true,
      availability: true,
    },
  })
}

export async function findInstructorByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      instructor: {
        include: {
          profilePage: true,
          subjects: true,
          availability: true,
        },
      },
    },
  })
  return user?.instructor
}

export async function searchInstructors(subjectId: string, offset: number = 0, limit: number = 5) {
  return await prisma.instructor.findMany({
    where: {
      subjects: {
        some: {
          id: subjectId,
        },
      },
      ratePerHour: { not: null },
      stripeAccountId: { not: null },
    },
    include: {
      user: true,
      profilePage: true,
      subjects: true,
    },
    orderBy: {
      ratePerHour: 'desc',
    },
    skip: offset,
    take: limit,
  })
}
