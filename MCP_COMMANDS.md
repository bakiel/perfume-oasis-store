# MCP Server Commands for Perfume Oasis

## Alexander-Zuev MCP (Supabase Operations)

### Database Operations
```
alexander-zuev:get_schemas
alexander-zuev:get_tables
alexander-zuev:get_table_schema
alexander-zuev:execute_postgresql
alexander-zuev:retrieve_migrations
```

### API Operations
```
alexander-zuev:send_management_api_request
alexander-zuev:get_management_api_spec
```

### Auth Operations
```
alexander-zuev:get_auth_admin_methods_spec
alexander-zuev:call_auth_admin_method
```

### Safety Controls
```
alexander-zuev:live_dangerously
alexander-zuev:confirm_destructive_operation
```

### Logs
```
alexander-zuev:retrieve_logs
```

## PostgreSQL MCP

```
postgres-perfume:query
```

## Filesystem MCP

```
filesystem-perfume:read_file
filesystem-perfume:write_file
filesystem-perfume:list_directory
filesystem-perfume:create_directory
filesystem-perfume:move_file
filesystem-perfume:search_files
filesystem-perfume:get_file_info
```

## Supabase Official MCP

```
supabase-perfume:list_tables
supabase-perfume:execute_sql
supabase-perfume:apply_migration
supabase-perfume:get_project_url
supabase-perfume:get_anon_key
```

## Usage Examples

### 1. Check Database Schema
```
alexander-zuev:get_schemas
alexander-zuev:get_tables schema_name:"public"
```

### 2. Execute Query
```
alexander-zuev:execute_postgresql query:"SELECT * FROM products LIMIT 10;"
```

### 3. Enable Unsafe Mode (for writes)
```
alexander-zuev:live_dangerously service:"database" enable_unsafe_mode:true
```

### 4. Check Logs
```
alexander-zuev:retrieve_logs collection:"postgres" hours_ago:1
```
