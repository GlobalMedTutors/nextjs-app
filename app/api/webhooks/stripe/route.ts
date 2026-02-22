import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/services/stripe'
import { ENV } from '@/lib/config/env'
import { purchaseCredits } from '@/lib/services/credit'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, ENV.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any
      const { studentId, instructorId, transactionId } = paymentIntent.metadata

      if (!studentId || !instructorId) {
        console.error('Missing metadata in payment intent:', paymentIntent.metadata)
        return NextResponse.json({ received: true }) // Don't fail webhook
      }

      let transaction
      if (transactionId) {
        // Use transaction ID if provided
        transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
          include: { credit: true },
        })
      } else {
        // Fallback: find most recent pending transaction
        transaction = await prisma.transaction.findFirst({
          where: {
            credit: {
              studentId,
              instructorId,
            },
            paymentStatus: 'PENDING',
          },
          include: { credit: true },
          orderBy: {
            createdAt: 'desc',
          },
        })
      }

      if (transaction && transaction.credit) {
        // Use credits from transaction, or calculate from amount
        const credits = transaction.credits || Math.floor(paymentIntent.amount / 100)
        await purchaseCredits(
          transaction.id,
          instructorId,
          credits,
          paymentIntent.id,
          studentId
        )
      } else {
        console.error('Transaction not found for payment intent:', paymentIntent.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const runtime = 'nodejs'
