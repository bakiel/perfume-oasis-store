#!/bin/bash

echo "Running Perfume Oasis Database Migration..."

# Read the migration file and apply it
MIGRATION_FILE="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/DATABASE_MIGRATION.sql"

# Check if file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo "✓ Migration file found"
echo "✓ This will create all necessary tables for Perfume Oasis"
echo ""
echo "Tables to be created:"
echo "- categories"
echo "- brands" 
echo "- products"
echo "- product_images"
echo "- product_attributes"
echo "- customers"
echo "- addresses"
echo "- carts & cart_items"
echo "- orders & order_items"
echo "- reviews"
echo "- wishlists"
echo "- coupons"
echo "- newsletter_subscribers"
echo "- payment_accounts"
echo "- payment_confirmations"
echo "- invoice_settings"
echo ""
echo "The migration will also:"
echo "- Enable necessary extensions"
echo "- Create indexes for performance"
echo "- Set up Row Level Security policies"
echo "- Create update triggers"
echo "- Insert default invoice settings"
echo ""
echo "Please run the migration using your Supabase MCP in Claude"
echo "Command: perfume-oasis-supabase:apply_migration"
