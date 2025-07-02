-- Add Ocean Breeze product to the database
-- This product was missing but exists in user carts

-- First, check if brands exist
INSERT INTO brands (id, name, slug)
VALUES (gen_random_uuid(), 'Aqua Marine', 'aqua-marine')
ON CONFLICT (slug) DO NOTHING;

-- Get the brand ID
WITH brand_id AS (
  SELECT id FROM brands WHERE slug = 'aqua-marine'
),
-- Get the Fresh category ID
category_id AS (
  SELECT id FROM categories WHERE slug = 'fresh' OR name = 'Fresh'
)
-- Insert Ocean Breeze product
INSERT INTO products (
  id,
  sku,
  name,
  slug,
  brand_id,
  category_id,
  price,
  stock_quantity,
  description,
  notes,
  size,
  concentration,
  gender,
  main_image_url,
  is_active,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  'SKU-OCEAN-BREEZE',
  'Ocean Breeze',
  'ocean-breeze',
  brand_id.id,
  category_id.id,
  999.00,
  50, -- Initial stock
  'Fresh aquatic fragrance that captures the essence of the ocean. Invigorating and refreshing.',
  jsonb_build_object(
    'top', ARRAY['Sea Salt', 'Citrus', 'Mint'],
    'middle', ARRAY['Marine Notes', 'Lavender', 'Sage'],
    'base', ARRAY['Driftwood', 'Ambergris', 'White Musk']
  ),
  '100ml',
  'Eau de Toilette',
  'men',
  '/images/products/generic-bottle-7.jpg', -- Using a generic image
  true,
  NOW(),
  NOW()
FROM brand_id, category_id
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE slug = 'ocean-breeze'
);

-- Verify the product was added
SELECT 
  p.id,
  p.name,
  p.slug,
  p.price,
  p.stock_quantity,
  b.name as brand_name,
  c.name as category_name
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.slug = 'ocean-breeze';