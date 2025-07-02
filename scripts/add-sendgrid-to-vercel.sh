#!/bin/bash

# Perfume Oasis - Add SendGrid API Key to Vercel
# This script automates adding the SendGrid API key to Vercel environment variables

set -e

echo "🔧 Adding SendGrid API Key to Vercel..."
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# SendGrid API Key - MUST BE SET AS ENVIRONMENT VARIABLE
# Set this before running the script:
# export SENDGRID_API_KEY="your-sendgrid-api-key"
if [ -z "$SENDGRID_API_KEY" ]; then
    echo -e "${RED}Error: SENDGRID_API_KEY environment variable is not set!${NC}"
    echo "Please set it using: export SENDGRID_API_KEY='your-key-here'"
    exit 1
fi

# Project directory
PROJECT_DIR="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Navigate to project directory
cd "$PROJECT_DIR"

echo -e "${BLUE}Adding SendGrid API key to all environments...${NC}"

# Add SendGrid API key to all environments
echo "$SENDGRID_API_KEY" | vercel env add SENDGRID_API_KEY production
echo "$SENDGRID_API_KEY" | vercel env add SENDGRID_API_KEY preview  
echo "$SENDGRID_API_KEY" | vercel env add SENDGRID_API_KEY development

echo -e "${GREEN}✅ SendGrid API key added successfully!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Redeploy your application to apply the changes:"
echo "   vercel --prod"
echo ""
echo "2. Test email functionality by:"
echo "   - Placing a test order"
echo "   - Using the manual email resend endpoint"
echo ""
echo -e "${GREEN}Email system is now fully configured!${NC}"
