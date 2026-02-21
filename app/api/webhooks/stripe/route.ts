import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/services/stripe'
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
    event = stripe.webhooks.constructEvent(body, signature, ENV.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any
      const { studentId, instructorId } = paymentIntent.metadata

      // Find the transaction
      const transaction = await prisma.transaction.findFirst({
        where: {
          credit: {
            studentId,
            instructorId,
          },
          paymentStatus: 'PENDING',
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (transaction) {
        const credits = Math.floor(paymentIntent.amount / 100) // Assuming 1 credit = $1
        await purchaseCredits(
          transaction.id,
          instructorId,
          credits,
          paymentIntent.id,
          studentId
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const runtime = 'nodejs'
