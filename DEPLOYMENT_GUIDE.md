# 🚀 Perfume Oasis Deployment Guide

## Overview

This guide will help you deploy the Perfume Oasis e-commerce platform to production. The application uses:
- **Frontend**: Next.js 14 hosted on Vercel
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Email**: Resend for transactional emails
- **Domain**: perfumeoasis.co.za

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account with the code repository
- [ ] Vercel account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Resend account for emails
- [ ] Domain name (perfumeoasis.co.za)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose the **South Africa** region (or closest available)
3. Set a strong database password and save it securely

### 1.2 Run Database Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following scripts in order:

```sql
-- First, run the schema creation
-- Copy contents from /database/schema.sql

-- Then, run the RLS policies
-- Copy contents from /database/rls-policies.sql

-- Finally, run the seed data
-- Copy contents from /database/seed-data.sql
```

### 1.3 Configure Authentication

1. Go to Authentication → Providers
2. Enable **Email** provider
3. Configure email templates:
   - Update sender name to "Perfume Oasis"
   - Customise templates with your branding

### 1.4 Get API Keys

1. Go to Settings → API
2. Copy these values:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY

## Step 2: Resend Setup

### 2.1 Create Resend Account

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (perfumeoasis.co.za)
3. Create an API key with full access
4. Copy the API key → RESEND_API_KEY

### 2.2 Configure Email Domain

1. Add DNS records as instructed by Resend:
   ```
   Type: MX
   Name: @
   Value: feedback-smtp.af-south-1.amazonses.com
   Priority: 10
   ```

2. Add SPF record:
   ```
   Type: TXT
   Name: @
   Value: "v=spf1 include:amazonses.com ~all"
   ```

## Step 3: GitHub Repository

### 3.1 Create Repository

```bash
# In the project directory
git init
git add .
git commit -m "Initial commit: Perfume Oasis e-commerce platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/perfume-oasis.git
git push -u origin main
```

### 3.2 Add Environment Variables

Create a `.env.example` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_FROM_EMAIL=noreply@perfumeoasis.co.za

# App
NEXT_PUBLIC_APP_URL=https://perfumeoasis.co.za
```

## Step 4: Vercel Deployment

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `perfume-oasis`
   - Node.js Version: 18.x

### 4.2 Set Environment Variables

Add all environment variables from `.env.example`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- RESEND_API_KEY
- NEXT_PUBLIC_FROM_EMAIL
- NEXT_PUBLIC_APP_URL

### 4.3 Deploy

Click "Deploy" and wait for the build to complete.

## Step 5: Domain Configuration

### 5.1 Add Domain to Vercel

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add `perfumeoasis.co.za` and `www.perfumeoasis.co.za`

### 5.2 Update DNS Records

Add these records to your domain provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Step 6: Post-Deployment Setup

### 6.1 Create Admin User

1. Go to your live site: https://perfumeoasis.co.za/admin
2. Sign up with your admin email
3. In Supabase SQL Editor, run:

```sql
-- Replace 'your-user-id' with the ID from auth.users table
INSERT INTO admin_users (id, role, permissions, is_active) VALUES
    ('your-user-id', 'super_admin', '{"all": true}', true);
```

### 6.2 Configure Store Settings

1. Login to admin panel
2. Go to Settings
3. Update:
   - Store information
   - Bank details for payments
   - Shipping rates
   - Tax settings

### 6.3 Add Initial Products

1. Go to Admin → Products
2. Add your product catalogue
3. Upload product images
4. Set up categories and brands

## Step 7: Testing Checklist

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] Products display with images
- [ ] Search and filters work
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Invoice PDF generates
- [ ] Emails are sent

### Admin Tests
- [ ] Admin login works
- [ ] Dashboard shows correct stats
- [ ] Product management works
- [ ] Order management works
- [ ] Settings save correctly

### Mobile Tests
- [ ] Site is responsive on mobile
- [ ] Bottom navigation works
- [ ] Touch gestures work
- [ ] Forms are usable

## Step 8: Monitoring & Maintenance

### 8.1 Set Up Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Supabase Monitoring**: Check dashboard regularly
3. **Error Tracking**: Consider adding Sentry

### 8.2 Regular Tasks

- **Daily**: Check for new orders
- **Weekly**: Review low stock items
- **Monthly**: Backup database
- **Quarterly**: Update dependencies

### 8.3 Backup Strategy

1. Enable Supabase daily backups (Pro plan)
2. Export data regularly:
```sql
-- Export orders
COPY (SELECT * FROM orders) TO 'orders_backup.csv' WITH CSV HEADER;

-- Export customers
COPY (SELECT * FROM customers) TO 'customers_backup.csv' WITH CSV HEADER;
```

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check Supabase Storage bucket permissions
   - Ensure images are uploaded to public bucket

2. **Emails not sending**
   - Verify Resend API key
   - Check domain verification status
   - Review email logs in Resend dashboard

3. **Payment verification issues**
   - Ensure admin users have correct permissions
   - Check RLS policies on payment_confirmations table

4. **Slow performance**
   - Enable Vercel Edge Functions
   - Optimise images with Next.js Image component
   - Review database indexes

## Security Checklist

- [x] Environment variables are secure
- [x] RLS policies are enabled
- [x] Admin routes are protected
- [x] SQL injection prevention
- [x] XSS protection headers
- [ ] SSL certificate active
- [ ] Regular security updates

## Support

For issues or questions:
- **Technical**: Check Supabase/Vercel docs
- **Business**: info@perfumeoasis.co.za
- **Urgent**: Create GitHub issue

---

**Congratulations! Your Perfume Oasis e-commerce platform is now live! 🎉**