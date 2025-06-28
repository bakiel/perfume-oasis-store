#!/bin/bash

# Perfume Oasis - Vercel Deployment Script
# This script handles deployment to Vercel

set -e

echo "🚀 Deploying Perfume Oasis to Vercel..."
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Project directories
PROJECT_ROOT="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB"
WEB_DIR="$PROJECT_ROOT/perfume-oasis-web"

# Check if web directory exists
if [ ! -d "$WEB_DIR" ]; then
    echo -e "${RED}Error: Web directory not found!${NC}"
    echo "Please run setup-nextjs.sh first."
    exit 1
fi

cd "$WEB_DIR"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Function to deploy
deploy() {
    local env=$1
    echo -e "${BLUE}Deploying to $env...${NC}"
    
    if [ "$env" = "production" ]; then
        vercel --prod
    else
        vercel
    fi
}

# Check for command line argument
if [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    echo -e "${YELLOW}Deploying to PRODUCTION${NC}"
    deploy "production"
elif [ "$1" = "preview" ]; then
    echo -e "${YELLOW}Deploying to PREVIEW${NC}"
    deploy "preview"
else
    echo -e "${BLUE}Usage:${NC}"
    echo "  $0          - Deploy to preview"
    echo "  $0 preview  - Deploy to preview"
    echo "  $0 prod     - Deploy to production"
    echo ""
    echo -e "${YELLOW}Deploying to PREVIEW (default)${NC}"
    deploy "preview"
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Check your deployment URL in the output above"
echo "2. Verify all functionality is working"
echo "3. Configure custom domain in Vercel dashboard if needed"
