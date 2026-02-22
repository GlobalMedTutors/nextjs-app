import { getServerSession } from 'next-auth'
import { authOptions } from './config'
import { prisma } from '@/lib/db/prisma'
import type { User, Instructor, Student } from '@prisma/client'

export type UserWithRelations = User & {
  instructor: Instructor | null
  student: Student | null
}

export async function getCurrentUser(): Promise<UserWithRelations | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: {
      instructor: true,
      student: true,
    },
  })

  return user as UserWithRelations | null
}

export async function requireAuth(): Promise<UserWithRelations> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
