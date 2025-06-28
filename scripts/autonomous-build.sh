#!/bin/bash

# Perfume Oasis - Autonomous Build Script
# Uses South African English spelling throughout

echo "🌴 Starting Perfume Oasis Autonomous Build Process..."
echo "📱 Mobile-First E-commerce Application"
echo "🇿🇦 Using South African English"

# Set variables
PROJECT_NAME="perfume-oasis"
PROJECT_DIR="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/${PROJECT_NAME}"

# Colours for output
GREEN='\033[0;32m'
GOLD='\033[0;33m'
NC='\033[0m'

# Function to print styled messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_step() {
    echo -e "\n${GOLD}▶${NC} $1"
}

# Create project directory
print_step "Creating Next.js project with TypeScript and Tailwind..."
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB
npx create-next-app@latest ${PROJECT_NAME} \
    --typescript \
    --tailwind \
    --app \
    --src-dir=false \
    --import-alias="@/*" \
    --no-git \
    --no-install

cd ${PROJECT_DIR}

# Create directory structure
print_step "Setting up project structure..."
mkdir -p {app/{(shop)/{products,cart,checkout,account},(admin)/admin/{products,orders,settings},api/{products,cart,checkout,invoices,admin}},components/{ui,mobile,shop,admin},lib/{supabase,email,pdf,utils},hooks,public/{icons,images}}

# Copy logos
print_step "Copying brand assets..."
cp ../renamed_images/perfume-oasis-main-logo.png public/images/
cp ../renamed_images/perfume-oasis-icon-favicon.png public/

# Create package.json with all dependencies
print_step "Creating package.json with dependencies..."
cat > package.json << 'EOF'
{
  "name": "perfume-oasis",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.43.4",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "zustand": "^4.5.2",
    "framer-motion": "^11.2.10",
    "react-hook-form": "^7.51.5",
    "@hookform/resolvers": "^3.6.0",
    "zod": "^3.23.8",
    "@react-pdf/renderer": "^3.4.4",
    "react-intersection-observer": "^9.10.3",
    "next-pwa": "^5.6.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "lucide-react": "^0.379.0",
    "react-hot-toast": "^2.4.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "date-fns": "^3.6.0",
    "resend": "^3.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.3"
  }
}
EOF

# Install dependencies
print_step "Installing dependencies..."
npm install

# Create environment variables file
print_step "Setting up environment variables..."
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cjmyhlkmszdolfhybcie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODY0NDEsImV4cCI6MjA2NjM2MjQ0MX0.W70Hcd-oXuPJzL5jTq_Qqn0HK-KkzgOJhdGbAo9Q7fI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc4NjQ0MSwiZXhwIjoyMDY2MzYyNDQxfQ.ciogTVO1-pzJLaPpZlxvLmrzQpXecPgExoG2qeX4pGk

# OpenRouter
OPENROUTER_API_KEY=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

# Site
NEXT_PUBLIC_SITE_NAME=Perfume Oasis
NEXT_PUBLIC_SITE_DESCRIPTION=Refresh your senses
NEXT_PUBLIC_SITE_URL=https://perfumeoasis.co.za

# Email
RESEND_API_KEY=
FROM_EMAIL=orders@perfumeoasis.co.za
REPLY_TO_EMAIL=support@perfumeoasis.co.za
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
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

# PWA files
**/public/sw.js
**/public/workbox-*.js
**/public/worker-*.js
**/public/sw.js.map
**/public/workbox-*.js.map
**/public/worker-*.js.map
EOF

print_step "Project structure created successfully!"
echo ""
echo "📁 Project created at: ${PROJECT_DIR}"
echo ""
echo "🚀 Next steps:"
echo "1. Run the component generation script"
echo "2. Run the API setup script"
echo "3. Deploy to Vercel"
echo ""
print_status "Build script completed! Ready for component generation."