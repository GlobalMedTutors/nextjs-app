import { prisma } from '@/lib/db/prisma'

export async function getAllSubjects() {
  return await prisma.subject.findMany()
}

export async function findSubjectById(id: string) {
  return await prisma.subject.findUnique({
    where: { id },
    include: {
      instructors: {
        include: {
          user: true,
          profilePage: true,
        },
      },
    },
  })
}
