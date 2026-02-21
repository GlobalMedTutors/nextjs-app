import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const instructorId = searchParams.get('instructorId')

    if (!user.student) {
      return NextResponse.json({ error: 'Only students can view credits' }, { status: 403 })
    }

    if (!instructorId) {
      return NextResponse.json({ error: 'Instructor ID required' }, { status: 400 })
    }

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
  } catch (error: any) {
    console.error('Error fetching credits:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
