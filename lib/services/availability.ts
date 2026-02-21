import { prisma } from '@/lib/db/prisma'

export interface AvailabilityInput {
  dayOfWeek: number
  startTime: Date
  endTime: Date
}

export async function findAvailabilityByInstructorId(instructorId: string) {
  return await prisma.availability.findMany({
    where: { instructorId },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })
}

export async function upsertAvailability(instructorId: string, availabilities: AvailabilityInput[]) {
  // Delete existing availability
  await prisma.availability.deleteMany({
    where: { instructorId },
  })

  // Create new availability
  if (availabilities.length > 0) {
    return await prisma.availability.createMany({
      data: availabilities.map((av) => ({
        instructorId,
        dayOfWeek: av.dayOfWeek,
        startTime: av.startTime,
        endTime: av.endTime,
      })),
    })
  }

  return { count: 0 }
}
