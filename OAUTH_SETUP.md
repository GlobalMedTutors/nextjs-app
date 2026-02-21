# OAuth Setup Guide (Google & GitHub)

We've switched from AWS Cognito to OAuth providers (Google & GitHub) which are free and don't require AWS.

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

### 2. GitHub OAuth Setup

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Global Med Tutors
   - **Homepage URL**: `https://global-med-tutors.vercel.app`
   - **Authorization callback URL**: 
     ```
     https://global-med-tutors.vercel.app/api/auth/callback/github
     ```
4. Click **Register application**
5. Copy **Client ID** and generate **Client Secret**

### 3. Set Environment Variables in Vercel

Add these to Vercel Dashboard → Environment Variables:

```
GOOGLE_CLIENT_ID = [From Google Cloud Console]
GOOGLE_CLIENT_SECRET = [From Google Cloud Console]
GITHUB_ID = [From GitHub OAuth App]
GITHUB_SECRET = [From GitHub OAuth App]
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
✅ **No password management** - Handled by providers  

## User Experience

Users can now sign in with:
- **Google** - One click, uses their Google account
- **GitHub** - One click, uses their GitHub account

No passwords to remember, no email verification needed!
