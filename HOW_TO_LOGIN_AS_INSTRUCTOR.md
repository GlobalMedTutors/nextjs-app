# How to Log In as an Instructor

## Quick Steps

1. **Sign in with Google**
   - Go to: https://global-med-tutors.vercel.app/sign-in
   - Click "Sign in with Google"
   - Complete Google authentication

2. **Choose Your Role**
   - After signing in, you'll see a "Choose Your Role" page
   - Click **"I'm an Instructor"**

3. **Complete Instructor Onboarding**
   - **Step 1:** Enter your first name, last name, and username
   - **Step 2:** Enter your bio, rate per hour, and select subjects you teach
   - **Step 3:** Review and complete setup

4. **You're Done!**
   - You'll be redirected to `/instructor` dashboard
   - You can now add availability, view messages, and manage your profile

## Detailed Instructions

### Step 1: Sign In

1. Visit the app: https://global-med-tutors.vercel.app
2. You'll be redirected to `/sign-in` if not authenticated
3. Click the "Sign in with Google" button
4. Select your Google account and authorize the app

### Step 2: Select Instructor Role

After signing in:
- If you're a new user, you'll see a "Choose Your Role" page
- Click the **"I'm an Instructor"** button
- This will take you to `/instructor/onboarding`

### Step 3: Complete Onboarding

The instructor onboarding has 3 steps:

#### Step 1: Basic Information
- **First Name** (required)
- **Last Name** (required)
- **Username** (required, must be unique)

Click "Next" to proceed.

#### Step 2: Instructor Details
- **Bio** (required) - Describe your teaching experience
- **Rate per Hour** (required) - Your hourly rate in dollars (e.g., 50.00)
- **Subjects** (required) - Select at least one subject you teach

Click "Next" to proceed.

#### Step 3: Complete Setup
- Review your information
- Click "Complete Setup"

### Step 4: Access Instructor Dashboard

After completing onboarding, you'll be redirected to `/instructor` where you can:
- View your profile
- Set availability (`/instructor/availability`)
- View messages (`/instructor/inbox`)
- Manage your profile (`/instructor/profile`)

## Troubleshooting

### "Access Denied" Error
- Make sure you've completed the onboarding process
- Check that your user account was created successfully
- Try signing out and signing back in

### Can't See Instructor Dashboard
- Make sure you selected "I'm an Instructor" on the role selection page
- Verify you completed all onboarding steps
- Check that you have an instructor record in the database

### Subjects Not Loading
- Make sure subjects exist in the database
- Check the `/api/subjects` endpoint
- Subjects need to be seeded in the database first

## Next Steps After Onboarding

1. **Set Your Availability**
   - Go to `/instructor/availability`
   - Add your available time slots

2. **Set Up Stripe (for payments)**
   - Go to `/instructor/profile`
   - Connect your Stripe account

3. **Add Profile Picture**
   - Go to `/instructor/profile`
   - Upload an avatar and cover image

## Notes

- You can only be either an instructor OR a student (not both)
- If you need to switch roles, you'll need to delete your current role record from the database
- The onboarding process creates:
  - An `Instructor` record linked to your `User`
  - An `InstructorProfilePage` record with your bio
  - Links to selected `Subject` records
