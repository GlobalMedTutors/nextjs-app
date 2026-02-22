# Zoom OAuth Configuration Guide

## OAuth Type: Server-to-Server OAuth

Your application uses **Zoom Server-to-Server OAuth** (not user OAuth), which means:
- No user interaction required
- No redirect URL needed (server-to-server communication)
- Uses `grant_type=account_credentials`
- Requires `ZOOM_ACCOUNT_ID` in addition to Client ID and Secret

## Zoom App Configuration

### 1. Redirect URL
**For Server-to-Server OAuth: Not Required**

However, if the Zoom Marketplace requires a redirect URL field:
- **Redirect URL**: `https://global-med-tutors.vercel.app/api/zoom/callback` (placeholder - not actually used)
- Or use: `https://global-med-tutors.vercel.app` (any valid URL)

**Note**: This URL won't be called since we use server-to-server OAuth, but some forms require it.

### 2. Allowlist / Whitelist

**For Server-to-Server OAuth, you may need to allowlist:**

**IP Addresses** (if required):
- Vercel serverless functions use dynamic IPs, so you may need to:
  - Allowlist: `0.0.0.0/0` (allow all - not recommended for production)
  - Or: Contact Zoom support for Vercel IP ranges
  - Or: Use Zoom's IP allowlist feature if available

**Domain Allowlist** (if available):
- `global-med-tutors.vercel.app`
- `*.vercel.app` (if wildcards are supported)

**Note**: Many Server-to-Server OAuth apps don't require IP allowlisting since authentication is done via Client ID/Secret.

### 3. Required Scopes

For creating meetings, you need:

**Minimum Required Scopes:**
- ✅ `meeting:write` - Create and manage meetings
- ✅ `meeting:read` - Read meeting information (optional but recommended)

**Additional Scopes (if needed later):**
- `user:read` - Read user information
- `meeting:write:admin` - Admin-level meeting management (if needed)

**In Zoom Marketplace App Configuration:**
1. Go to your app's **Scopes** section
2. Enable:
   - ✅ `meeting:write`
   - ✅ `meeting:read` (recommended)

### 4. Account ID

You'll also need your **Zoom Account ID** (`ZOOM_ACCOUNT_ID`):

**How to find it:**
1. Go to Zoom Marketplace: https://marketplace.zoom.us/
2. Go to **Develop** → **Server-to-Server OAuth**
3. Find your app
4. The **Account ID** is displayed there (usually looks like: `xxxxxxxxxx`)

**Or:**
1. Log into your Zoom account
2. Go to **Admin** → **Account Management** → **Account Profile**
3. Your Account ID is shown there

## Complete Setup Checklist

### In Zoom Marketplace:
- [ ] App Type: **Server-to-Server OAuth**
- [ ] Client ID: `QOsKEVT2TSyZYysC6rcNZA` ✅ (already set)
- [ ] Client Secret: `1lUfRA7UgXjbUdtyETs5QvstRi88NSo1` ✅ (already set)
- [ ] Account ID: `[YOUR_ACCOUNT_ID]` ⚠️ (needs to be set)
- [ ] Redirect URL: `https://global-med-tutors.vercel.app` (placeholder if required)
- [ ] Scopes: `meeting:write`, `meeting:read`
- [ ] Allowlist: Configure if required by your Zoom plan

### In Vercel Environment Variables:
- [x] `ZOOM_CLIENT_ID` = `QOsKEVT2TSyZYysC6rcNZA` ✅
- [x] `ZOOM_CLIENT_SECRET` = `1lUfRA7UgXjbUdtyETs5QvstRi88NSo1` ✅
- [ ] `ZOOM_ACCOUNT_ID` = `[YOUR_ACCOUNT_ID]` ⚠️ **Still needs to be set**

## Setting ZOOM_ACCOUNT_ID

Once you have your Account ID, set it in Vercel:

```bash
cd nextjs-app
echo "YOUR_ACCOUNT_ID_HERE" | vercel env add ZOOM_ACCOUNT_ID production --yes
echo "YOUR_ACCOUNT_ID_HERE" | vercel env add ZOOM_ACCOUNT_ID preview --yes
echo "YOUR_ACCOUNT_ID_HERE" | vercel env add ZOOM_ACCOUNT_ID development --yes
```

Or via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select project: `nextjs-app`
3. Settings → Environment Variables
4. Add `ZOOM_ACCOUNT_ID` with your Account ID value

## Testing

After setting `ZOOM_ACCOUNT_ID`:

1. **Redeploy** the app:
   ```bash
   vercel --prod
   ```

2. **Test meeting creation:**
   - Book a lesson as a student
   - Check that a Zoom meeting is created
   - Verify the `videoLink` field is populated in the lesson

3. **Check logs** if it fails:
   ```bash
   vercel logs --follow
   ```

## Troubleshooting

### Error: "Invalid account credentials"
- Check that `ZOOM_ACCOUNT_ID` matches your Zoom account
- Verify Client ID and Secret are correct
- Ensure the app is activated in Zoom Marketplace

### Error: "Insufficient permissions"
- Check that `meeting:write` scope is enabled
- Verify the app has the correct scopes in Zoom Marketplace

### Error: "IP not allowed"
- Configure IP allowlist in Zoom app settings
- Or contact Zoom support for Vercel IP ranges

## API Endpoints Used

Your app makes these Zoom API calls:
- `POST https://zoom.us/oauth/token` - Get access token
- `POST https://api.zoom.us/v2/users/{accountId}/meetings` - Create meeting

Both use Server-to-Server OAuth authentication.
