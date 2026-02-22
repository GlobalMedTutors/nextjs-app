import Stripe from 'stripe'
import { ENV } from '@/lib/config/env'
import { prisma } from '@/lib/db/prisma'

// Lazy initialization to avoid build-time error when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!ENV.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    _stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
    })
  }
  return _stripe
}

export const createPaymentIntent = async (
  instructorId: string,
  amount: number,
  studentId: string,
  transactionId?: string
) => {
  const metadata: Record<string, string> = { studentId, instructorId }
  if (transactionId) {
    metadata.transactionId = transactionId
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    metadata,
  })
  return paymentIntent.client_secret
}

export const createStripeAccountLink = async (instructorId?: string, stripeAccountId?: string | null) => {
  if (!instructorId) {
    return null
  }
  let createdStripeAccountId = stripeAccountId
  if (!createdStripeAccountId) {
    const account = await getStripe().accounts.create({
      controller: {
        stripe_dashboard: {
          type: 'express',
        },
        fees: {
          payer: 'application',
        },
        losses: {
          payments: 'application',
        },
      },
    })
    createdStripeAccountId = account.id

    await prisma.instructor.update({
      where: { id: instructorId },
      data: { stripeAccountId: createdStripeAccountId },
    })
  }

  const accountLink = await getStripe().accountLinks.create({
    account: createdStripeAccountId,
    refresh_url: `${ENV.INSTRUCTOR_URL}/onboarding`,
    return_url: `${ENV.INSTRUCTOR_URL}/onboarding`,
    type: 'account_onboarding',
  })

  return accountLink.url
}
