#!/usr/bin/env python3
import json
import sys

# Read the current config
config_path = "/Users/mac/Library/Application Support/Claude/claude_desktop_config.json"
with open(config_path, 'r') as f:
    config = json.load(f)

# Add Perfume Oasis MCP servers
perfume_oasis_mcps = {
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

# Add the new MCPs to the config
config["mcpServers"].update(perfume_oasis_mcps)

# Write the updated config
with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)

print("✅ Successfully added Perfume Oasis MCP servers to Claude configuration!")
print("Added:")
for key in perfume_oasis_mcps.keys():
    print(f"  - {key}")
print("\nPlease restart Claude Desktop for the changes to take effect.")
