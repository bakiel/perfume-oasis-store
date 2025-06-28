#!/bin/bash

# Perfume Oasis - Next.js Project Setup Script
# This script creates and configures the Next.js project for Vercel deployment

set -e

echo "🏝️ Setting up Perfume Oasis Next.js Project..."
echo "============================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Project directories
PROJECT_ROOT="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB"
WEB_DIR="$PROJECT_ROOT/perfume-oasis-web"

cd "$PROJECT_ROOT"

# Check if project already exists
if [ -d "$WEB_DIR" ]; then
    echo -e "${YELLOW}Web directory already exists. Backing up...${NC}"
    mv "$WEB_DIR" "${WEB_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
fi

# Create Next.js project
echo -e "${BLUE}Creating Next.js project...${NC}"
npx create-next-app@latest perfume-oasis-web \
    --typescript \
    --tailwind \
    --app \
    --src-dir \
    --import-alias "@/*" \
    --no-eslint

cd "$WEB_DIR"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
npm install @react-pdf/renderer pdfkit
npm install @sendgrid/mail nodemailer
npm install lucide-react
npm install openai
npm install clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install react-hot-toast
npm install zustand
npm install swr
npm install @vercel/analytics

# Install dev dependencies
echo -e "${BLUE}Installing dev dependencies...${NC}"
npm install -D @types/pdfkit

# Create directory structure
echo -e "${BLUE}Creating project structure...${NC}"
mkdir -p src/app/api/{products,orders,invoices,auth,cart}
mkdir -p src/app/{products,cart,checkout,account,admin}
mkdir -p src/app/products/\[slug\]
mkdir -p src/components/{ui,layout,products,cart,admin}
mkdir -p src/lib/{supabase,utils,constants,types}
mkdir -p src/hooks
mkdir -p src/styles
mkdir -p public/images/{products,brands,banners}

# Create .env.local file
echo -e "${BLUE}Creating environment file...${NC}"
cat > .env.local << 'EOL'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cjmyhlkmszdolfhybcie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODY0NDEsImV4cCI6MjA2NjM2MjQ0MX0.W70Hcd-oXuPJzL5jTq_Qqn0HK-KkzgOJhdGbAo9Q7fI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc4NjQ0MSwiZXhwIjoyMDY2MzYyNDQxfQ.ciogTVO1-pzJLaPpZlxvLmrzQpXecPgExoG2qeX4pGk

# OpenRouter
OPENROUTER_API_KEY=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

# Database
DATABASE_URL=postgresql://postgres.cjmyhlkmszdolfhybcie:le2b8G2rdEA0GQRz@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Email (configure your provider)
SENDGRID_API_KEY=
FROM_EMAIL=orders@perfumeoasis.co.za
REPLY_TO_EMAIL=support@perfumeoasis.co.za

# Site
NEXT_PUBLIC_SITE_NAME=Perfume Oasis
NEXT_PUBLIC_SITE_DESCRIPTION=Refresh your senses
EOL

# Create Supabase client
echo -e "${BLUE}Creating Supabase client...${NC}"
cat > src/lib/supabase/client.ts << 'EOL'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
EOL

# Create server Supabase client
cat > src/lib/supabase/server.ts << 'EOL'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle error in Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle error in Server Component
          }
        },
      },
    }
  )
}
EOL

# Create brand colors configuration
echo -e "${BLUE}Setting up brand colors...${NC}"
cat > src/lib/constants/colors.ts << 'EOL'
export const brandColors = {
  emeraldPalm: '#0E5C4A',
  royalGold: '#C8A95B',
  softSand: '#F6F3EF',
  deepCharcoal: '#2C2C2C',
} as const

export const colors = {
  primary: brandColors.emeraldPalm,
  secondary: brandColors.royalGold,
  background: brandColors.softSand,
  text: brandColors.deepCharcoal,
} as const
EOL

# Update tailwind.config.ts with brand colors
echo -e "${BLUE}Configuring Tailwind with brand colors...${NC}"
cat > tailwind.config.ts << 'EOL'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'emerald-palm': '#0E5C4A',
        'royal-gold': '#C8A95B',
        'soft-sand': '#F6F3EF',
        'deep-charcoal': '#2C2C2C',
        primary: '#0E5C4A',
        secondary: '#C8A95B',
        background: '#F6F3EF',
        foreground: '#2C2C2C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
EOL

# Create basic layout
echo -e "${BLUE}Creating layout...${NC}"
cat > src/app/layout.tsx << 'EOL'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Perfume Oasis - Refresh Your Senses',
  description: 'A refined online boutique curating luxe fragrances inspired by the warmth of desert blooms and the cool calm of hidden springs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-soft-sand text-deep-charcoal`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
EOL

# Create home page
echo -e "${BLUE}Creating home page...${NC}"
cat > src/app/page.tsx << 'EOL'
export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-serif text-emerald-palm mb-4">
            Perfume Oasis
          </h1>
          <p className="text-xl text-royal-gold italic">
            Refresh your senses
          </p>
          <p className="mt-8 max-w-2xl mx-auto text-lg">
            A refined online boutique curating luxe fragrances inspired by the warmth 
            of desert blooms and the cool calm of hidden springs.
          </p>
        </div>
      </div>
    </main>
  )
}
EOL

# Update globals.css
echo -e "${BLUE}Updating global styles...${NC}"
cat > src/app/globals.css << 'EOL'
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  :root {
    --emerald-palm: #0E5C4A;
    --royal-gold: #C8A95B;
    --soft-sand: #F6F3EF;
    --deep-charcoal: #2C2C2C;
  }

  body {
    @apply bg-soft-sand text-deep-charcoal;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-emerald-palm text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all;
  }

  .btn-secondary {
    @apply bg-royal-gold text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all;
  }
}
EOL

# Copy vercel.json
echo -e "${BLUE}Copying Vercel configuration...${NC}"
cp "$PROJECT_ROOT/vercel.json" "$WEB_DIR/vercel.json"

# Create .gitignore
echo -e "${BLUE}Creating .gitignore...${NC}"
cat > .gitignore << 'EOL'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOL

echo -e "${GREEN}✅ Next.js project setup complete!${NC}"
echo -e "${GREEN}🏝️ Perfume Oasis web project is ready for development!${NC}"
echo ""
echo "Next steps:"
echo "1. cd $WEB_DIR"
echo "2. npm run dev (to start development server)"
echo "3. git init && git add . && git commit -m 'Initial commit'"
echo "4. Push to GitHub"
echo "5. Deploy to Vercel"
