import { prisma } from '@/lib/db/prisma'

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      instructor: true,
      student: true,
    },
  })
}

export async function findUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      instructor: true,
      student: true,
    },
  })
}

export async function updateUser(
  id: string,
  data: {
    email?: string
    firstName?: string
    lastName?: string
    username?: string
  }
) {
  return await prisma.user.update({
    where: { id },
    data,
  })
}
