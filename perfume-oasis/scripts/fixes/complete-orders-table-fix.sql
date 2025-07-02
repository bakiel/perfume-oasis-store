-- Complete fix for orders table to enable proper checkout
-- Run this in Supabase SQL Editor

-- 1. Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON orders(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number) WHERE tracking_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 3. Verify the columns were added successfully
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' 
AND column_name IN ('idempotency_key', 'tracking_number', 'shipped_at', 'delivered_at')
ORDER BY column_name;

-- 4. Check current orders table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 5. Grant necessary permissions for guest checkout (if needed)
-- This allows the service role to insert orders for guest users
GRANT INSERT, SELECT ON orders TO service_role;
GRANT INSERT, SELECT ON order_items TO service_role;

-- 6. Success message
SELECT 'Orders table successfully updated! You can now re-enable idempotency checks in the checkout route.' as message;