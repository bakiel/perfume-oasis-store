# Asurah Domain Setup for Vercel

## Your Vercel Project Details
- Project: perfume-oasis
- Vercel URL: https://perfume-oasis.vercel.app
- Project ID: prj_tbGWqIsnrGKTztH7VppuNpe5DI8p

## Steps to Connect Your Asurah Domain to Vercel

### Step 1: Add Domain to Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your "perfume-oasis" project
3. Go to "Settings" → "Domains"
4. Click "Add Domain"
5. Enter your domain name (e.g., `yourdomain.co.za` or `subdomain.yourdomain.co.za`)
6. Click "Add"

### Step 2: Configure DNS in Asurah

You'll need to add one of the following DNS configurations in your Asurah control panel:

#### Option A: For Root Domain (e.g., yourdomain.co.za)
Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

#### Option B: For Subdomain (e.g., shop.yourdomain.co.za)
Add this DNS record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | shop | cname.vercel-dns.com | 3600 |

### Step 3: Wait for DNS Propagation

- DNS changes can take up to 48 hours to propagate
- Usually takes 5-30 minutes
- You can check propagation at: https://www.whatsmydns.net/

### Step 4: Verify Domain in Vercel

1. Go back to Vercel Dashboard → Project Settings → Domains
2. Your domain should show as "Valid Configuration" with a green checkmark
3. If it shows "Invalid Configuration", double-check your DNS settings

## SSL Certificate

- Vercel automatically provisions SSL certificates for your domain
- This happens automatically once DNS is configured correctly
- No additional steps needed

## Environment Variables

Make sure your production environment variables are set in Vercel:
1. Go to Project Settings → Environment Variables
2. Add all variables from your `.env.local` file
3. Key variables to add:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - RESEND_API_KEY (if using email)

## Troubleshooting

### Domain Not Working?
1. Check DNS propagation: https://www.whatsmydns.net/
2. Verify DNS records in Asurah match exactly
3. Clear browser cache and try incognito mode
4. Check Vercel dashboard for any error messages

### SSL Certificate Issues?
- Wait 10-15 minutes after DNS configuration
- Force refresh: Settings → Domains → Click "Refresh" next to your domain

### Need Help?
- Vercel Support: https://vercel.com/support
- Asurah Support: Contact your domain registrar

## Your Live URLs (after setup)
- Production: https://yourdomain.co.za
- www redirect: https://www.yourdomain.co.za → https://yourdomain.co.za
- Vercel URL (always available): https://perfume-oasis.vercel.app
