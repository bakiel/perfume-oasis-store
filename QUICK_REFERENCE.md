# Perfume Oasis Quick Reference

## 🏝️ Brand Identity
- **Name**: Perfume Oasis
- **Tagline**: *Refresh your senses.*
- **Colors**: Emerald Palm (#0E5C4A), Royal Gold (#C8A95B), Soft Sand (#F6F3EF), Deep Charcoal (#2C2C2C)

## 🔑 Key URLs & Credentials
- **Supabase URL**: https://cjmyhlkmszdolfhybcie.supabase.co
- **Project ID**: cjmyhlkmszdolfhybcie
- **OpenRouter API**: Use Qwen for vision, fallback to Gemini Flash 2.5

## 📁 Important Paths
- **Project Root**: /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB
- **Images**: /Users/mac/Downloads/Perfume images
- **MCP Servers**: /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers

## 🚀 Quick Commands

### Database Operations
```bash
# Check schemas
alexander-zuev:get_schemas

# List tables
alexander-zuev:get_tables schema_name:"public"

# Enable unsafe mode for writes
alexander-zuev:live_dangerously service:"database" enable_unsafe_mode:true

# Execute query
alexander-zuev:execute_postgresql query:"SELECT * FROM products;"
```

### Deployment
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB
./scripts/deploy.sh
```

### Health Check
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB
./scripts/health-check.sh
```

## 🛠️ MCP Servers
1. **alexander-zuev**: Supabase operations
2. **postgres-perfume**: Direct PostgreSQL access
3. **filesystem-perfume**: File operations
4. **supabase-perfume**: Official Supabase MCP

## 📝 Common Tasks
- Create product tables
- Set up authentication
- Configure storage buckets
- Deploy to Vercel
- Integrate OpenRouter AI

## ⚠️ Important Notes
- Always use Alexander MCP for Supabase operations
- Enable unsafe mode before database writes
- Test in development first
- Keep credentials secure
