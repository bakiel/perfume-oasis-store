const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function freshRestore() {
  console.log('Starting fresh product restore...\n')
  
  // First, clear existing products
  console.log('Clearing existing products...')
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  
  if (deleteError) {
    console.error('Error clearing products:', deleteError)
  }
  
  // Sample products for testing
  const testProducts = [
    {
      name: 'Lattafa Yara',
      brand: 'Lattafa',
      category: 'Floral',
      price: 240,
      compare_at_price: 300,
      size: '50ml',
      gender: 'women',
      main_image_url: 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816481751-lattafa-yara-parfum-50ml-unisex.jpg'
    },
    {
      name: 'Barakkat Rouge 540',
      brand: 'Barakkat',
      category: 'Oriental',
      price: 680,
      compare_at_price: 850,
      size: '100ml',
      gender: 'unisex',
      main_image_url: 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816478688-barakkat-rouge-540-extrait-de-parfum-100ml-unisex.jpg'
    }
  ]
  
  // Get brand and category IDs
  const { data: brands } = await supabase.from('brands').select('id, name')
  const { data: categories } = await supabase.from('categories').select('id, name')
  
  console.log(`Found ${brands?.length || 0} brands and ${categories?.length || 0} categories\n`)
  
  // Insert test products
  for (const product of testProducts) {
    const brandId = brands?.find(b => b.name === product.brand)?.id
    const categoryId = categories?.find(c => c.name === product.category)?.id
    
    if (!brandId || !categoryId) {
      console.log(`⚠️  Skipping ${product.name} - missing brand or category`)
      continue
    }
    
    const productData = {
      sku: `PO-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
      name: product.name,
      slug: product.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
      brand_id: brandId,
      category_id: categoryId,
      price: product.price,
      compare_at_price: product.compare_at_price,
      main_image_url: product.main_image_url,
      size: product.size,
      gender: product.gender,
      stock_quantity: 50,
      is_active: true,
      is_featured: true,
      concentration: 'Eau de Parfum',
      description: `Premium ${product.name} fragrance`,
      short_description: `${product.name} - ${product.size}`
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
    
    if (error) {
      console.error(`❌ Failed to insert ${product.name}:`, error.message)
    } else {
      console.log(`✅ Inserted ${product.name}`)
    }
  }
  
  // Verify products were inserted
  const { data: finalCount } = await supabase
    .from('products')
    .select('id', { count: 'exact' })
  
  console.log(`\nTotal products in database: ${finalCount?.length || 0}`)
}

freshRestore().catch(console.error)