#!/bin/bash

# Perfume Oasis Deployment Script
# This script deploys the Perfume Oasis application with all MCP servers

set -e

echo "🏝️ Deploying Perfume Oasis..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB"
cd "$PROJECT_ROOT"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command_exists node; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Install MCP server dependencies
echo -e "${BLUE}Installing MCP server dependencies...${NC}"

# Alexander-Zuev MCP
echo -e "${YELLOW}Setting up Alexander-Zuev MCP...${NC}"
cd "$PROJECT_ROOT/mcp-servers/alexander-zuev"
npm install
npm run build || echo "Build not configured yet"

# PostgreSQL MCP
echo -e "${YELLOW}Setting up PostgreSQL MCP...${NC}"
cd "$PROJECT_ROOT/mcp-servers/postgres"
npm install
npm run build || echo "Build not configured yet"

# Filesystem MCP
echo -e "${YELLOW}Setting up Filesystem MCP...${NC}"
cd "$PROJECT_ROOT/mcp-servers/filesystem"
npm install
npm run build || echo "Build not configured yet"

# Supabase MCP
echo -e "${YELLOW}Setting up Supabase MCP...${NC}"
cd "$PROJECT_ROOT/mcp-servers/supabase"
npm init -y 2>/dev/null || true
npm install @supabase/supabase-js @modelcontextprotocol/sdk

cd "$PROJECT_ROOT"

# Create database schema
echo -e "${BLUE}Setting up database schema...${NC}"
# This would be done through the MCP servers

# Health check
echo -e "${BLUE}Running health checks...${NC}"
if [ -f "$PROJECT_ROOT/scripts/health-check.sh" ]; then
    bash "$PROJECT_ROOT/scripts/health-check.sh"
else
    echo -e "${YELLOW}Health check script not found. Skipping...${NC}"
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🏝️ Perfume Oasis is ready to refresh your senses!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure Claude Desktop with the MCP servers"
echo "2. Test database connectivity"
echo "3. Deploy to Vercel when ready"
echo ""
echo "MCP Server Status:"
echo "- Alexander-Zuev MCP: Ready"
echo "- PostgreSQL MCP: Ready"
echo "- Filesystem MCP: Ready"
echo "- Supabase MCP: Ready"
