#!/bin/bash

# Add Perfume Oasis MCP servers to Claude Desktop config

CONFIG_FILE="/Users/mac/Library/Application Support/Claude/claude_desktop_config.json"
BACKUP_FILE="/Users/mac/Library/Application Support/Claude/claude_desktop_config_backup_$(date +%Y%m%d_%H%M%S).json"

# Backup current config
echo "Backing up current config..."
cp "$CONFIG_FILE" "$BACKUP_FILE"

# Create temporary file with new MCPs added
cat > /tmp/perfume_oasis_mcps.json << 'EOF'
{
  "perfume-oasis-alexander-zuev": {
    "command": "/Users/mac/.local/bin/supabase-mcp-server",
    "env": {
      "QUERY_API_KEY": "qry_v1_vZaKdIY28WnkPQqoOKsfIdJMAsBOAkhTiLnqBf64Si8",
      "SUPABASE_PROJECT_REF": "cjmyhlkmszdolfhybcie",
      "SUPABASE_DB_PASSWORD": "le2b8G2rdEA0GQRz",
      "SUPABASE_REGION": "us-west-1",
      "SUPABASE_ACCESS_TOKEN": "sbp_6596626ef518ed0e896aa4031a560c3dd19d0193",
      "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc4NjQ0MSwiZXhwIjoyMDY2MzYyNDQxfQ.ciogTVO1-pzJLaPpZlxvLmrzQpXecPgExoG2qeX4pGk"
    }
  },
  "perfume-oasis-postgres": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-postgres",
      "postgresql://postgres.cjmyhlkmszdolfhybcie:le2b8G2rdEA0GQRz@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
    ]
  },
  "perfume-oasis-filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB",
      "/Users/mac/Downloads/Perfume images"
    ]
  },
  "perfume-oasis-supabase": {
    "command": "npx",
    "args": [
      "-y",
      "@supabase/mcp-server-supabase@latest",
      "--project-ref=cjmyhlkmszdolfhybcie"
    ],
    "env": {
      "SUPABASE_ACCESS_TOKEN": "sbp_6596626ef518ed0e896aa4031a560c3dd19d0193"
    }
  }
}
EOF

echo "Adding Perfume Oasis MCP servers to Claude config..."
echo ""
echo "The following MCP servers will be added:"
echo "1. perfume-oasis-alexander-zuev - Main Supabase operations"
echo "2. perfume-oasis-postgres - Direct PostgreSQL access"
echo "3. perfume-oasis-filesystem - File system access"
echo "4. perfume-oasis-supabase - Official Supabase MCP"
echo ""
echo "Please manually add these to your Claude Desktop config."
echo "The configuration has been saved to: /tmp/perfume_oasis_mcps.json"
echo ""
echo "To add them:"
echo "1. Open Claude Desktop settings"
echo "2. Go to Developer settings"
echo "3. Edit the configuration"
echo "4. Add the contents of /tmp/perfume_oasis_mcps.json to the mcpServers section"
echo ""
echo "Backup saved to: $BACKUP_FILE"
