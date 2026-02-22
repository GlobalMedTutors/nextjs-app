import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-session'
import { createPaymentIntent } from '@/lib/services/stripe'
import { initializeTransaction } from '@/lib/services/credit'
import { TransactionType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user.student) {
      return NextResponse.json({ error: 'Only students can create payment intents' }, { status: 403 })
    }

    const body = await request.json()
    const { instructorId, amount, credits } = body

    if (!instructorId || !amount) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Calculate credits if not provided (1 credit per hour, rounded up)
    const creditsToPurchase = credits || Math.ceil(amount)

    // Create transaction record
    const transaction = await initializeTransaction(
      instructorId,
      user.student.id,
      amount,
      creditsToPurchase,
      TransactionType.CREDIT
    )

    // Create payment intent with transaction ID in metadata
    const clientSecret = await createPaymentIntent(
      instructorId,
      amount,
      user.student.id,
      transaction.id
    )

    return NextResponse.json({ clientSecret, transactionId: transaction.id })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
