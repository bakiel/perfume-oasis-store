#!/bin/bash

# Perfume Oasis Health Check Script
# Verifies all systems are operational

set -e

echo "🏥 Running Perfume Oasis Health Checks..."
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ $2${NC}"
        ((FAILED++))
    fi
}

# Check Supabase connectivity
echo -e "\n${YELLOW}Checking Supabase connectivity...${NC}"
curl -s -o /dev/null -w "%{http_code}" https://cjmyhlkmszdolfhybcie.supabase.co/rest/v1/ | grep -q "200"
check_status $? "Supabase API accessible"

# Check MCP server directories
echo -e "\n${YELLOW}Checking MCP server structure...${NC}"
[ -d "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/alexander-zuev" ]
check_status $? "Alexander-Zuev MCP directory exists"

[ -d "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/postgres" ]
check_status $? "PostgreSQL MCP directory exists"

[ -d "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/filesystem" ]
check_status $? "Filesystem MCP directory exists"

# Check environment files
echo -e "\n${YELLOW}Checking environment configurations...${NC}"
[ -f "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/alexander-zuev/.env" ]
check_status $? "Alexander-Zuev .env exists"

[ -f "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/postgres/.env" ]
check_status $? "PostgreSQL .env exists"

[ -f "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/filesystem/.env" ]
check_status $? "Filesystem .env exists"

# Check image directory
echo -e "\n${YELLOW}Checking image assets...${NC}"
[ -d "/Users/mac/Downloads/Perfume images" ]
check_status $? "Perfume images directory exists"

# Summary
echo -e "\n========================================"
echo -e "Health Check Summary:"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ All health checks passed!${NC}"
    echo -e "${GREEN}🏝️ Perfume Oasis is healthy and ready!${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some health checks failed!${NC}"
    echo -e "${YELLOW}Please review the errors above.${NC}"
    exit 1
fi
