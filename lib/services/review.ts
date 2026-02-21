import { prisma } from '@/lib/db/prisma'

export interface CreateReviewInput {
  instructorId: string
  overallRating: number
  comment?: string
  subRatings?: Array<{
    category: string
    rating: number
    comment?: string
  }>
}

export async function createReview(studentId: string, input: CreateReviewInput) {
  const review = await prisma.review.create({
    data: {
      studentId,
      instructorId: input.instructorId,
      overallRating: input.overallRating,
      comment: input.comment,
      subRatings: {
        create: input.subRatings || [],
      },
    },
    include: {
      subRatings: true,
    },
  })

  return review
}

export async function findReviewsByInstructorId(instructorId: string) {
  return await prisma.review.findMany({
    where: { instructorId },
    include: {
      student: { include: { user: true } },
      subRatings: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function findReviewByStudentAndInstructor(studentId: string, instructorId: string) {
  return await prisma.review.findFirst({
    where: {
      studentId,
      instructorId,
    },
    include: {
      subRatings: true,
    },
  })
}
