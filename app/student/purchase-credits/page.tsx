'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PaymentFormProps {
  amount: number
  instructorId: string
  credits: number
  onSuccess: () => void
}

function PaymentForm({ amount, instructorId, credits, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Create payment intent
      const res = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructorId,
          amount,
          credits,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const { clientSecret } = await res.json()

      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      )

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        // Wait a moment for webhook to process
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function PurchaseCreditsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const amount = parseFloat(searchParams.get('amount') || '0')
  const instructorId = searchParams.get('instructorId') || ''
  const credits = parseInt(searchParams.get('credits') || '0')
  const returnTo = searchParams.get('returnTo') || '/student'
  const [mounted, setMounted] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !amount || !instructorId || !credits) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Invalid purchase parameters</p>
      </div>
    )
  }

  const handleSuccess = () => {
    setPaymentSuccess(true)
    setTimeout(() => {
      router.push(returnTo)
    }, 2000)
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            {credits} credits have been added to your account.
          </p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Purchase Credits</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Credits to purchase:</p>
              <p className="text-sm font-semibold">{credits}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Amount:</p>
              <p className="text-2xl font-bold text-indigo-600">${amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
          <Elements stripe={stripePromise}>
            <PaymentForm amount={amount} instructorId={instructorId} credits={credits} onSuccess={handleSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  )
}
