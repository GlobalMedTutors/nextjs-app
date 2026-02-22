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
  
  if (!user?.instructor) {
    return null
  }
  
  // Return instructor with user relation included
  return {
    ...user.instructor,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    },
  }
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
      // Removed stripeAccountId requirement - instructors can be searchable before Stripe setup
      // Stripe setup can be done later when they receive their first booking
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

export async function upsertInstructor(
  userId: string,
  data: {
    bio?: string
    ratePerHour?: number
    subjects?: string[]
  }
) {
  return await prisma.instructor.upsert({
    where: { userId },
    update: {
      ratePerHour: data.ratePerHour ? data.ratePerHour : undefined,
      subjects: data.subjects
        ? {
            set: data.subjects.map((id) => ({ id })),
          }
        : undefined,
      profilePage: {
        upsert: {
          create: {
            bio: data.bio,
          },
          update: {
            bio: data.bio || undefined,
          },
        },
      },
    },
    create: {
      userId,
      ratePerHour: data.ratePerHour,
      subjects: data.subjects
        ? {
            connect: data.subjects.map((id) => ({ id })),
          }
        : undefined,
      profilePage: {
        create: {
          bio: data.bio,
        },
      },
    },
    include: {
      user: true,
      profilePage: true,
      subjects: true,
    },
  })
}
