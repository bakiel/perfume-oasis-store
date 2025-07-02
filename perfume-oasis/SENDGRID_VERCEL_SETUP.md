# SendGrid API Key Setup for Vercel

## Current Status
- ✅ SendGrid account is configured
- ✅ Verified sender: orders@perfumeoasis.co.za
- ✅ Domain authentication exists for kfarmarket.com (shared account)
- ⚠️ SendGrid API key needs to be added to Vercel environment variables

## Steps to Complete SendGrid Setup

### 1. Get Your SendGrid API Key

1. Log in to SendGrid: https://app.sendgrid.com
2. Go to **Settings** → **API Keys**
3. Click **"Create API Key"**
4. Give it a name: "Perfume Oasis Production"
5. Select **"Full Access"** or customize permissions for:
   - Mail Send (required)
   - Template Engine (optional)
   - Stats (optional)
6. Copy the API key (you'll only see it once!)

### 2. Add SendGrid API Key to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select the "perfume-oasis" project
3. Navigate to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `SENDGRID_API_KEY`
   - **Value**: Your SendGrid API key (starts with `SG.`)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

#### Option B: Via Vercel CLI
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis
vercel env add SENDGRID_API_KEY
# When prompted, paste your API key and select all environments
```

### 3. Redeploy to Apply Changes

After adding the environment variable:
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis
vercel --prod
```

Or trigger a redeployment from the Vercel dashboard.

## Current Email Configuration

The SendGrid service is already configured in the code at:
`/lib/email/sendgrid-service.ts`

Email addresses configured:
- orders@perfumeoasis.co.za (verified sender)
- info@perfumeoasis.co.za
- noreply@perfumeoasis.co.za
- support@perfumeoasis.co.za

## Testing Email Functionality

After setup, test the email system:

1. **Test Order Confirmation**:
   - Place a test order
   - Check if email is sent to customer
   - Verify invoice PDF attachment

2. **Check SendGrid Dashboard**:
   - Go to SendGrid Activity Feed
   - Verify emails are being sent
   - Check for any bounces or blocks

## Domain Authentication for perfumeoasis.co.za

While the current setup works with the verified sender, for better deliverability, consider:

1. Adding domain authentication specifically for perfumeoasis.co.za
2. This requires adding DNS records to your Asurah hosting
3. Follow the guide in SENDGRID_DOMAIN_SETUP.md

## Troubleshooting

### Emails Not Sending?
1. Check Vercel logs for SendGrid errors
2. Verify API key is correct in Vercel
3. Check SendGrid dashboard for API activity

### API Key Issues?
- Ensure no extra spaces in the key
- Key should start with `SG.`
- Try creating a new key if issues persist

### Need Help?
- SendGrid Support: https://support.sendgrid.com
- Check API status: https://status.sendgrid.com
