import { LessonStatus } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import { createZoomMeeting } from './zoom'

export interface CreateLessonInput {
  startTime: Date
  endTime: Date
}

const createLessonName = (
  instructorFirstName: string,
  instructorLastName: string,
  studentFirstName: string,
  studentLastName: string,
  subjectName?: string
) =>
  subjectName
    ? `${instructorFirstName} ${instructorLastName} & ${studentFirstName} ${studentLastName} ${subjectName} Tutoring`
    : `${instructorFirstName} ${instructorLastName} & ${studentFirstName} ${studentLastName} Tutoring`

export async function createLessonData(
  studentUser: any,
  instructorId: string,
  subjectId: string,
  createLessonInputs: CreateLessonInput[],
  conflicts: any[]
) {
  const student = studentUser.student
  if (!student) {
    return null
  }
  
  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    include: { user: true },
  })

  if (!instructor) {
    return null
  }

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } })
  const lessonName = createLessonName(
    instructor.user.firstName,
    instructor.user.lastName,
    studentUser.firstName,
    studentUser.lastName,
    subject?.name
  )

  // Filter out lessons that have conflicts
  const nonConflictingLessons = createLessonInputs.filter(
    (newLesson) =>
      !conflicts.some((conflict) => newLesson.startTime < conflict.endTime && newLesson.endTime > conflict.startTime)
  )

  return await Promise.all(
    nonConflictingLessons.map(async (i) => {
      const zoomMeeting = await createZoomMeeting(
        lessonName,
        i.startTime,
        i.endTime,
        instructor.user.email,
        studentUser.email
      )
      return {
        ...i,
        name: lessonName,
        instructorId,
        studentId: student.id,
        videoLink: zoomMeeting.join_url,
        subjectId,
      }
    })
  )
}

export async function createLessonConflicts(
  studentUser: any,
  createLessonInputs: CreateLessonInput[]
): Promise<any[]> {
  if (createLessonInputs.length === 0 || studentUser.student?.id == null) {
    return []
  }
  return await prisma.lesson.findMany({
    where: {
      studentId: studentUser.student.id,
      OR: createLessonInputs.map((lesson) => ({
        OR: [
          { startTime: { lte: lesson.startTime }, endTime: { gt: lesson.startTime } },
          { startTime: { lt: lesson.endTime }, endTime: { gte: lesson.endTime } },
          { startTime: { gte: lesson.startTime }, endTime: { lte: lesson.endTime } },
          { startTime: { lte: lesson.startTime }, endTime: { gte: lesson.endTime } },
        ],
      })),
    },
  })
}

export async function findLessonById(id: string) {
  return await prisma.lesson.findUnique({
    where: { id },
    include: { student: { include: { user: true } }, instructor: { include: { user: true } }, subject: true },
  })
}

export async function findLessonsByInstructorId(instructorId: string) {
  return await prisma.lesson.findMany({
    where: { instructorId },
    orderBy: { startTime: 'asc' },
    include: { student: { include: { user: true } }, subject: true },
  })
}

export async function findLessonsByStudentId(studentId?: string) {
  if (!studentId) {
    return null
  }
  return await prisma.lesson.findMany({
    where: { studentId },
    orderBy: { startTime: 'asc' },
    include: { instructor: { include: { user: true } }, subject: true },
  })
}

export async function findUpcomingLessonsByStudentId(studentId?: string) {
  if (!studentId) {
    return null
  }
  return await prisma.lesson.findMany({
    where: {
      studentId,
      status: { notIn: [LessonStatus.CANCELED, LessonStatus.COMPLETED] },
      endTime: { gte: new Date() },
    },
    orderBy: { startTime: 'asc' },
    include: { instructor: { include: { user: true } }, subject: true },
  })
}

export async function updateLessonStatus(user: any, id: string, status: LessonStatus) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { student: true, instructor: true },
  })
  if (!lesson || (lesson.studentId !== user.student?.id && lesson.instructorId !== user.instructor?.id)) {
    return null
  }
  return await prisma.lesson.update({
    where: { id },
    data: { status },
  })
}
