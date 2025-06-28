-- Create promotions table for backend-updatable specials
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount DECIMAL(10, 2),
  promo_code VARCHAR(50),
  banner_image_url TEXT,
  link_url VARCHAR(255),
  position INTEGER DEFAULT 0, -- For ordering promotions
  is_active BOOLEAN DEFAULT true,
  show_on_homepage BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active promotions
CREATE INDEX idx_promotions_active ON promotions(is_active, show_on_homepage, start_date, end_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample promotions
INSERT INTO promotions (title, subtitle, description, discount_percentage, banner_image_url, link_url, position, is_active, show_on_homepage) VALUES
('Summer Sale', 'Up to 30% off selected fragrances', 'Beat the heat with cool savings on our summer collection', 30, '/images/banners/PO-horizontal-banner-promo-emerald.jpg', '/sale', 1, true, true),
('New Arrivals', 'Fresh fragrances just landed', 'Discover the latest additions to our collection', NULL, '/images/banners/PO-horizontal-banner-collection.jpg', '/new-arrivals', 2, true, true),
('Free Shipping', 'On orders over R1,000', 'Shop now and enjoy free delivery nationwide', NULL, NULL, '/products', 3, true, true);

-- Create promotion_products junction table for specific product promotions
CREATE TABLE IF NOT EXISTS promotion_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  special_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(promotion_id, product_id)
);

-- Create index for promotion products
CREATE INDEX idx_promotion_products ON promotion_products(promotion_id, product_id);