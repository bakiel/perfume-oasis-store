-- Seed data for Perfume Oasis
-- This adds sample products to test the filtering system

-- First, insert some brands
INSERT INTO brands (name, slug, description, country, is_featured, is_active) VALUES
('Chanel', 'chanel', 'Iconic French luxury fashion house', 'France', true, true),
('Dior', 'dior', 'French luxury goods company', 'France', true, true),
('Tom Ford', 'tom-ford', 'American luxury fashion brand', 'USA', true, true),
('Jo Malone', 'jo-malone', 'British perfume and scented candle brand', 'UK', true, true),
('Creed', 'creed', 'Anglo-French perfume house', 'UK/France', true, true)
ON CONFLICT (name) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('Eau de Parfum', 'eau-de-parfum', 'Long-lasting fragrances with 15-20% concentration', 1, true),
('Eau de Toilette', 'eau-de-toilette', 'Light fragrances with 5-15% concentration', 2, true),
('Parfum', 'parfum', 'Highly concentrated fragrances with 20-30% concentration', 3, true),
('Gift Sets', 'gift-sets', 'Curated fragrance gift sets', 4, true)
ON CONFLICT (name) DO NOTHING;

-- Get brand and category IDs
WITH brand_ids AS (
  SELECT 
    id as chanel_id,
    (SELECT id FROM brands WHERE slug = 'dior') as dior_id,
    (SELECT id FROM brands WHERE slug = 'tom-ford') as tom_ford_id,
    (SELECT id FROM brands WHERE slug = 'jo-malone') as jo_malone_id,
    (SELECT id FROM brands WHERE slug = 'creed') as creed_id
  FROM brands WHERE slug = 'chanel'
),
category_ids AS (
  SELECT 
    id as edp_id,
    (SELECT id FROM categories WHERE slug = 'eau-de-toilette') as edt_id,
    (SELECT id FROM categories WHERE slug = 'parfum') as parfum_id
  FROM categories WHERE slug = 'eau-de-parfum'
)

-- Insert sample products
INSERT INTO products (
  sku, name, slug, brand_id, category_id, description, short_description,
  concentration, size, gender, top_notes, middle_notes, base_notes,
  price, compare_at_price, stock_quantity, main_image_url,
  is_active, is_featured
) 
SELECT 
  sku, name, slug, brand_id, category_id, description, short_description,
  concentration, size, gender, top_notes, middle_notes, base_notes,
  price, compare_at_price, stock_quantity, main_image_url,
  is_active, is_featured
