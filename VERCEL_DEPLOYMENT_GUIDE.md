# Vercel Deployment Guide for Perfume Oasis

## Prerequisites
- Vercel account
- GitHub repository for the project
- Supabase project (already configured)

## Initial Setup

### 1. Create Next.js Project
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB
npx create-next-app@latest perfume-oasis-web --typescript --tailwind --app
cd perfume-oasis-web
```

### 2. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install pdfkit @react-pdf/renderer
npm install @sendgrid/mail nodemailer
npm install lucide-react
npm install openai
```

### 3. Environment Variables
Create `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cjmyhlkmszdolfhybcie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODY0NDEsImV4cCI6MjA2NjM2MjQ0MX0.W70Hcd-oXuPJzL5jTq_Qqn0HK-KkzgOJhdGbAo9Q7fI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc4NjQ0MSwiZXhwIjoyMDY2MzYyNDQxfQ.ciogTVO1-pzJLaPpZlxvLmrzQpXecPgExoG2qeX4pGk

# OpenRouter
OPENROUTER_API_KEY=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

# Database
DATABASE_URL=postgresql://postgres.cjmyhlkmszdolfhybcie:le2b8G2rdEA0GQRz@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Email (configure your provider)
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=orders@perfumeoasis.co.za
```

## Vercel Deployment Steps

### 1. Connect to GitHub
1. Push your code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository

### 2. Configure Project
1. Framework Preset: Next.js
2. Root Directory: `perfume-oasis-web` (if in subdirectory)
3. Build Command: `npm run build`
4. Output Directory: `.next`

### 3. Environment Variables
Add these in Vercel Dashboard > Settings > Environment Variables:

**Public Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (will be auto-generated)

**Secret Variables:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- `DATABASE_URL`
- `SENDGRID_API_KEY`
- `FROM_EMAIL`

### 4. Deploy
Click "Deploy" and Vercel will:
1. Clone your repository
2. Install dependencies
3. Build the project
4. Deploy to their edge network

## Project Structure
```
perfume-oasis-web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── account/
│   │   └── page.tsx
│   └── api/
│       ├── products/
│       ├── orders/
│       ├── invoices/
│       └── auth/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   └── cart/
├── lib/
│   ├── supabase/
│   ├── utils/
│   └── constants/
├── public/
│   └── images/
└── styles/
    └── globals.css
```

## API Routes Setup

### Products API (`app/api/products/route.ts`)
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*, brand:brands(*), category:categories(*)')
    .eq('is_active', true)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ products })
}
```

### Invoice Generation (`app/api/invoices/generate/route.ts`)
```typescript
import PDFDocument from 'pdfkit'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { orderId } = await request.json()
  
  // Generate PDF invoice
  const doc = new PDFDocument()
  // ... PDF generation logic
  
  return new NextResponse(doc, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${orderId}.pdf"`
    }
  })
}
```

## Deployment Commands

### Initial Deployment
```bash
vercel
```

### Production Deployment
```bash
vercel --prod
```

### Preview Deployment
```bash
vercel --preview
```

## Custom Domain Setup
1. Go to Vercel Dashboard > Settings > Domains
2. Add your domain: `perfumeoasis.co.za`
3. Configure DNS as instructed
4. SSL certificate will be auto-provisioned

## Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image'

<Image
  src={product.image_url}
  alt={product.name}
  width={500}
  height={500}
  loading="lazy"
  placeholder="blur"
/>
```

### Edge Functions
Create `middleware.ts` for edge-based logic:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}
```

## Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting

### Build Errors
- Check Node.js version compatibility
- Verify all environment variables are set
- Check for TypeScript errors

### Runtime Errors
- Check Vercel Functions logs
- Verify Supabase connection
- Check API route responses

### Performance Issues
- Enable Vercel Edge Config
- Optimize images with Next.js Image
- Use ISR for product pages

## Security Checklist
- [ ] Environment variables secured
- [ ] API routes protected
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] SQL injection prevention
