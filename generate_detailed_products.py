import json
import csv

# Read the product list
with open('/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images/product_list.json', 'r') as f:
    products = json.load(f)

# Define product descriptions based on brand and characteristics
def generate_description(product):
    brand = product['brand']
    name = product['product']
    type_perfume = product['type']
    size = product['size']
    gender = product['gender']
    
    # Base descriptions by brand
    brand_descriptions = {
        'Lattafa': 'A masterpiece from the prestigious Arabic perfume house Lattafa, known for their long-lasting and luxurious fragrances.',
        'Barakkat': 'An exquisite creation from Barakkat, blending traditional Middle Eastern perfumery with modern sophistication.',
        'Emper': 'A contemporary fragrance from Emper, designed for the modern individual who appreciates quality and elegance.',
        'Armaf': 'A luxurious scent from Armaf, offering exceptional quality at an accessible price point.',
        'Dolce & Gabbana': 'An Italian masterpiece that embodies the passion and glamour of the Mediterranean lifestyle.',
        'Lacoste': 'A sophisticated fragrance that captures the sporty elegance and French savoir-vivre of the Lacoste brand.'
    }
    
    # Gender-specific descriptions
    gender_desc = {
        'Men': 'designed for the confident, modern man',
        'Women': 'created for the sophisticated, elegant woman',
        'Unisex': 'crafted to be enjoyed by all, transcending traditional gender boundaries'
    }
    
    # Type descriptions
    type_desc = {
        'Eau de Parfum': 'This Eau de Parfum offers excellent longevity and sillage',
        'Extrait De Parfum': 'This Extrait de Parfum provides the highest concentration for an intense, long-lasting experience',
        'EDT': 'This Eau de Toilette offers a lighter, refreshing experience perfect for daily wear'
    }
    
    # Special descriptions for specific products
    special_products = {
        'Yara': 'A sweet and fruity fragrance with notes of orchid, heliotrope, and gourmand accords. Perfect for those who love playful, feminine scents.',
        'ASAD': 'A powerful masculine fragrance inspired by the king of the jungle, featuring woody and amber notes with a modern twist.',
        'Rouge 540': 'An opulent fragrance with saffron, amberwood, and cedar notes, creating a unique and luxurious scent experience.',
        'Oud for Glory': 'A majestic blend of precious oud wood with spicy and woody notes, creating an unforgettable oriental fragrance.',
        'Club de Nuit Untold': 'A mysterious and seductive fragrance with floral and woody notes, perfect for evening occasions.',
        'Opulent Musk': 'A rich and sensual musk-based fragrance with warm, inviting notes that envelop the wearer in luxury.'
    }
    
    # Build description
    base_desc = brand_descriptions.get(brand, f'A premium fragrance from {brand}')
    
    if name in special_products:
        product_desc = special_products[name]
    else:
        product_desc = f'{name} is a captivating fragrance {gender_desc.get(gender, "")}.'
    
    type_info = type_desc.get(type_perfume, '')
    
    full_description = f"{base_desc} {product_desc} {type_info}, available in a {size}ml bottle."
    
    # Add fragrance family based on name patterns
    if 'Oud' in name or 'OUD' in name:
        full_description += " This oriental fragrance features the precious oud accord, beloved in Middle Eastern perfumery."
    elif 'Rose' in name or 'Floral' in name:
        full_description += " A beautiful floral composition that captures the essence of blooming gardens."
    elif 'Musk' in name:
        full_description += " Featuring warm musk notes that create an intimate and sensual aura."
    
    return full_description.strip()

# Generate detailed product catalog
detailed_products = []

