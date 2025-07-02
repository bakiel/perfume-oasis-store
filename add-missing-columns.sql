-- Add missing columns to orders table for promotions support
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS applied_promotions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50);

-- Add comments for clarity
COMMENT ON COLUMN orders.applied_promotions IS 'Array of promotion objects applied to this order';
COMMENT ON COLUMN orders.discount_amount IS 'Total discount amount applied to the order';
COMMENT ON COLUMN orders.promo_code IS 'Promo code used for this order';

-- Create index for promo code lookups
CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code);

-- Sample promotions for testing
INSERT INTO promotions (code, discount_percentage, is_active, description, minimum_purchase) VALUES
('WELCOME10', 10, true, '10% off for new customers', 0),
('FREESHIP', 100, true, 'Free shipping on orders over R500', 500),
('SUMMER20', 20, true, '20% off summer collection', 0)
ON CONFLICT (code) DO NOTHING;
