const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixDataAndPromotions() {
  console.log('🚀 Starting comprehensive data fix...\n')
  
  // First check if we have products
  const { data: existingProducts, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
  
  console.log(`Current products in database: ${count || 0}\n`)
  
  // If we have products, just fix them
  if (count && count > 0) {
    console.log('📝 Updating existing products...\n')
    
    // Fix gender values (ensure lowercase)
    const genderFixes = {
      'Women': 'women',
      'women': 'women',
      'Men': 'men',
      'men': 'men',
      'Unisex': 'unisex',
      'unisex': 'unisex'
    }
    
    for (const product of existingProducts) {
      const updates = {}
      
      // Fix gender
      if (product.gender && genderFixes[product.gender]) {
        updates.gender = genderFixes[product.gender]
      }
      
      // Apply promotions based on product name
      const promotions = {
        'Lacoste Her Confession': { markup: 1.4, discount: 35 },
        'Dolce & Gabbana Dolores Pour Femme': { markup: 1.4, discount: 35 },
        'Lalique Haya': { markup: 1.4, discount: 35 },
        'Lattafa Yara': { markup: 1.25, discount: 20 },
        'Barakkat Rouge 540': { markup: 1.25, discount: 20 },
        'Lattafa Maahir': { markup: 1.25, discount: 20 },
        'Lattafa Eclaire': { markup: 1.25, discount: 20 },
        'Berries Weekend Pink edition': { markup: 1.3, discount: 30 },
        'Jacques Yves Champ de Rose': { markup: 1.3, discount: 30 },
        'NUDO Sweet Berries': { markup: 1.3, discount: 30 },
        'Rodriguez for her': { markup: 1.3, discount: 30 }
      }
      
      if (promotions[product.name]) {
        const promo = promotions[product.name]
        updates.compare_at_price = Math.round(product.price * promo.markup)
      }
      
      // Set featured products
      const featuredNames = ['Barakkat Rouge 540', 'Lattafa Yara', 'Lacoste Her Confession', 'Lattafa Maahir']
      updates.is_featured = featuredNames.includes(product.name)
      
      // Update product
      if (Object.keys(updates).length > 0) {
        await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id)
        
        console.log(`✓ Updated: ${product.name}`)
      }
    }
  } else {
    console.log('❌ No products found. Run restore-all-products.js first!')
    return
  }
  
  // Check results
  console.log('\n📊 Checking results...\n')
  
  const { data: genderCounts } = await supabase
    .from('products')
    .select('gender')
  
  const genderSummary = {}
  genderCounts?.forEach(p => {
    genderSummary[p.gender] = (genderSummary[p.gender] || 0) + 1
  })
  
  console.log('Gender distribution:')
  Object.entries(genderSummary).forEach(([gender, count]) => {
    console.log(`  ${gender}: ${count} products`)
  })
  
  const { data: promoCount } = await supabase
    .from('products')
    .select('id')
    .not('compare_at_price', 'is', null)
  
  console.log(`\n✅ Products with promotions: ${promoCount?.length || 0}`)
  
  const { data: featuredCount } = await supabase
    .from('products')
    .select('id')
    .eq('is_featured', true)
  
  console.log(`✅ Featured products: ${featuredCount?.length || 0}`)
  
  console.log('\n🎉 Data fix complete!')
}

fixDataAndPromotions().catch(console.error)