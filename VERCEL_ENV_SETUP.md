# Vercel Environment Variables Setup

## Required Environment Variables

### Public Variables (Client-side)
These are exposed to the browser and prefixed with `NEXT_PUBLIC_`

```
NEXT_PUBLIC_SUPABASE_URL=https://cjmyhlkmszdolfhybcie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODY0NDEsImV4cCI6MjA2NjM2MjQ0MX0.W70Hcd-oXuPJzL5jTq_Qqn0HK-KkzgOJhdGbAo9Q7fI
NEXT_PUBLIC_SITE_NAME=Perfume Oasis
NEXT_PUBLIC_SITE_DESCRIPTION=Refresh your senses
```

### Secret Variables (Server-side only)
These are only available in API routes and server components

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc4NjQ0MSwiZXhwIjoyMDY2MzYyNDQxfQ.ciogTVO1-pzJLaPpZlxvLmrzQpXecPgExoG2qeX4pGk
DATABASE_URL=postgresql://postgres.cjmyhlkmszdolfhybcie:le2b8G2rdEA0GQRz@aws-0-us-west-1.pooler.supabase.com:6543/postgres
OPENROUTER_API_KEY=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
DATABASE_PASSWORD=le2b8G2rdEA0GQRz
```

### Email Configuration (Add when ready)
```
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=orders@perfumeoasis.co.za
REPLY_TO_EMAIL=support@perfumeoasis.co.za
```

## How to Add Environment Variables in Vercel

### Method 1: Via Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - Key: Variable name
   - Value: Variable value
   - Environment: Select where it applies (Production, Preview, Development)
4. Click "Save"

### Method 2: Via Vercel CLI
```bash
# Add a variable for all environments
vercel env add VARIABLE_NAME

# Add for specific environment
vercel env add VARIABLE_NAME production
vercel env add VARIABLE_NAME preview
vercel env add VARIABLE_NAME development
```

### Method 3: Import from .env file
```bash
# Import all variables from .env.local
vercel env pull .env.local
```

## Environment-Specific Variables

### Production Only
```
NEXT_PUBLIC_SITE_URL=https://perfumeoasis.co.za
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX
```

### Preview/Development
```
NEXT_PUBLIC_SITE_URL=https://perfume-oasis-preview.vercel.app
ENABLE_DEBUG=true
```

## Security Best Practices

1. **Never commit secrets to Git**
   - Use `.env.local` for local development
   - Add `.env*` to `.gitignore`

2. **Use appropriate prefixes**
   - `NEXT_PUBLIC_` for client-side variables
   - No prefix for server-side secrets

3. **Rotate keys regularly**
   - Update Supabase service role key periodically
   - Rotate API keys every 90 days

4. **Use Vercel's encrypted secrets**
   ```bash
   vercel secrets add my-secret-key "secret-value"
   ```

## Troubleshooting

### Variable not available in production
- Ensure you've added it for the "Production" environment
- Redeploy after adding variables

### Variable undefined in code
- Check if using correct prefix (`NEXT_PUBLIC_` for client-side)
- Verify variable name matches exactly (case-sensitive)

### Build failures due to missing variables
- Add variables before deployment
- Use fallback values in code:
  ```typescript
  const apiKey = process.env.OPENROUTER_API_KEY || ''
  ```

## Complete Environment Setup Checklist

- [ ] Add all public variables with `NEXT_PUBLIC_` prefix
- [ ] Add all secret variables without prefix
- [ ] Set variables for all environments (Production, Preview, Development)
- [ ] Test deployment with variables
- [ ] Document any custom variables
- [ ] Set up email service variables when ready
- [ ] Configure analytics variables for production
- [ ] Add any third-party service keys
