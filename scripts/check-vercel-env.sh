#!/bin/bash

# Perfume Oasis - Check Vercel Environment Variables
# This script checks which environment variables are currently set in Vercel

set -e

echo "🔍 Checking Vercel Environment Variables..."
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Project directory
PROJECT_DIR="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI not found!${NC}"
    echo "Please install it with: npm i -g vercel"
    exit 1
fi

# Navigate to project directory
cd "$PROJECT_DIR"

echo -e "${BLUE}Listing all environment variables...${NC}"
echo ""

# List environment variables
vercel env ls

echo ""
echo -e "${YELLOW}To view a specific variable value:${NC}"
echo "vercel env pull .env.local"
echo ""
echo -e "${YELLOW}To add missing variables, run:${NC}"
echo "./scripts/setup-all-vercel-env.sh"
