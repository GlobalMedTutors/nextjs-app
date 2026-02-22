# Credit Purchase Flow - Implementation Complete ✅

## Overview

The complete end-to-end flow for purchasing credits and booking lessons is now implemented. Students can now:
1. View their credit balance when booking lessons
2. Purchase credits if they don't have enough
3. Complete payment via Stripe
4. Return to booking after purchase
5. Book lessons with credits

## Flow Diagram

```
Student selects lesson time
    ↓
Check credit balance
    ↓
┌─────────────────────────┐
│ Has enough credits?     │
└─────────────────────────┘
    ↓ NO                    ↓ YES
Redirect to purchase      Book lesson
    ↓                       ↓
Purchase credits          Lesson created
    ↓                       ↓
Payment via Stripe        Zoom link generated
    ↓                       ↓
Credits added             Student can join
    ↓
Return to booking
    ↓
Book lesson
```

## Implementation Details

### 1. Credit Balance Display (`/student/schedule/[username]`)

**Features:**
- Shows current credit balance
- Displays required credits for selected lesson
- Warns if insufficient credits
- Calculates cost based on instructor rate and duration

**Code Location:** `app/student/schedule/[username]/page.tsx`

### 2. Credit Purchase Page (`/student/purchase-credits`)

**Features:**
- Shows credits to purchase and amount
- Stripe payment form integration
- Success/error handling
- Redirects back to booking after purchase

**Code Location:** `app/student/purchase-credits/page.tsx`

**URL Parameters:**
- `instructorId` - Instructor ID
- `amount` - Cost in dollars
- `credits` - Number of credits to purchase
- `returnTo` - URL to redirect after purchase

### 3. Payment Intent API (`/api/payments/intent`)

**Features:**
- Creates Stripe payment intent
- Initializes transaction record
- Links transaction to payment intent via metadata

**Code Location:** `app/api/payments/intent/route.ts`

### 4. Stripe Webhook (`/api/webhooks/stripe`)

**Features:**
- Processes `payment_intent.succeeded` events
- Finds transaction by ID from metadata
- Adds credits to student account
- Updates transaction status

**Code Location:** `app/api/webhooks/stripe/route.ts`

### 5. Booking API (`/api/lessons`)

**Features:**
- Checks for scheduling conflicts
- Validates credit balance (throws error if insufficient)
- Creates lesson with Zoom link
- Deducts credits after successful booking

**Code Location:** `app/api/lessons/route.ts`

## Credit System

### Credit Calculation
- **1 credit = 1 hour of lesson time**
- Credits are rounded up (e.g., 30 min = 1 credit, 90 min = 2 credits)
- Cost = Instructor rate × (duration in hours)

### Credit Balance
- Each student-instructor pair has a separate credit balance
- Credits are purchased per instructor
- Credits cannot be transferred between instructors

## User Experience

### Booking Flow

1. **Student views instructor availability**
   - Sees instructor rate and available time slots
   - Selects date, time, and duration

2. **Credit check**
   - System displays current balance
   - Shows required credits
   - Warns if insufficient

3. **If insufficient credits:**
   - Alert dialog asks if student wants to purchase
   - Redirects to purchase page with pre-filled amount
   - After purchase, returns to booking page with selections preserved

4. **If sufficient credits:**
   - Lesson is booked immediately
   - Credits are deducted
   - Zoom link is generated
   - Student can join when lesson is confirmed

### Purchase Flow

1. **Student clicks "Purchase Credits"**
   - Redirected to `/student/purchase-credits`
   - Sees amount and credits to purchase

2. **Payment**
   - Enters card details via Stripe
   - Payment processed

3. **After payment**
   - Success message shown
   - Credits added to account (via webhook)
   - Redirected back to booking page
   - Previous selections (date/time/duration) are restored

## Error Handling

### Insufficient Credits
- **Before booking:** Warning shown, option to purchase
- **During booking:** API throws error, redirects to purchase
- **After purchase:** Balance refreshed, booking can proceed

### Payment Failures
- Error message displayed
- User can retry payment
- No credits added if payment fails

### Webhook Failures
- Transaction remains in PENDING status
- Can be manually processed if needed
- Logs errors for debugging

## Testing Checklist

- [ ] Student with 0 credits tries to book → Redirects to purchase
- [ ] Student with insufficient credits → Warning shown, can purchase
- [ ] Student with enough credits → Books successfully
- [ ] Purchase credits → Balance updates
- [ ] Return to booking after purchase → Selections preserved
- [ ] Payment success → Credits added
- [ ] Payment failure → Error shown, no credits added
- [ ] Webhook processes payment → Credits added correctly

## Environment Variables Required

- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (for frontend)

## Next Steps (Optional Enhancements)

1. **Credit History**
   - Show transaction history
   - Display credit usage

2. **Credit Packages**
   - Offer bulk credit discounts
   - Pre-defined packages (e.g., 10 credits for $90)

3. **Auto-purchase**
   - Option to auto-purchase credits when balance is low
   - Save payment method for future purchases

4. **Refunds**
   - Handle lesson cancellations
   - Refund credits or process refunds
