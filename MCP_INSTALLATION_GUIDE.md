# Adding Perfume Oasis MCP Servers to Claude Desktop

## Quick Setup

The Perfume Oasis MCP servers need to be added to your Claude Desktop configuration to enable database and file operations.

## MCP Servers to Add

1. **perfume-oasis-alexander-zuev** - Main Supabase operations
2. **perfume-oasis-postgres** - Direct PostgreSQL access  
3. **perfume-oasis-filesystem** - File system access
4. **perfume-oasis-supabase** - Official Supabase MCP

## Installation Steps

### Method 1: Manual Addition (Recommended)

1. Open Claude Desktop
2. Go to Settings (⚙️) → Developer
3. Click "Edit Config" button
4. Find the `"mcpServers": {` section
5. Add the following entries before the closing `}`:

```json
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
},
```

6. Click "Save" 
7. Restart Claude Desktop

### Method 2: Copy from File

1. The complete MCP configuration is available at:
   ```
   /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/config/perfume-oasis-mcps.json
   ```

2. Copy the contents and add to your Claude config as shown above

## Verification

After adding the MCPs and restarting Claude:

1. Start a new conversation
2. Test the MCPs with these commands:

```
# Test Alexander-Zuev MCP
perfume-oasis-alexander-zuev:get_schemas

# Test PostgreSQL MCP  
perfume-oasis-postgres:query sql:"SELECT version();"

# Test Filesystem MCP
perfume-oasis-filesystem:list_directory path:"/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB"

# Test Supabase MCP
perfume-oasis-supabase:list_tables
```

## Troubleshooting

### If MCPs don't appear:
1. Check the JSON syntax (no trailing commas)
2. Restart Claude Desktop completely
3. Check that paths exist
4. Verify credentials are correct

### If database connection fails:
1. Check Supabase project is active
2. Verify connection string
3. Check network connectivity

## Available Commands

Once installed, you can use commands like:

- `perfume-oasis-alexander-zuev:execute_postgresql` - Run SQL queries
- `perfume-oasis-alexander-zuev:get_tables` - List database tables
- `perfume-oasis-postgres:query` - Direct PostgreSQL queries
- `perfume-oasis-filesystem:read_file` - Read files
- `perfume-oasis-filesystem:write_file` - Write files
- `perfume-oasis-supabase:execute_sql` - Execute SQL via official MCP
