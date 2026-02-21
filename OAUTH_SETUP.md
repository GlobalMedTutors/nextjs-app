# OAuth Setup Guide (Google)

We've switched from AWS Cognito to Google OAuth which is free and doesn't require AWS.

## Setup Steps

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen if prompted
6. Application type: **Web application**
7. Authorized redirect URIs:
   ```
   https://global-med-tutors.vercel.app/api/auth/callback/google
   ```
8. Copy **Client ID** and **Client Secret**

### 2. Set Environment Variables in Vercel

Add these to Vercel Dashboard → Environment Variables:

```
GOOGLE_CLIENT_ID = [From Google Cloud Console]
GOOGLE_CLIENT_SECRET = [From Google Cloud Console]
```

### 4. Remove Cognito Variables

You can now **remove** these (no longer needed):
- ❌ `COGNITO_CLIENT_ID`
- ❌ `COGNITO_CLIENT_SECRET`
- ❌ `COGNITO_ISSUER`
- ❌ `COGNITO_JWKS_URL`

## Benefits

✅ **Free** - No AWS costs  
✅ **Simple** - No AWS setup required  
✅ **Secure** - OAuth 2.0 standard  
✅ **User-friendly** - One-click sign-in  
✅ **No password management** - Handled by Google  
✅ **Widely used** - Most users have Google accounts

## User Experience

Users sign in with **Google** - one click, uses their Google account. No passwords to remember, no email verification needed!
