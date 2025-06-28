-- Seed data for Perfume Oasis - Original 33 Products
-- This restores all the original products with correct gender capitalization

-- First, ensure we have the necessary brands
INSERT INTO brands (name, slug, is_active) VALUES
('Lattafa', 'lattafa', true),
('Barakkat', 'barakkat', true),
('Dolce & Gabbana', 'dolce-gabbana', true),
('Lacoste', 'lacoste', true),
('Emper', 'emper', true),
('Jacques Yves', 'jacques-yves', true),
('Berries', 'berries', true),
('Armaf', 'armaf', true),
('Maison Alhambra', 'maison-alhambra', true),
('Lalique', 'lalique', true),
('Just', 'just', true),
('Oud Al Layl', 'oud-al-layl', true),
('Midnight OUD', 'midnight-oud', true),
('NUDO', 'nudo', true),
('Rodriguez', 'rodriguez', true),
('Rave', 'rave', true),
('Ophylia', 'ophylia', true),
('Mousquetaire', 'mousquetaire', true),
('Melina', 'melina', true),
('Legend', 'legend', true),
('Oud Isphahan', 'oud-isphahan', true),
('Nebras', 'nebras', true)
ON CONFLICT (name) DO NOTHING;

-- Ensure we have the necessary categories
INSERT INTO categories (name, slug, is_active) VALUES
('Floral', 'floral', true),
('Oriental', 'oriental', true),
('Woody', 'woody', true),
('Fresh', 'fresh', true)
ON CONFLICT (name) DO NOTHING;

-- Clear existing products (optional - comment out if you want to keep existing)
-- DELETE FROM products WHERE id IS NOT NULL;

-- Insert all 33 original products with proper gender capitalization
INSERT INTO products (
  sku, name, slug, brand_id, category_id, price, size, gender,
  main_image_url, stock_quantity, is_active, concentration
) 
SELECT 
  UPPER(REPLACE(REPLACE(name, ' ', '-'), '&', 'AND')) || '-' || COALESCE(size, '100ML'),
  name,
  LOWER(REPLACE(REPLACE(REPLACE(name, ' ', '-'), '&', 'and'), 'عنابي', 'anabi')),
  (SELECT id FROM brands WHERE brands.name = product_data.brand),
  (SELECT id FROM categories WHERE categories.name = product_data.category),
  price,
  size,
  CASE 
    WHEN gender = 'women' THEN 'Women'
    WHEN gender = 'men' THEN 'Men'
    WHEN gender = 'unisex' THEN 'Unisex'
  END,
  image_url,
  20, -- Default stock
  true,
  'Eau de Parfum' -- Default concentration
