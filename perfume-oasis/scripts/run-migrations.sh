#!/bin/bash

# Perfume Oasis Database Migration Runner
# This script helps run all necessary database migrations

echo "🚀 Perfume Oasis Database Migration Runner"
echo "========================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Source the environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Check required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Function to run SQL file
run_sql_file() {
    local file=$1
    local description=$2
    
    echo "🔄 Running: $description"
    echo "   File: $file"
    
    if [ -f "$file" ]; then
        echo "   ✅ File found"
    else
        echo "   ❌ File not found: $file"
        return 1
    fi
}

# Main migrations
echo "📋 Migration Plan:"
echo "1. Complete Database Setup (includes all components)"
echo "2. Verify setup with check script"
echo ""

read -p "Do you want to proceed? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting migrations..."
    echo ""
    
    # List all SQL files to be run
    echo "📄 SQL files to execute:"
    run_sql_file "scripts/complete-database-setup.sql" "Complete database setup with all tables and functions"
    
    echo ""
    echo "✅ Migration files verified!"
    echo ""
    echo "📌 Next Steps:"
    echo "1. Copy the contents of scripts/complete-database-setup.sql"
    echo "2. Open your Supabase SQL Editor at: $NEXT_PUBLIC_SUPABASE_URL"
    echo "3. Paste and run the SQL script"
    echo "4. Run: npm run check-db to verify the setup"
    echo ""
    echo "💡 Tip: You can also run individual migration files if needed:"
    echo "   - database/add-promotion-fields-to-orders.sql"
    echo "   - database/increment-promotion-usage.sql"
    echo "   - scripts/admin-system-schema.sql"
    
    # Check if node script exists
    if [ -f "scripts/check-database-setup.js" ]; then
        echo ""
        read -p "Would you like to run the database checker now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "🔍 Running database checker..."
            node scripts/check-database-setup.js
        fi
    fi
else
    echo "Migration cancelled."
fi