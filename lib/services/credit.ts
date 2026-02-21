import { PaymentStatus, TransactionType } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'

export async function initializeTransaction(
  instructorId: string,
  studentId: string,
  money: number,
  credits: number,
  type: TransactionType
) {
  const credit = await prisma.credit.upsert({
    where: { studentId_instructorId: { studentId, instructorId } },
    create: {
      studentId,
      instructorId,
    },
    update: {},
  })

  return await prisma.transaction.create({
    data: {
      creditId: credit.id,
      money,
      credits,
      type,
    },
  })
}

export async function purchaseCredits(
  transactionId: string,
  instructorId: string,
  credits: number,
  stripePaymentId: string,
  studentId?: string
) {
  if (!studentId) {
    return null
  }

  const credit = await prisma.credit.update({
    where: { studentId_instructorId: { studentId, instructorId } },
    data: {
      balance: { increment: credits },
    },
  })

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      stripePaymentId,
      paymentStatus: PaymentStatus.COMPLETED,
    },
  })
  
  return credit
}

export async function deductCredits(instructorId: string, studentId: string, amount: number) {
  const currentBalance = await prisma.credit.findUnique({
    where: { studentId_instructorId: { studentId, instructorId } },
  })

  if (!currentBalance || currentBalance.balance < amount) {
    throw new Error('Insufficient credits.')
  }

  return await prisma.credit.update({
    where: { studentId_instructorId: { studentId, instructorId } },
    data: { balance: { decrement: amount } },
  })
}
