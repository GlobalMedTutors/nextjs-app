import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { createPaymentIntent } from '@/lib/services/stripe'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user.student) {
      return NextResponse.json({ error: 'Only students can create payment intents' }, { status: 403 })
    }

    const body = await request.json()
    const { instructorId, amount } = body

    if (!instructorId || !amount) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const clientSecret = await createPaymentIntent(instructorId, amount, user.student.id)
    return NextResponse.json({ clientSecret })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
