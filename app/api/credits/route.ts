import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const instructorId = searchParams.get('instructorId')

    if (!instructorId) {
      return NextResponse.json({ error: 'Instructor ID required' }, { status: 400 })
    }

    // Try to get current user (optional - allows viewing credit requirements without login)
    const user = await getCurrentUser()

    // If user is authenticated and is a student, return their credit balance
    if (user?.student) {
      const credit = await prisma.credit.findUnique({
        where: {
          studentId_instructorId: {
            studentId: user.student.id,
            instructorId,
          },
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      return NextResponse.json(credit || { balance: 0, transactions: [] })
    }

    // If not authenticated or not a student, return default balance of 0
    // This allows the UI to show credit requirements even if user isn't logged in
    return NextResponse.json({ balance: 0, transactions: [] })
  } catch (error: any) {
    console.error('Error fetching credits:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
