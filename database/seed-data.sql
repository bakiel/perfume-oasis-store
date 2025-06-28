-- Seed data for Perfume Oasis
-- This script populates the database with initial data

-- Insert Categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
    ('Men''s Fragrances', 'mens-fragrances', 'Sophisticated scents for the modern gentleman', 1, true),
    ('Women''s Fragrances', 'womens-fragrances', 'Elegant perfumes for the contemporary woman', 2, true),
    ('Unisex Fragrances', 'unisex-fragrances', 'Versatile scents that transcend gender', 3, true),
    ('Exclusive Collections', 'exclusive-collections', 'Limited edition and rare fragrances', 4, true),
    ('Gift Sets', 'gift-sets', 'Perfectly curated fragrance gift sets', 5, true),
    ('Travel Size', 'travel-size', 'Convenient sizes for on-the-go', 6, true),
    ('Body Care', 'body-care', 'Luxurious body lotions and shower gels', 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Brands
INSERT INTO brands (name, slug, description, country, is_featured, is_active) VALUES
    ('Chanel', 'chanel', 'Timeless elegance and French sophistication', 'France', true, true),
    ('Dior', 'dior', 'Luxury and innovation in perfumery', 'France', true, true),
    ('Tom Ford', 'tom-ford', 'Bold and luxurious American fragrances', 'USA', true, true),
    ('Creed', 'creed', 'Royal heritage and artisanal craftsmanship', 'UK', true, true),
    ('Jo Malone', 'jo-malone', 'British elegance with unexpected combinations', 'UK', false, true),
    ('Hermès', 'hermes', 'French luxury and refined simplicity', 'France', false, true),
    ('Byredo', 'byredo', 'Contemporary Swedish fragrance artistry', 'Sweden', false, true),
    ('Le Labo', 'le-labo', 'Handcrafted fragrances with soul', 'USA', false, true),
    ('Maison Francis Kurkdjian', 'maison-francis-kurkdjian', 'Haute parfumerie at its finest', 'France', true, true),
    ('Penhaligon''s', 'penhaligons', 'British eccentricity since 1870', 'UK', false, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Products
WITH brand_ids AS (
    SELECT id, slug FROM brands
),
category_ids AS (
    SELECT id, slug FROM categories
)
INSERT INTO products (
    sku, name, slug, brand_id, category_id, description, short_description,
    concentration, size, gender, top_notes, middle_notes, base_notes,
    price, compare_at_price, cost, stock_quantity, low_stock_threshold,
    main_image_url, is_active, is_featured
) VALUES
    -- Chanel Products
    (
        'CHAN-N5-EDP-100',
        'Chanel N°5 Eau de Parfum',
        'chanel-n5-eau-de-parfum-100ml',
        (SELECT id FROM brand_ids WHERE slug = 'chanel'),
        (SELECT id FROM category_ids WHERE slug = 'womens-fragrances'),
        'The ultimate expression of femininity. A timeless, legendary fragrance in a radically simple bottle.',
        'An iconic fragrance with aldehydes and florals',
        'EDP', '100ml', 'Women',
        ARRAY['Aldehydes', 'Neroli', 'Ylang-Ylang'],
        ARRAY['Rose', 'Jasmine', 'Lily of the Valley'],
        ARRAY['Sandalwood', 'Vetiver', 'Vanilla'],
        3500, 3800, 2100, 25, 5,
        'https://images.unsplash.com/photo-1541643600914-78b084683601',
        true, true
    ),
    (
        'CHAN-BLEU-EDP-100',
        'Bleu de Chanel Eau de Parfum',
        'bleu-de-chanel-eau-de-parfum-100ml',
        (SELECT id FROM brand_ids WHERE slug = 'chanel'),
        (SELECT id FROM category_ids WHERE slug = 'mens-fragrances'),
        'A woody aromatic fragrance that embodies freedom with its strength and elegance.',
        'Fresh, clean, and profoundly sensual',
        'EDP', '100ml', 'Men',
        ARRAY['Lemon Zest', 'Mint', 'Pink Pepper'],
        ARRAY['Ginger', 'Nutmeg', 'Jasmine'],
        ARRAY['Sandalwood', 'Cedar', 'White Musk'],
        2800, 3000, 1680, 30, 5,
        'https://images.unsplash.com/photo-1587017539504-67cfbddac569',
        true, true
    ),
    -- Dior Products
    (
        'DIOR-SAUV-EDP-100',
        'Dior Sauvage Eau de Parfum',
        'dior-sauvage-eau-de-parfum-100ml',
        (SELECT id FROM brand_ids WHERE slug = 'dior'),
        (SELECT id FROM category_ids WHERE slug = 'mens-fragrances'),
        'A radically fresh composition, raw and noble all at once.',
        'The powerful freshness of Sauvage exuding sensual facets',
        'EDP', '100ml', 'Men',
        ARRAY['Bergamot', 'Mandarin'],
        ARRAY['Lavender', 'Star Anise', 'Nutmeg'],
        ARRAY['Ambroxan', 'Vanilla', 'Cedar'],
        2600, 2800, 1560, 40, 10,
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539',
        true, true
    ),
    (
        'DIOR-JADORE-EDP-100',
        'Dior J''adore Eau de Parfum',
        'dior-jadore-eau-de-parfum-100ml',
        (SELECT id FROM brand_ids WHERE slug = 'dior'),
        (SELECT id FROM category_ids WHERE slug = 'womens-fragrances'),
        'An iconic fragrance, J''adore is the absolute of femininity.',
        'A bouquet of the most beautiful flowers from around the world',
        'EDP', '100ml', 'Women',
        ARRAY['Mandarin', 'Champaca Flower'],
        ARRAY['Jasmine', 'Rose', 'Ylang-Ylang'],
        ARRAY['Sandalwood', 'Vanilla'],
        2900, 3100, 1740, 20, 5,
        'https://images.unsplash.com/photo-1590736969955-71cc94901144',
        true, false
    ),
    -- Tom Ford Products
    (
        'TF-BLACK-ORCH-EDP-100',
        'Tom Ford Black Orchid Eau de Parfum',
        'tom-ford-black-orchid-eau-de-parfum-100ml',
        (SELECT id FROM brand_ids WHERE slug = 'tom-ford'),
        (SELECT id FROM category_ids WHERE slug = 'unisex-fragrances'),
        'A luxurious and sensual fragrance of rich, dark accords and an alluring potion.',
        'Luxurious, mysterious, and infinitely seductive',
        'EDP', '100ml', 'Unisex',
        ARRAY['Black Truffle', 'Bergamot', 'Black Currant'],
        ARRAY['Black Orchid', 'Lotus Wood', 'Fruity Notes'],
        ARRAY['Patchouli', 'Sandalwood', 'Dark Chocolate', 'Vanilla'],
        3200, 3500, 1920, 15, 5,
        'https://images.unsplash.com/photo-1594035910387-fea47794261f',
        true, true
    ),
    (
        'TF-OSO-EDP-50',
        'Tom Ford Oud Wood Eau de Parfum',
        'tom-ford-oud-wood-eau-de-parfum-50ml',
        (SELECT id FROM brand_ids WHERE slug = 'tom-ford'),
        (SELECT id FROM category_ids WHERE slug = 'unisex-fragrances'),
        'A pioneering composition of exotic woods and spices.',
        'Rare oud wood, sandalwood, and Chinese pepper',
        'EDP', '50ml', 'Unisex',
        ARRAY['Oud', 'Brazilian Rosewood', 'Cardamom'],
        ARRAY['Sichuan Pepper', 'Vetiver'],
        ARRAY['Sandalwood', 'Tonka Bean', 'Amber'],
        2800, 3000, 1680, 10, 3,
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3',
        true, false
    ),
    -- Creed Products
    (
        'CREED-AVENT-EDP-100',
        'Creed Aventus Eau de Parfum',
        'creed-aventus-eau-de-parfum-100ml',
        (SELECT id FROM brand_ids WHERE slug = 'creed'),
        (SELECT id FROM category_ids WHERE slug = 'mens-fragrances'),
        'Celebrating strength, vision, and success, Aventus is the ideal scent for the sophisticated modern man.',
        'A sophisticated scent for individuals who savor a life well-lived',
        'EDP', '100ml', 'Men',
        ARRAY['Pineapple', 'Bergamot', 'Black Currant', 'Apple'],
        ARRAY['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'],
        ARRAY['Musk', 'Oak Moss', 'Ambergris', 'Vanilla'],
        6500, 7000, 3900, 8, 3,
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f',
        true, true
    ),
    -- Jo Malone Products
    (
        'JM-LIME-COL-100',
        'Jo Malone Lime Basil & Mandarin Cologne',
        'jo-malone-lime-basil-mandarin-cologne-100ml',
        (SELECT id FROM brand_ids WHERE slug = 'jo-malone'),
        (SELECT id FROM category_ids WHERE slug = 'unisex-fragrances'),
        'A modern classic. Peppery basil and aromatic white thyme bring an unexpected twist.',
        'Caribbean-inspired with a contemporary twist',
        'EDC', '100ml', 'Unisex',
        ARRAY['Lime', 'Mandarin', 'Bergamot'],
        ARRAY['Basil', 'White Thyme', 'Iris'],
        ARRAY['Patchouli', 'Vetiver', 'Amberwood'],
        2200, 2400, 1320, 35, 10,
        'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
        true, false
    ),
    -- MFK Products
    (
        'MFK-BR540-EDP-70',
        'Maison Francis Kurkdjian Baccarat Rouge 540 Eau de Parfum',
        'mfk-baccarat-rouge-540-eau-de-parfum-70ml',
        (SELECT id FROM brand_ids WHERE slug = 'maison-francis-kurkdjian'),
        (SELECT id FROM category_ids WHERE slug = 'exclusive-collections'),
        'An ethereal and sophisticated signature scent with exceptional trail and tenacity.',
        'Luminous and sophisticated amber woody fragrance',
        'EDP', '70ml', 'Unisex',
        ARRAY['Saffron', 'Jasmine'],
        ARRAY['Amberwood', 'Ambergris'],
        ARRAY['Fir Resin', 'Cedar'],
        5800, 6200, 3480, 5, 2,
        'https://images.unsplash.com/photo-1542038374195-026dabc7c0c3',
        true, true
    ),
    -- Gift Set
    (
        'GIFT-DISCOVERY-SET-5',
        'Luxury Discovery Set - 5 Fragrances',
        'luxury-discovery-set-5-fragrances',
        NULL,
        (SELECT id FROM category_ids WHERE slug = 'gift-sets'),
        'Explore our curated selection of 5 luxury fragrances in convenient travel sizes. Perfect for discovering your signature scent.',
        'A journey through luxury perfumery',
        'Mixed', '5 x 10ml', 'Unisex',
        NULL, NULL, NULL,
        1500, 1800, 900, 20, 5,
        'https://images.unsplash.com/photo-1610461888750-10bfc601b874',
        true, true
    );

-- Insert product images for featured products
INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES
    ((SELECT id FROM products WHERE sku = 'CHAN-N5-EDP-100'), 'https://images.unsplash.com/photo-1541643600914-78b084683601', 'Chanel N°5 bottle', 0),
    ((SELECT id FROM products WHERE sku = 'CHAN-BLEU-EDP-100'), 'https://images.unsplash.com/photo-1587017539504-67cfbddac569', 'Bleu de Chanel bottle', 0),
    ((SELECT id FROM products WHERE sku = 'DIOR-SAUV-EDP-100'), 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539', 'Dior Sauvage bottle', 0),
    ((SELECT id FROM products WHERE sku = 'TF-BLACK-ORCH-EDP-100'), 'https://images.unsplash.com/photo-1594035910387-fea47794261f', 'Tom Ford Black Orchid bottle', 0),
    ((SELECT id FROM products WHERE sku = 'CREED-AVENT-EDP-100'), 'https://images.unsplash.com/photo-1523293182086-7651a899d37f', 'Creed Aventus bottle', 0),
    ((SELECT id FROM products WHERE sku = 'MFK-BR540-EDP-70'), 'https://images.unsplash.com/photo-1542038374195-026dabc7c0c3', 'Baccarat Rouge 540 bottle', 0);

-- Insert sample admin user (password: admin123)
-- Note: In production, use proper password hashing through Supabase Auth
INSERT INTO admin_users (id, role, permissions, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'super_admin', '{"all": true}', true)
ON CONFLICT (id) DO NOTHING;