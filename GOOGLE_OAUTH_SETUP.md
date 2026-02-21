# Google OAuth Setup Instructions

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one
   - Name it: `Global Med Tutors` (or any name you prefer)
   - Click "Create" if creating new

3. **Enable Google+ API**
   - In the left sidebar, go to **APIs & Services** → **Library**
   - Search for "Google+ API" or "People API"
   - Click on it and click **Enable**

4. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** (unless you have a Google Workspace)
   - Click **Create**
   - Fill in:
     - **App name**: `Global Med Tutors`
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click **Save and Continue**
   - On **Scopes** page, click **Save and Continue** (default scopes are fine)
   - On **Test users** page, click **Save and Continue** (skip for now)
   - Click **Back to Dashboard**

5. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **+ Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `Global Med Tutors Web Client`
   - **Authorized JavaScript origins**:
     ```
     https://global-med-tutors.vercel.app
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     https://global-med-tutors.vercel.app/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **Create**
   - **IMPORTANT**: Copy the **Client ID** and **Client Secret** immediately
     - You won't be able to see the secret again!

## Step 2: Set Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `nextjs-app`

2. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Click **Add New**

3. **Add Google OAuth Variables**
   
   **Variable 1:**
   - Name: `GOOGLE_CLIENT_ID`
   - Value: [Paste your Client ID from Google]
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **Save**

   **Variable 2:**
   - Name: `GOOGLE_CLIENT_SECRET`
   - Value: [Paste your Client Secret from Google]
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **Save**

## Step 3: Test Locally (Optional)

1. **Create `.env.local` file** in `nextjs-app` directory:
   ```bash
   cd /Users/naveen/global-med-tutors/nextjs-app
   ```

2. **Add to `.env.local`**:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=+0hIgTtfg7rIRQ1LtZob5TUYkIewwAjx7Z4fDOxWVVw=
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Test sign-in**:
   - Visit: http://localhost:3000/sign-in
   - Click "Sign in with Google"
   - Should redirect to Google sign-in

## Step 4: Deploy to Vercel

After setting environment variables in Vercel:
- Push to GitHub (already done)
- Vercel will auto-deploy
- Or manually deploy: `vercel --prod`

## Step 5: Verify Production

1. Visit: https://global-med-tutors.vercel.app/sign-in
2. Click "Sign in with Google"
3. Should redirect to Google and then back to your app

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Console exactly matches:
  - `https://global-med-tutors.vercel.app/api/auth/callback/google`

**Error: "access_denied"**
- Make sure OAuth consent screen is configured
- Add test users if app is in testing mode

**Users not being created**
- Check Vercel function logs
- Verify DATABASE_URL is set correctly
- Check Prisma migrations ran

## Quick Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs added to Google (production + localhost)
- [ ] Client ID and Secret copied
- [ ] Environment variables set in Vercel
- [ ] Tested locally (optional)
- [ ] Deployed to Vercel
- [ ] Tested production sign-in

That's it! Once these are set, Google OAuth will work. 🎉
