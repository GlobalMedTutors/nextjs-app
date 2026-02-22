import { getServerSession } from 'next-auth'
import { authOptions } from './config'
import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    instructor: true
    student: true
  }
}>

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

  return user
}

export async function requireAuth(): Promise<UserWithRelations> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
