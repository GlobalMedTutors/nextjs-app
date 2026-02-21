import Stripe from 'stripe'
import { ENV } from '@/lib/config/env'
import { prisma } from '@/lib/db/prisma'

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
})

export const createPaymentIntent = async (instructorId: string, amount: number, studentId: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    metadata: { studentId, instructorId },
  })
  return paymentIntent.client_secret
}

export const createStripeAccountLink = async (instructorId?: string, stripeAccountId?: string | null) => {
  if (!instructorId) {
    return null
  }
  let createdStripeAccountId = stripeAccountId
  if (!createdStripeAccountId) {
    const account = await stripe.accounts.create({
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

  const accountLink = await stripe.accountLinks.create({
    account: createdStripeAccountId,
    refresh_url: `${ENV.INSTRUCTOR_URL}/onboarding`,
    return_url: `${ENV.INSTRUCTOR_URL}/onboarding`,
    type: 'account_onboarding',
  })

  return accountLink.url
}
