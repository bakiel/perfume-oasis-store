-- Add promotion fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS applied_promotions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS promo_code TEXT;

-- Add index for promo code lookups
CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code);

-- Sample of what applied_promotions JSON will look like:
-- [
--   {
--     "promotion_id": "uuid",
--     "name": "Summer Sale",
--     "type": "percentage",
--     "discount_amount": 150.00,
--     "code": "SUMMER2024"
--   }
-- ]