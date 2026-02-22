# End-to-End Flow Status

## ✅ Implemented Features

### 1. Instructor Onboarding & Setup
- ✅ **Sign up/Login**: Google OAuth authentication
- ✅ **Set Rate**: During onboarding (`ratePerHour`)
- ✅ **Set Subjects/Courses**: During onboarding (select multiple subjects)
- ✅ **Set Availability**: 
  - View availability: `/instructor/availability`
  - Update availability: `/instructor/availability/update`
  - API: `POST /api/availability`

### 2. Student Discovery & Booking
- ✅ **Search Instructors**: `/student/search` - Search by subject
- ✅ **View Instructor Profile**: `/student/instructor/[username]`
- ✅ **View Availability**: `/student/schedule/[username]` - Shows available time slots
- ✅ **Book Lesson**: 
  - Select date, time, duration
  - API: `POST /api/lessons`
  - Creates lesson with Zoom video link

### 3. Payment System
- ✅ **Stripe Integration**: 
  - Payment intent API: `POST /api/payments/intent`
  - Webhook handler: `POST /api/webhooks/stripe`
  - Payment page: `/student/payment`
- ⚠️ **Credit System**: 
  - Credits are deducted when booking lessons
  - Credit balance API: `GET /api/credits`
  - **ISSUE**: No clear flow for students to purchase credits before booking

### 4. Video Conferencing
- ✅ **Zoom Integration**: 
  - Service: `lib/services/zoom.ts`
  - Creates Zoom meeting when lesson is created
  - Video link stored in `lesson.videoLink`
  - Students can join via "Join Meeting" button in `/student/lessons`
- ⚠️ **Requires**: Zoom API credentials (ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_ACCOUNT_ID)

### 5. Lesson Management
- ✅ **View Lessons**: `/student/lessons` - Shows all student lessons
- ✅ **Lesson Status**: PENDING, CONFIRMED, COMPLETED, CANCELED
- ✅ **Video Link**: Displayed when lesson is CONFIRMED

## ⚠️ Missing/Incomplete Features

### 1. Credit Purchase Flow
**Problem**: Students need credits to book lessons, but there's no clear way to purchase them.

**Current Flow**:
1. Student books lesson → Credits are deducted
2. If insufficient credits → Error (not handled gracefully)

**What's Missing**:
- UI to check credit balance before booking
- Purchase credits page/flow
- Integration with payment page to buy credits
- Credit purchase should happen BEFORE booking, not after

**Files to Check**:
- `/app/student/payment/page.tsx` - Exists but not integrated into booking flow
- `/app/api/payments/intent/route.ts` - Creates payment intent but unclear how it's used

### 2. Instructor Subject Updates
**Problem**: Instructors can only set subjects during onboarding.

**What's Missing**:
- Ability to add/remove subjects after onboarding
- Update subjects in instructor profile

### 3. Booking Flow Integration
**Problem**: The booking flow doesn't check for credits or redirect to purchase.

**Current Flow**:
```
Student selects time → Books lesson → Credits deducted → Lesson created
```

**Should Be**:
```
Student selects time → Check credits → If insufficient, redirect to purchase → After purchase, book lesson
```

### 4. Zoom Credentials
**Problem**: Zoom integration exists but needs API credentials.

**Required Environment Variables**:
- `ZOOM_CLIENT_ID`
- `ZOOM_CLIENT_SECRET`
- `ZOOM_ACCOUNT_ID`

**Status**: Code is ready, needs credentials in Vercel.

## 🔧 What Needs to Be Fixed

### Priority 1: Credit Purchase Flow
1. **Add credit balance check before booking**
   - In `/app/student/schedule/[username]/page.tsx`
   - Check credits before allowing booking
   - Show credit balance in UI

2. **Create credit purchase flow**
   - Add "Purchase Credits" button/link
   - Calculate required credits based on lesson duration and rate
   - Redirect to payment page with correct amount
   - After payment, redirect back to booking

3. **Update booking API**
   - Check credits before creating lesson
   - Return clear error if insufficient credits
   - Provide link/redirect to purchase credits

### Priority 2: Instructor Subject Management
1. **Add subject management to instructor profile**
   - Allow adding/removing subjects
   - Update API endpoint to handle subject changes

### Priority 3: Error Handling
1. **Better error messages**
   - "Insufficient credits" with link to purchase
   - "No availability" messages
   - Payment failure handling

## 📋 Complete Flow (What Should Happen)

### Instructor Flow:
1. ✅ Sign up with Google
2. ✅ Complete onboarding (name, username, bio, rate, subjects)
3. ✅ Set availability schedule
4. ✅ (Optional) Connect Stripe account for payouts
5. ✅ Wait for bookings

### Student Flow (Current):
1. ✅ Sign up with Google
2. ✅ Complete student onboarding
3. ✅ Search for instructors by subject
4. ✅ View instructor profile
5. ✅ View availability
6. ✅ Select date/time and book lesson
7. ⚠️ **Credits deducted** (but no way to purchase)
8. ✅ Lesson created with Zoom link
9. ✅ Join meeting when lesson is confirmed

### Student Flow (Should Be):
1. ✅ Sign up with Google
2. ✅ Complete student onboarding
3. ✅ Search for instructors by subject
4. ✅ View instructor profile
5. ✅ View availability
6. ✅ Select date/time
7. **NEW**: Check credit balance
8. **NEW**: If insufficient, purchase credits via Stripe
9. ✅ Book lesson (credits deducted)
10. ✅ Lesson created with Zoom link
11. ✅ Join meeting when lesson is confirmed

## 🎯 Next Steps

1. **Implement credit purchase flow** (highest priority)
2. **Add credit balance display** in booking UI
3. **Add subject management** for instructors
4. **Set up Zoom credentials** in Vercel
5. **Test end-to-end flow** with real accounts

## 📝 Files That Need Updates

1. `/app/student/schedule/[username]/page.tsx` - Add credit check
2. `/app/student/payment/page.tsx` - Integrate with booking flow
3. `/app/api/lessons/route.ts` - Better error handling for credits
4. `/app/instructor/profile/page.tsx` - Add subject management
5. `/app/api/instructors/route.ts` - Add PUT endpoint for updating subjects
