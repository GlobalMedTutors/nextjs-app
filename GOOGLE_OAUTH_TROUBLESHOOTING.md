# Google OAuth "invalid_client" Error Fix

## Error: 401 invalid_client

This error means Google is rejecting your OAuth credentials. Here's how to fix it:

## Step 1: Verify Redirect URI in Google Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Check **Authorized redirect URIs** - it MUST include:
   ```
   https://global-med-tutors.vercel.app/api/auth/callback/google
   ```
6. Also add for local testing:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **Save**

## Step 2: Verify Client ID and Secret

1. In Google Console → **Credentials**
2. Check your OAuth 2.0 Client ID
3. Make sure the Client ID in Vercel matches exactly (no extra spaces)
4. If you lost the Client Secret, you'll need to create new credentials

## Step 3: Check OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Make sure it's configured:
   - App name: `Global Med Tutors`
   - User support email: Your email
   - Developer contact: Your email
3. If app is in "Testing" mode, add your email as a test user
4. Click **Save**

## Step 4: Verify Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these are set for **Production**:
   - `GOOGLE_CLIENT_ID` = (Your Client ID from Google Console - starts with numbers)
   - `GOOGLE_CLIENT_SECRET` = (Your Client Secret from Google Console - starts with GOCSPX)
   - `NEXTAUTH_URL` = `https://global-med-tutors.vercel.app`
   - `NEXTAUTH_SECRET` = (should be set)

3. **Important**: After updating environment variables, you MUST redeploy:
   ```bash
   vercel --prod
   ```

## Step 5: Common Issues

### Issue: Redirect URI Mismatch
**Solution**: The redirect URI in Google Console must EXACTLY match:
```
https://global-med-tutors.vercel.app/api/auth/callback/google
```
- No trailing slashes
- Must be HTTPS (not HTTP)
- Must include `/api/auth/callback/google`

### Issue: Wrong Client ID/Secret
**Solution**: 
1. Double-check the values in Vercel match Google Console
2. Make sure there are no extra spaces or characters
3. If secret was lost, create new OAuth credentials

### Issue: App in Testing Mode
**Solution**: 
1. Go to OAuth consent screen
2. Add your email as a test user
3. Or publish the app (requires verification if using sensitive scopes)

### Issue: Environment Variables Not Updated
**Solution**: 
1. After changing env vars in Vercel, redeploy:
   ```bash
   vercel --prod
   ```
2. Or trigger a redeploy from Vercel dashboard

## Step 6: Test the Fix

1. Visit: https://global-med-tutors.vercel.app/sign-in
2. Click "Sign in with Google"
3. Should redirect to Google sign-in page
4. After signing in, should redirect back to your app

## Still Not Working?

1. Check Vercel function logs:
   ```bash
   vercel logs --follow
   ```
2. Look for errors in the browser console
3. Verify the redirect URI is being called correctly

## Quick Checklist

- [ ] Redirect URI in Google Console matches exactly
- [ ] Client ID and Secret are correct in Vercel
- [ ] OAuth consent screen is configured
- [ ] Environment variables are set for Production
- [ ] App has been redeployed after env var changes
- [ ] Test user added (if app is in testing mode)
