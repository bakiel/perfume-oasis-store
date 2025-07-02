#!/bin/bash

# Perfume Oasis - Complete Vercel Environment Setup
# This script ensures all environment variables are properly configured

set -e

echo "🚀 Perfume Oasis - Complete Vercel Environment Setup"
echo "==================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Project directory
PROJECT_DIR="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis"

# Environment variables - MUST BE SET BEFORE RUNNING
# Copy .env.example to .env and fill in your values
# Or export them as environment variables

# Check if .env file exists
if [ -f ".env" ]; then
    source .env
fi

# Default values (override with environment variables)
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-"https://cjmyhlkmszdolfhybcie.supabase.co"}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-""}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-""}
DATABASE_URL=${DATABASE_URL:-""}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-""}
FROM_EMAIL=${FROM_EMAIL:-"orders@perfumeoasis.co.za"}
REPLY_TO_EMAIL=${REPLY_TO_EMAIL:-"support@perfumeoasis.co.za"}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-"https://perfumeoasis.co.za"}

# Check required variables
if [ -z "$SENDGRID_API_KEY" ]; then
    echo -e "${RED}Error: SENDGRID_API_KEY is not set!${NC}"
    echo "Please set it using: export SENDGRID_API_KEY='your-key-here'"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Navigate to project directory
cd "$PROJECT_DIR"

# Function to add environment variable
add_env_var() {
    local name=$1
    local value=$2
    local envs=("production" "preview" "development")
    
    echo -e "${BLUE}Adding $name...${NC}"
    
    for env in "${envs[@]}"; do
        echo "$value" | vercel env add "$name" "$env" 2>/dev/null || {
            echo -e "${YELLOW}$name already exists in $env, skipping...${NC}"
        }
    done
}

echo -e "${YELLOW}Setting up all environment variables...${NC}"
echo ""

# Add all environment variables
add_env_var "SENDGRID_API_KEY" "$SENDGRID_API_KEY"
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
add_env_var "DATABASE_URL" "$DATABASE_URL"
add_env_var "OPENROUTER_API_KEY" "$OPENROUTER_API_KEY"
add_env_var "FROM_EMAIL" "$FROM_EMAIL"
add_env_var "REPLY_TO_EMAIL" "$REPLY_TO_EMAIL"
add_env_var "NEXT_PUBLIC_SITE_URL" "$NEXT_PUBLIC_SITE_URL"

echo ""
echo -e "${GREEN}✅ All environment variables have been configured!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Redeploy your application to apply the changes:"
echo "   cd $PROJECT_DIR"
echo "   vercel --prod"
echo ""
echo "2. Test the complete system:"
echo "   - Place a test order to verify email sending"
echo "   - Check SendGrid dashboard for activity"
echo "   - Verify all features are working"
echo ""
echo -e "${BLUE}Manual Email Resend (for existing orders):${NC}"
echo "curl -X POST https://perfumeoasis.co.za/api/resend-order-email \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"orderId\": \"YOUR-ORDER-ID\"}'"
echo ""
echo -e "${GREEN}Setup complete! 🎉${NC}"