FROM (VALUES
  -- Women's Fragrances (14 products)
  ('Lattafa Yara', 'Lattafa', 'Floral', 240, '50ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816481751-lattafa-yara-parfum-50ml-unisex.jpg'),
  ('Dolce & Gabbana Dolores Pour Femme', 'Dolce & Gabbana', 'Floral', 1200, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816507799-dolce---gabbana-dolores-pour-femme-parfum-100ml-women.jpg'),
  ('Lacoste Her Confession', 'Lacoste', 'Floral', 400, '30ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816509854-lacoste-her-confession-parfum-30ml-women.jpg'),
  ('Emper Lady Presidente', 'Emper', 'Floral', 300, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816495779-emper-lady-presidente-parfum-100ml-women.jpg'),
  ('Jacques Yves Champ de Rose', 'Jacques Yves', 'Floral', 350, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816519447-jacques-yves-champ-de-rose-parfum-100ml-women.jpg'),
  ('Berries Weekend Pink edition', 'Berries', 'Fresh', 350, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816518115-berries-weekend-pink-edition-parfum-100ml-women.jpg'),
  ('Armaf Club de nuit Untold', 'Armaf', 'Woody', 420, '105ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816517200-armaf-club-de-nuit-untold-parfum-105ml-women.jpg'),
  ('Lalique Haya', 'Lalique', 'Floral', 900, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816488811-lalique-haya-parfum-100ml-women.jpg'),
  ('Lattafa Eclaire', 'Lattafa', 'Floral', 350, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816498379-lattafa-eclaire-parfum-100ml-women.jpg'),
  ('NUDO Sweet Berries', 'NUDO', 'Fresh', 250, '50ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816512206-nudo-sweet-berries-parfum-50ml-women.jpg'),
  ('Rodriguez for her', 'Rodriguez', 'Floral', 350, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816516293-rodriguez-for-her-parfum-100ml-women.jpg'),
  ('Rave NOW Women', 'Rave', 'Fresh', 350, '100ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816477067-rave-now-women-parfum-100ml-women.jpg'),
  ('Ophylia Ophylia', 'Ophylia', 'Floral', 320, '80ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816515343-ophylia-ophylia-parfum-80ml-women.jpg'),
  ('Melina Melina For Women', 'Melina', 'Floral', 320, '80ml', 'women', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816502042-melina-melina-for-women-parfum-80ml-women.jpg'),
  
  -- Men's Fragrances (8 products)
  ('Emper Genius Ranger', 'Emper', 'Woody', 300, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816510782-emper-genius-ranger-parfum-100ml-men.jpg'),
  ('Maison Alhambra The Tux', 'Maison Alhambra', 'Woody', 480, '90ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816480305-maison-alhambra-the-tux-parfum-90ml-men.jpg'),
  ('Lattafa Maahir', 'Lattafa', 'Woody', 350, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816513875-lattafa-maahir-parfum-100ml-men.jpg'),
  ('Lattafa Ameer Al Oudh', 'Lattafa', 'Oriental', 350, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816508782-lattafa-ameer-al-oudh-parfum-100ml-men.jpg'),
  ('Lattafa Qaed Al Fursan', 'Lattafa', 'Woody', 330, '90ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816492048-lattafa-qaed-al-fursan-parfum-90ml-men.jpg'),
  ('Lattafa Ansaam Gold', 'Lattafa', 'Oriental', 350, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816499396-lattafa-ansaam-gold-parfum-100ml-men.jpg'),
  ('Oud Al Layl Oud Al Layl', 'Oud Al Layl', 'Oriental', 350, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816505704-oud-al-layl-oud-al-layl-parfum-100ml-men.jpg'),
  ('Mousquetaire Mousquetaire', 'Mousquetaire', 'Woody', 350, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816506708-mousquetaire-mousquetaire-parfum-100ml-men.jpg'),
  ('Legend Eau de Toilette for Man', 'Legend', 'Woody', 280, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816500966-legend-eau-de-toilette-for-man-edt-100ml-men.jpg'),
  ('Nebras Lattafa Pride', 'Nebras', 'Woody', 350, '100ml', 'men', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816489949-nebras-lattafa-pride-parfum-100ml-men.jpg'),
  
  -- Unisex Fragrances (11 products)
  ('Barakkat Rouge 540', 'Barakkat', 'Oriental', 680, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816478688-barakkat-rouge-540-extrait-de-parfum-100ml-unisex.jpg'),
  ('Lattafa Ajwad', 'Lattafa', 'Oriental', 350, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816503092-lattafa-ajwad-parfum-100ml-unisex.jpg'),
  ('Lattafa BADEE AL OUD', 'Lattafa', 'Oriental', 350, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816486343-lattafa-badee-al-oud-parfum-100ml-unisex.jpg'),
  ('Lattafa Oud for Glory', 'Lattafa', 'Oriental', 350, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816504650-lattafa-oud-for-glory-parfum-100ml-unisex.jpg'),
  ('Lattafa Opulent Musk', 'Lattafa', 'Oriental', 350, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816520627-lattafa-opulent-musk-parfum-100ml-unisex.jpg'),
  ('Just عنابي', 'Just', 'Oriental', 350, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816491019-just-------parfum-100ml-unisex.jpg'),
  ('Barakkat satin oud', 'Barakkat', 'Oriental', 450, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816487752-barakkat-satin-oud-parfum-100ml-unisex.jpg'),
  ('Midnight OUD Midnight OUD', 'Midnight OUD', 'Oriental', 350, '100ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816482816-midnight-oud-midnight-oud-parfum-100ml-unisex.jpg'),
  ('Oud Isphahan Eau de Parfum', 'Oud Isphahan', 'Oriental', 320, '80ml', 'unisex', 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816485236-oud-isphahan-eau-de-parfum-parfum-80ml-unisex.jpg')
) AS product_data(name, brand, category, price, size, gender, image_url)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  gender = EXCLUDED.gender,
  main_image_url = EXCLUDED.main_image_url,
  is_active = true;

-- Add some products on sale (with compare_at_price)
UPDATE products 
SET compare_at_price = price * 1.2
WHERE name IN (
  'Barakkat Rouge 540',
  'Dolce & Gabbana Dolores Pour Femme',
  'Lalique Haya',
  'Maison Alhambra The Tux'
);