-- Admin System Database Schema Updates
-- Run this script to add admin functionality to your Supabase database

-- 1. Add role field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. Create user_roles table for more complex permissions in future
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'customer')),
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, role)
);

-- 3. Create promotions table for managing specials
CREATE TABLE IF NOT EXISTS promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'bogo', 'free_shipping')),
    value DECIMAL(10, 2) NOT NULL,
    minimum_purchase DECIMAL(10, 2) DEFAULT 0,
    code TEXT UNIQUE,
    auto_apply BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    end_date TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    product_ids UUID[] DEFAULT '{}',
    category_ids UUID[] DEFAULT '{}',
    display_on_homepage BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for promotions
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_homepage ON promotions(display_on_homepage, is_active);

-- 4. Create settings table for store configuration
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default settings
INSERT INTO settings (key, value, description, category, is_public) VALUES
    ('store_name', '"Perfume Oasis"', 'Store name', 'general', true),
    ('store_email', '"orders@perfumeoasis.co.za"', 'Primary store email', 'email', true),
    ('store_phone', '"+27 82 480 1311"', 'Store contact number', 'general', true),
    ('delivery_fee', '150', 'Standard delivery fee in Rands', 'shipping', false),
    ('free_delivery_threshold', '1000', 'Free delivery for orders above this amount', 'shipping', false),
    ('currency', '"ZAR"', 'Store currency', 'general', true),
    ('tax_rate', '0', 'Tax rate (0 for non-VAT registered)', 'tax', false),
    ('low_stock_threshold', '10', 'Alert when stock falls below this', 'inventory', false)
ON CONFLICT (key) DO NOTHING;

-- 5. Create email_logs table for tracking emails
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    to_email TEXT NOT NULL,
    from_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- 6. Create audit_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 7. Add order duplicate prevention and tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- 8. Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = user_id 
        AND profiles.role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to log audit trail
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create triggers for audit logging on important tables
CREATE TRIGGER audit_products_changes
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_orders_changes
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_promotions_changes
    AFTER INSERT OR UPDATE OR DELETE ON promotions
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- 11. Update RLS policies for admin access
-- Drop existing policies if any
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies with admin support
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id OR is_admin(auth.uid()));

-- Policies for promotions table
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promotions" 
ON promotions FOR SELECT 
USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins can manage promotions" 
ON promotions FOR ALL 
USING (is_admin(auth.uid()));

-- Policies for settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings are viewable by everyone" 
ON settings FOR SELECT 
USING (is_public = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins can manage settings" 
ON settings FOR ALL 
USING (is_admin(auth.uid()));

-- Policies for email_logs table
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view email logs" 
ON email_logs FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "System can insert email logs" 
ON email_logs FOR INSERT 
USING (true);

-- Policies for audit_logs table
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" 
ON audit_logs FOR SELECT 
USING (is_admin(auth.uid()));

-- 12. Create view for homepage specials
CREATE OR REPLACE VIEW homepage_specials AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.compare_at_price,
    p.main_image_url,
    p.brand_id,
    b.name as brand_name,
    CASE 
        WHEN p.compare_at_price > p.price THEN 
            ROUND(((p.compare_at_price - p.price) / p.compare_at_price * 100)::numeric, 0)
        ELSE 0 
    END as discount_percentage
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.is_active = true 
AND p.compare_at_price IS NOT NULL 
AND p.compare_at_price > p.price
ORDER BY (p.compare_at_price - p.price) DESC
LIMIT 8;

-- Grant permissions
GRANT SELECT ON homepage_specials TO anon, authenticated;