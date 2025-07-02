# Vercel Environment Setup Scripts

These scripts help you configure environment variables for your Perfume Oasis deployment on Vercel.

## Important: Security Notice

**NEVER commit sensitive API keys or passwords to Git!**

Before running these scripts, you must set your environment variables:

### Option 1: Using .env file (Recommended)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your actual values

3. Run the scripts - they will automatically load from .env

### Option 2: Export as environment variables

```bash
export SENDGRID_API_KEY="your-sendgrid-api-key"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
# ... etc
```

## Available Scripts

### 1. add-sendgrid-to-vercel.sh
Adds only the SendGrid API key to Vercel (quick fix for email issues)

```bash
export SENDGRID_API_KEY="your-key-here"
./scripts/add-sendgrid-to-vercel.sh
```

### 2. setup-all-vercel-env.sh
Configures ALL environment variables for Vercel

```bash
# First set all required environment variables or create .env file
./scripts/setup-all-vercel-env.sh
```

### 3. check-vercel-env.sh
Lists all currently configured environment variables in Vercel

```bash
./scripts/check-vercel-env.sh
```

## After Running Scripts

Always redeploy your application after updating environment variables:

```bash
cd perfume-oasis
vercel --prod
```
