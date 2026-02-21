import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import {
  findLessonsByInstructorId,
  findLessonsByStudentId,
  findUpcomingLessonsByStudentId,
  createLessonData,
  createLessonConflicts,
} from '@/lib/services/lesson'
import { prisma } from '@/lib/db/prisma'
import { deductCredits } from '@/lib/services/credit'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const instructorId = searchParams.get('instructorId')
    const studentId = searchParams.get('studentId')
    const upcoming = searchParams.get('upcoming') === 'true'

    if (instructorId) {
      const lessons = await findLessonsByInstructorId(instructorId)
      return NextResponse.json(lessons)
    }

    if (studentId || user.student) {
      const targetStudentId = studentId || user.student?.id
      if (upcoming) {
        const lessons = await findUpcomingLessonsByStudentId(targetStudentId)
        return NextResponse.json(lessons)
      }
      const lessons = await findLessonsByStudentId(targetStudentId)
      return NextResponse.json(lessons)
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error: any) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user.student) {
      return NextResponse.json({ error: 'Only students can create lessons' }, { status: 403 })
    }

    const body = await request.json()
    const { instructorId, subjectId, createLessonInputs } = body

    if (!instructorId || !subjectId || !createLessonInputs || !Array.isArray(createLessonInputs)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Check for conflicts
    const conflicts = await createLessonConflicts(user, createLessonInputs)

    // Create lesson data
    const data = await createLessonData(user, instructorId, subjectId, createLessonInputs, conflicts)
    if (!data) {
      return NextResponse.json({
        scheduled: [],
        conflicts,
      })
    }

    // Calculate required credits
    const requiredCredits = createLessonInputs.length - conflicts.length

    // Deduct credits before creating the lesson
    await deductCredits(instructorId, user.student.id, requiredCredits)

    // Create lessons
    const scheduled = await prisma.lesson.createManyAndReturn({
      data,
    })

    // Connect student to instructor
    await prisma.student.update({
      where: {
        id: user.student.id,
      },
      data: {
        instructors: {
          connect: {
            id: instructorId,
          },
        },
      },
    })

    return NextResponse.json({
      scheduled,
      conflicts,
    })
  } catch (error: any) {
    console.error('Error creating lessons:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
