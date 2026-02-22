# Environment Variables Status

## ✅ Successfully Set in Vercel

### Stripe (Sandbox/Test Mode)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Set (test key)
  - Set for: Production, Preview, Development

- ✅ `STRIPE_SECRET_KEY` - Set (test key)
  - Set for: Production, Preview, Development

### Zoom (Server-to-Server OAuth)
- ✅ `ZOOM_CLIENT_ID` - Set
  - Set for: Production, Preview, Development

- ✅ `ZOOM_CLIENT_SECRET` - Set
  - Set for: Production, Preview, Development

- ✅ `ZOOM_ACCOUNT_ID` - Set
  - Set for: Production, Preview, Development

## ⚠️ Still Needed

### Stripe Webhook Secret
- ⚠️ `STRIPE_WEBHOOK_SECRET` - Required for webhook signature verification
  - This is generated when you create a webhook endpoint in Stripe
  - Steps to get it:
    1. Go to Stripe Dashboard → Developers → Webhooks
    2. Create a webhook endpoint pointing to: `https://global-med-tutors.vercel.app/api/webhooks/stripe`
    3. Copy the "Signing secret" (starts with `whsec_`)
    4. Set it as `STRIPE_WEBHOOK_SECRET` in Vercel

## Security Notes

✅ **No secrets are stored in the codebase**
- All environment variables are set in Vercel only
- `.env` files are in `.gitignore`
- Documentation files do not contain actual secret values

## How to Set Missing Variables

### Via Vercel CLI:
```bash
cd nextjs-app
echo "whsec_YOUR_WEBHOOK_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production --yes
echo "whsec_YOUR_WEBHOOK_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET preview --yes
echo "whsec_YOUR_WEBHOOK_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET development --yes
```

### Via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project: `nextjs-app`
3. Go to Settings → Environment Variables
4. Add the missing variables

## Testing

After setting all variables, you'll need to:
1. **Redeploy** the application for changes to take effect:
   ```bash
   vercel --prod
   ```

2. **Test Stripe payments**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

3. **Test Zoom integration**:
   - Create a lesson booking
   - Verify Zoom meeting is created
   - Check that video link is generated

## Notes

- All Stripe keys are in **sandbox/test mode** (as requested)
- Environment variables are set for Production, Preview, and Development
- The app will work for basic functionality, but:
  - **Webhook verification will fail** until `STRIPE_WEBHOOK_SECRET` is set (payments will still work, but credits may not be added automatically via webhook - they can be added manually if needed)
