-- Complete Database Setup for Perfume Oasis
-- Run this script in Supabase SQL Editor to set up all required database objects

-- 1. Add promotion and payment fields to orders table (if not exists)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS applied_promotions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create index for promo code lookups
CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code);

-- 2. Create promotions table (if not exists)
CREATE TABLE IF NOT EXISTS promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'bogo', 'free_shipping')),
    value DECIMAL(10, 2) NOT NULL,
    minimum_purchase DECIMAL(10, 2),
    code TEXT UNIQUE,
    auto_apply BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    product_ids UUID[] DEFAULT '{}',
    category_ids UUID[] DEFAULT '{}',
    customer_ids UUID[] DEFAULT '{}',
    display_on_homepage BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for promotions
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_auto_apply ON promotions(auto_apply);

-- 3. Create increment promotion usage function
CREATE OR REPLACE FUNCTION increment_promotion_usage(promotion_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE promotions 
    SET usage_count = usage_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = promotion_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Create payment_confirmations table for tracking payment verifications
CREATE TABLE IF NOT EXISTS payment_confirmations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) NOT NULL,
    reference_number TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    bank_name TEXT,
    notes TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_by UUID REFERENCES auth.users(id),
    proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for order lookups
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_order_id ON payment_confirmations(order_id);

-- 5. Create email_logs table for tracking emails
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    email_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create settings table for store configuration
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES auth.users(id)
);

-- 6. Ensure profiles table has role column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff'));

-- 7. Create RLS policies for promotions
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active promotions
CREATE POLICY "Public can view active promotions" ON promotions
    FOR SELECT
    USING (is_active = true);

-- Allow admins to manage promotions
CREATE POLICY "Admins can manage promotions" ON promotions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'staff')
        )
    );

-- 8. Create RLS policies for email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow system to insert email logs
CREATE POLICY "System can insert email logs" ON email_logs
    FOR INSERT
    WITH CHECK (true);

-- Allow admins to view email logs
CREATE POLICY "Admins can view email logs" ON email_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'staff')
        )
    );

-- 9. Insert default promotions for testing
INSERT INTO promotions (name, description, type, value, code, is_active, display_on_homepage, priority)
VALUES 
    ('Welcome Discount', 'Get 10% off your first order', 'percentage', 10, 'WELCOME10', true, true, 10),
    ('Free Shipping', 'Free shipping on all orders', 'free_shipping', 0, 'FREESHIP', true, true, 5),
    ('Summer Sale', 'Save R100 on orders over R500', 'fixed_amount', 100, 'SUMMER100', true, true, 8)
ON CONFLICT (code) DO NOTHING;

-- 10. Ensure all order status values are valid
UPDATE orders 
SET status = 'pending' 
WHERE status = 'pending_payment';

-- 11. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Database setup completed successfully!'; 
END $$;