for product in products:
    # Calculate suggested retail price based on brand and type
    base_prices = {
        'Lattafa': 350,
        'Barakkat': 450,
        'Emper': 300,
        'Armaf': 400,
        'Dolce & Gabbana': 1200,
        'Lacoste': 800,
        'Maison Alhambra': 500,
        'Lalique': 900
    }
    
    base_price = base_prices.get(product['brand'], 350)
    
    # Adjust for size
    size_multiplier = {
        '30': 0.5,
        '50': 0.7,
        '80': 0.9,
        '90': 0.95,
        '100': 1.0,
        '105': 1.05
    }
    
    multiplier = size_multiplier.get(product['size'], 1.0)
    
    # Adjust for type
    if product['type'] == 'Extrait De Parfum':
        multiplier *= 1.5
    elif product['type'] == 'EDT':
        multiplier *= 0.8
    
    suggested_price = round(base_price * multiplier, -1)  # Round to nearest 10
    
    # Generate SKU
    brand_code = ''.join([word[0] for word in product['brand'].split()][:2]).upper()
    product_code = ''.join([word[0] for word in product['product'].split()][:3]).upper()
    sku = f"{brand_code}-{product_code}-{product['size']}"
    
    detailed_product = {
        'sku': sku,
        'brand': product['brand'],
        'product_name': product['product'],
        'full_name': f"{product['brand']} {product['product']}",
        'type': product['type'],
        'size_ml': int(product['size']) if product['size'] else 0,
        'gender': product['gender'],
        'description': generate_description(product),
        'short_description': f"{product['brand']} {product['product']} - {product['type']} {product['size']}ml",
        'suggested_price_zar': suggested_price,
        'category': f"{product['gender']}'s Fragrances" if product['gender'] != 'Unisex' else "Unisex Fragrances",
        'image_file': product['new_image'],
        'original_image': product['original_image'],
        'stock_quantity': 10,  # Default stock
        'is_featured': product['brand'] in ['Lattafa', 'Dolce & Gabbana', 'Armaf'],
        'meta_keywords': f"{product['brand']}, {product['product']}, {product['type']}, {product['gender']} perfume, South Africa",
        'meta_description': f"Buy {product['brand']} {product['product']} {product['type']} {product['size']}ml online at Perfume Oasis South Africa. Authentic fragrances with fast delivery."
    }
    
    detailed_products.append(detailed_product)

# Save detailed product catalog
with open('/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images/detailed_product_catalog.json', 'w') as f:
    json.dump(detailed_products, f, indent=2)

# Create CSV for easy viewing
csv_fields = ['sku', 'brand', 'product_name', 'full_name', 'type', 'size_ml', 'gender', 
              'suggested_price_zar', 'category', 'stock_quantity', 'is_featured', 
              'image_file', 'short_description']

with open('/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images/detailed_product_catalog.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=csv_fields)
    writer.writeheader()
    for product in detailed_products:
        writer.writerow({field: product[field] for field in csv_fields})

# Create SQL insert statements
with open('/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images/product_import.sql', 'w') as f:
    f.write("-- Product Import SQL for Perfume Oasis\n")
    f.write("-- Generated from analyzed perfume images\n\n")
    
    for product in detailed_products:
        # Escape single quotes in text fields
        desc = product['description'].replace("'", "''")
        short_desc = product['short_description'].replace("'", "''")
        
        sql = f"""
INSERT INTO products (
    name, slug, description, short_description, sku,
    brand_id, category_id, price, volume_ml, concentration,
    gender, stock_quantity, is_featured, is_active,
    meta_title, meta_description
) VALUES (
    '{product['full_name']}',
    '{product['full_name'].lower().replace(' ', '-').replace('&', 'and')}',
    '{desc}',
    '{short_desc}',
    '{product['sku']}',
    (SELECT id FROM brands WHERE name = '{product['brand']}' LIMIT 1),
    (SELECT id FROM categories WHERE name = '{product['category']}' LIMIT 1),
    {product['suggested_price_zar']},
    {product['size_ml']},
    '{product['type']}',
    '{product['gender']}',
    {product['stock_quantity']},
    {str(product['is_featured']).lower()},
    true,
    '{product['full_name']} | Perfume Oasis South Africa',
    '{product['meta_description']}'
);
"""
        f.write(sql)

print("Detailed product analysis complete!")
print(f"Generated {len(detailed_products)} product entries with:")
print("- Full descriptions")
print("- Suggested pricing in ZAR")
print("- SKUs")
print("- Meta data for SEO")
print("- SQL import statements")
