const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function restoreProducts() {
  console.log('Restoring products from last working state...')
  
  // First ensure brands exist
  const brands = [
    'Lattafa', 'Barakkat', 'Dolce & Gabbana', 'Lacoste', 'Emper',
    'Jacques Yves', 'Berries', 'Armaf', 'Maison Alhambra', 'Lalique',
    'Just', 'Oud Al Layl', 'Midnight OUD', 'NUDO', 'Rodriguez',
    'Rave', 'Ophylia', 'Mousquetaire', 'Melina', 'Legend',
    'Oud Isphahan', 'Nebras'
  ]
  
  for (const brand of brands) {
    await supabase.from('brands').upsert({ 
      name: brand, 
      slug: brand.toLowerCase().replace(/ /g, '-') 
    }, { onConflict: 'name' })
  }
  
  // Ensure categories exist
  const categories = ['Oriental', 'Floral', 'Woody', 'Fresh', 'Citrus', 'Gourmand']
  
  for (const category of categories) {
    await supabase.from('categories').upsert({ 
      name: category, 
      slug: category.toLowerCase() 
    }, { onConflict: 'name' })
  }
  
  // Get brand and category IDs
  const { data: brandData } = await supabase.from('brands').select('id, name')
  const { data: categoryData } = await supabase.from('categories').select('id, name')
  
  const brandMap = {}
  const categoryMap = {}
  
  brandData.forEach(b => brandMap[b.name] = b.id)
  categoryData.forEach(c => categoryMap[c.name] = c.id)
  
  // Products to restore (the 33 we had with real images)
  const products = [
    { name: 'Lattafa Yara', brand: 'Lattafa', category: 'Floral', price: 240, size: '50ml', gender: 'women' },
    { name: 'Barakkat Rouge 540', brand: 'Barakkat', category: 'Oriental', price: 680, size: '100ml', gender: 'unisex' },
    { name: 'Dolce & Gabbana Dolores Pour Femme', brand: 'Dolce & Gabbana', category: 'Floral', price: 1200, size: '100ml', gender: 'women' },
    { name: 'Lacoste Her Confession', brand: 'Lacoste', category: 'Floral', price: 400, size: '30ml', gender: 'women' },
    { name: 'Emper Lady Presidente', brand: 'Emper', category: 'Floral', price: 300, size: '100ml', gender: 'women' },
    { name: 'Emper Genius Ranger', brand: 'Emper', category: 'Woody', price: 300, size: '100ml', gender: 'men' },
    { name: 'Jacques Yves Champ de Rose', brand: 'Jacques Yves', category: 'Floral', price: 350, size: '100ml', gender: 'women' },
    { name: 'Berries Weekend Pink edition', brand: 'Berries', category: 'Fresh', price: 350, size: '100ml', gender: 'women' },
    { name: 'Armaf Club de nuit Untold', brand: 'Armaf', category: 'Woody', price: 420, size: '105ml', gender: 'women' },
    { name: 'Maison Alhambra The Tux', brand: 'Maison Alhambra', category: 'Woody', price: 480, size: '90ml', gender: 'men' },
    { name: 'Lalique Haya', brand: 'Lalique', category: 'Floral', price: 900, size: '100ml', gender: 'women' },
    { name: 'Lattafa Maahir', brand: 'Lattafa', category: 'Woody', price: 350, size: '100ml', gender: 'men' },
    { name: 'Lattafa Eclaire', brand: 'Lattafa', category: 'Floral', price: 350, size: '100ml', gender: 'women' },
    { name: 'Lattafa Ajwad', brand: 'Lattafa', category: 'Oriental', price: 350, size: '100ml', gender: 'unisex' },
    { name: 'Lattafa BADEE AL OUD', brand: 'Lattafa', category: 'Oriental', price: 350, size: '100ml', gender: 'unisex' },
    { name: 'Lattafa Ameer Al Oudh', brand: 'Lattafa', category: 'Oriental', price: 350, size: '100ml', gender: 'men' },
    { name: 'Lattafa Qaed Al Fursan', brand: 'Lattafa', category: 'Woody', price: 330, size: '90ml', gender: 'men' },
    { name: 'Lattafa Ansaam Gold', brand: 'Lattafa', category: 'Oriental', price: 350, size: '100ml', gender: 'men' },
    { name: 'Lattafa Oud for Glory', brand: 'Lattafa', category: 'Oriental', price: 350, size: '100ml', gender: 'unisex' },
    { name: 'Lattafa Opulent Musk', brand: 'Lattafa', category: 'Oriental', price: 350, size: '100ml', gender: 'unisex' },
    { name: 'Just عنابي', brand: 'Just', category: 'Oriental', price: 350, size: '100ml', gender: 'unisex' },
    { name: 'Barakkat satin oud', brand: 'Barakkat', category: 'Oriental', price: 450, size: '100ml', gender: 'unisex' },
    { name: 'Oud Al Layl Oud Al Layl', brand: 'Oud Al Layl', category: 'Oriental', price: 350, size: '100ml', gender: 'men' },
    { name: 'Midnight OUD Midnight OUD', brand: 'Midnight OUD', category: 'Oriental', price: 350, size: '100ml', gender: 'unisex' },
    { name: 'NUDO Sweet Berries', brand: 'NUDO', category: 'Fresh', price: 250, size: '50ml', gender: 'women' },
    { name: 'Rodriguez for her', brand: 'Rodriguez', category: 'Floral', price: 350, size: '100ml', gender: 'women' },
    { name: 'Rave NOW Women', brand: 'Rave', category: 'Fresh', price: 350, size: '100ml', gender: 'women' },
    { name: 'Ophylia Ophylia', brand: 'Ophylia', category: 'Floral', price: 320, size: '80ml', gender: 'women' },
    { name: 'Mousquetaire Mousquetaire', brand: 'Mousquetaire', category: 'Woody', price: 350, size: '100ml', gender: 'men' },
    { name: 'Melina Melina For Women', brand: 'Melina', category: 'Floral', price: 320, size: '80ml', gender: 'women' },
    { name: 'Legend Eau de Toilette for Man', brand: 'Legend', category: 'Woody', price: 280, size: '100ml', gender: 'men' },
    { name: 'Oud Isphahan Eau de Parfum', brand: 'Oud Isphahan', category: 'Oriental', price: 320, size: '80ml', gender: 'unisex' },
    { name: 'Nebras Lattafa Pride', brand: 'Nebras', category: 'Woody', price: 350, size: '100ml', gender: 'men' }
  ]
  
  // Image URLs mapping
  const imageUrls = {
    'Lattafa Yara': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816481751-lattafa-yara-parfum-50ml-unisex.jpg',
    'Barakkat Rouge 540': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816478688-barakkat-rouge-540-extrait-de-parfum-100ml-unisex.jpg',
    'Barakkat satin oud': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816487752-barakkat-satin-oud-parfum-100ml-unisex.jpg',
    'Berries Weekend Pink edition': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816518115-berries-weekend-pink-edition-parfum-100ml-women.jpg',
    'Dolce & Gabbana Dolores Pour Femme': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816507799-dolce---gabbana-dolores-pour-femme-parfum-100ml-women.jpg',
    'Emper Genius Ranger': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816510782-emper-genius-ranger-parfum-100ml-men.jpg',
    'Emper Lady Presidente': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816495779-emper-lady-presidente-parfum-100ml-women.jpg',
    'Jacques Yves Champ de Rose': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816519447-jacques-yves-champ-de-rose-parfum-100ml-women.jpg',
    'Just عنابي': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816491019-just-------parfum-100ml-unisex.jpg',
    'Lacoste Her Confession': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816509854-lacoste-her-confession-parfum-30ml-women.jpg',
    'Lalique Haya': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816488811-lalique-haya-parfum-100ml-women.jpg',
    'Lattafa Ajwad': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816503092-lattafa-ajwad-parfum-100ml-unisex.jpg',
    'Lattafa Ameer Al Oudh': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816508782-lattafa-ameer-al-oudh-parfum-100ml-men.jpg',
    'Lattafa Ansaam Gold': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816499396-lattafa-ansaam-gold-parfum-100ml-men.jpg',
    'Lattafa BADEE AL OUD': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816486343-lattafa-badee-al-oud-parfum-100ml-unisex.jpg',
    'Lattafa Eclaire': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816498379-lattafa-eclaire-parfum-100ml-women.jpg',
    'Lattafa Maahir': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816513875-lattafa-maahir-parfum-100ml-men.jpg',
    'Lattafa Opulent Musk': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816520627-lattafa-opulent-musk-parfum-100ml-unisex.jpg',
    'Lattafa Oud for Glory': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816504650-lattafa-oud-for-glory-parfum-100ml-unisex.jpg',
    'Lattafa Qaed Al Fursan': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816492048-lattafa-qaed-al-fursan-parfum-90ml-men.jpg',
    'Legend Eau de Toilette for Man': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816500966-legend-eau-de-toilette-for-man-edt-100ml-men.jpg',
    'Maison Alhambra The Tux': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816480305-maison-alhambra-the-tux-parfum-90ml-men.jpg',
    'Melina Melina For Women': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816502042-melina-melina-for-women-parfum-80ml-women.jpg',
    'Midnight OUD Midnight OUD': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816482816-midnight-oud-midnight-oud-parfum-100ml-unisex.jpg',
    'Mousquetaire Mousquetaire': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816506708-mousquetaire-mousquetaire-parfum-100ml-men.jpg',
    'Nebras Lattafa Pride': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816489949-nebras-lattafa-pride-parfum-100ml-men.jpg',
    'NUDO Sweet Berries': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816512206-nudo-sweet-berries-parfum-50ml-women.jpg',
    'Ophylia Ophylia': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816515343-ophylia-ophylia-parfum-80ml-women.jpg',
    'Oud Al Layl Oud Al Layl': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816505704-oud-al-layl-oud-al-layl-parfum-100ml-men.jpg',
    'Oud Isphahan Eau de Parfum': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816485236-oud-isphahan-eau-de-parfum-parfum-80ml-unisex.jpg',
    'Rave NOW Women': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816477067-rave-now-women-parfum-100ml-women.jpg',
    'Rodriguez for her': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816516293-rodriguez-for-her-parfum-100ml-women.jpg',
    'Armaf Club de nuit Untold': 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816517200-armaf-club-de-nuit-untold-parfum-105ml-women.jpg'
  }
  
  // Insert products
  for (const product of products) {
    const sku = `PO-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase()
    const slug = product.name.toLowerCase().replace(/ /g, '-')
    
    const { error } = await supabase.from('products').insert({
      sku,
      name: product.name,
      slug,
      brand_id: brandMap[product.brand],
      category_id: categoryMap[product.category],
      price: product.price,
      size: product.size,
      gender: product.gender,
      main_image_url: imageUrls[product.name] || 'https://via.placeholder.com/400',
      stock_quantity: 50,
      is_active: true,
      concentration: 'Eau de Parfum'
    })
    
    if (!error) {
      console.log(`✓ Imported: ${product.name}`)
    } else {
      console.error(`✗ Failed: ${product.name}`, error.message)
    }
  }
  
  console.log('\n✅ Products restored successfully!')
}

restoreProducts().catch(console.error)