FROM (
  VALUES
  -- Women's Fragrances
  ('CHAN-005-100', 'Chanel No. 5', 'chanel-no-5', 
   (SELECT chanel_id FROM brand_ids), (SELECT edp_id FROM category_ids),
   'The most iconic fragrance in the world, Chanel No. 5 is a timeless floral aldehyde composition.',
   'A timeless floral aldehyde fragrance',
   'Eau de Parfum', '100ml', 'Women',
   ARRAY['Aldehydes', 'Ylang-Ylang', 'Neroli'], 
   ARRAY['Rose', 'Jasmine', 'Lily of the Valley'],
   ARRAY['Sandalwood', 'Vetiver', 'Vanilla'],
   3500.00, 4200.00, 15, '/images/products/chanel-no-5.jpg',
   true, true),
   
  ('DIOR-JOY-90', 'Dior Joy', 'dior-joy',
   (SELECT dior_id FROM brand_ids), (SELECT edp_id FROM category_ids),
   'An immediate pleasure, an instant charm, an emotion to be shared. JOY by Dior expresses the remarkable feeling of joy.',
   'A luminous and lively fragrance',
   'Eau de Parfum', '90ml', 'Women',
   ARRAY['Bergamot', 'Mandarin'], 
   ARRAY['Rose', 'Jasmine'],
   ARRAY['Sandalwood', 'White Musk'],
   2800.00, 3200.00, 20, '/images/products/dior-joy.jpg',
   true, true),
   
  ('JM-PEONY-100', 'Jo Malone Peony & Blush Suede', 'jo-malone-peony-blush-suede',
   (SELECT jo_malone_id FROM brand_ids), (SELECT edt_id FROM category_ids),
   'Peonies in voluptuous bloom, exquisitely fragile. Flirtatious with the juicy bite of red apple.',
   'A voluptuous and seductive fragrance',
   'Cologne', '100ml', 'Women',
   ARRAY['Red Apple'], 
   ARRAY['Peony', 'Jasmine', 'Rose'],
   ARRAY['Suede'],
   2400.00, null, 25, '/images/products/jo-malone-peony.jpg',
   true, false),

  -- Men's Fragrances
  ('TF-NOIR-100', 'Tom Ford Noir Extreme', 'tom-ford-noir-extreme',
   (SELECT tom_ford_id FROM brand_ids), (SELECT edp_id FROM category_ids),
   'An amber-drenched, woody oriental fragrance with a tantalizing, delectable heart.',
   'A sophisticated amber woody fragrance',
   'Eau de Parfum', '100ml', 'Men',
   ARRAY['Mandarin', 'Neroli', 'Saffron'], 
   ARRAY['Kulfi', 'Rose', 'Jasmine'],
   ARRAY['Amber', 'Sandalwood', 'Vanilla'],
   3200.00, 3800.00, 18, '/images/products/tom-ford-noir.jpg',
   true, true),
   
  ('DIOR-SAUVAGE-100', 'Dior Sauvage', 'dior-sauvage',
   (SELECT dior_id FROM brand_ids), (SELECT edt_id FROM category_ids),
   'A radically fresh composition, dictated by a name that has the ring of a manifesto.',
   'A powerful and noble fragrance',
   'Eau de Toilette', '100ml', 'Men',
   ARRAY['Bergamot', 'Pepper'], 
   ARRAY['Lavender', 'Patchouli', 'Geranium'],
   ARRAY['Labdanum', 'Cedar', 'Ambroxan'],
   2100.00, null, 30, '/images/products/dior-sauvage.jpg',
   true, true),

  -- Unisex Fragrances
  ('CREED-AVENTUS-100', 'Creed Aventus', 'creed-aventus',
   (SELECT creed_id FROM brand_ids), (SELECT edp_id FROM category_ids),
   'An exceptional fragrance inspired by the dramatic life of Emperor Napoleon.',
   'A sophisticated fruity-woody fragrance',
   'Eau de Parfum', '100ml', 'Unisex',
   ARRAY['Pineapple', 'Bergamot', 'Blackcurrant'], 
   ARRAY['Birch', 'Patchouli', 'Jasmine'],
   ARRAY['Musk', 'Oak Moss', 'Vanilla'],
   6500.00, 7200.00, 10, '/images/products/creed-aventus.jpg',
   true, true),
   
  ('TF-OUD-50', 'Tom Ford Oud Wood', 'tom-ford-oud-wood',
   (SELECT tom_ford_id FROM brand_ids), (SELECT parfum_id FROM category_ids),
   'One of the most rare, precious and expensive ingredients in a perfumer''s arsenal.',
   'A pioneering composition of exotic woods',
   'Parfum', '50ml', 'Unisex',
   ARRAY['Oud', 'Brazilian Rosewood', 'Cardamom'], 
   ARRAY['Sichuan Pepper', 'Vetiver', 'Sandalwood'],
   ARRAY['Tonka Bean', 'Vanilla', 'Amber'],
   4800.00, null, 12, '/images/products/tom-ford-oud.jpg',
   true, false)
) AS products(
  sku, name, slug, brand_id, category_id, description, short_description,
  concentration, size, gender, top_notes, middle_notes, base_notes,
  price, compare_at_price, stock_quantity, main_image_url,
  is_active, is_featured
)
ON CONFLICT (sku) DO NOTHING;