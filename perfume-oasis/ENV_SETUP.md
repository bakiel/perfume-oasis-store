# Environment Variables Setup for Perfume Oasis

## Required Environment Variables

### SendGrid Email Service
```
SENDGRID_API_KEY=your-sendgrid-api-key-here
```

### Supabase (Already configured in vercel.json)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

### Database
- DATABASE_URL

### Site Configuration
- NEXT_PUBLIC_SITE_URL

## How to Add Environment Variables to Vercel

1. Go to your Vercel Dashboard
2. Select the `perfume-oasis` project
3. Navigate to Settings → Environment Variables
4. Add each variable with its value
5. Select all environments (Production, Preview, Development)
6. Save changes
7. Redeploy your application

## Important Notes

- Never commit API keys to the repository
- Always use environment variables for sensitive data
- After adding environment variables, you must redeploy for changes to take effect

## Testing Email Configuration

After setting up SendGrid API key:
1. Place a test order
2. Check email logs in Supabase: `SELECT * FROM email_logs ORDER BY created_at DESC;`
3. If emails fail, check the error_message column for details