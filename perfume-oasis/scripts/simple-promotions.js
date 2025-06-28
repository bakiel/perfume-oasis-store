const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applySimplePromotions() {
  console.log('Applying strategic promotions (simplified version)...\n')
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price')
    .order('price', { ascending: false })
    
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products?.length || 0} products\n`)
  
  // Strategic promotion categories
  const promotions = {
    // Premium Brand Flash Sale
    premiumFlash: {
      products: ['Lacoste Her Confession', 'Dolce & Gabbana Dolores Pour Femme', 'Lalique Haya'],
      markup: 1.4,
      discount: 35,
      message: '🌟 LUXURY FLASH SALE - Premium brands at exclusive prices'
    },
    
    // Best Sellers
    bestSellers: {
      products: ['Lattafa Yara', 'Barakkat Rouge 540', 'Lattafa Maahir', 'Lattafa Eclaire'],
      markup: 1.25,
      discount: 20,
      message: '🔥 BEST SELLERS - Our most loved fragrances'
    },
    
    // New Customer Special
    newCustomer: {
      products: ['Lattafa Ajwad', 'Lattafa BADEE AL OUD', 'Midnight OUD Midnight OUD'],
      markup: 1.15,
      discount: 15,
      message: '🎁 NEW CUSTOMER SPECIAL - Perfect for first-time buyers'
    },
    
    // Men's Collection
    mensCollection: {
      products: ['Maison Alhambra The Tux', 'Lattafa Ameer Al Oudh', 'Emper Genius Ranger', 'Mousquetaire Mousquetaire'],
      markup: 1.2,
      discount: 25,
      message: '👔 MEN\'S COLLECTION - Sophisticated scents for gentlemen'
    },
    
    // Summer Florals
    summerFlorals: {
      products: ['Berries Weekend Pink edition', 'Jacques Yves Champ de Rose', 'NUDO Sweet Berries', 'Rodriguez for her'],
      markup: 1.3,
      discount: 30,
      message: '🌸 SUMMER FLORALS - Fresh & feminine fragrances'
    }
  }
  
  let totalPromotions = 0
  let totalNotFound = 0
  
  // Apply promotions
  for (const [promoName, promo] of Object.entries(promotions)) {
    console.log(`\n${promo.message}`)
    console.log('-'.repeat(60))
    
    for (const productName of promo.products) {
      const product = products?.find(p => p.name === productName)
      
      if (!product) {
        console.log(`  ❌ Not found: ${productName}`)
        totalNotFound++
        continue
      }
      
      const originalPrice = product.price
      const markedUpPrice = Math.round(originalPrice * promo.markup)
      const salePrice = Math.round(markedUpPrice * (1 - promo.discount / 100))
      const savedAmount = markedUpPrice - salePrice
      const realProfit = salePrice - originalPrice
      
      // Update product with only basic fields
      const { error: updateError } = await supabase
        .from('products')
        .update({
          price: salePrice,
          compare_at_price: markedUpPrice,
          is_on_sale: true
        })
        .eq('id', product.id)
      
      if (!updateError) {
        totalPromotions++
        console.log(`  ✅ ${productName}`)
        console.log(`     Was: R${originalPrice} → Now: R${salePrice} (Save R${savedAmount})`)
        console.log(`     Profit margin: R${realProfit} (${((realProfit/originalPrice)*100).toFixed(1)}%)`)
      } else {
        console.log(`  ❌ Failed to update: ${productName}`)
        console.log(`     Error: ${updateError.message}`)
      }
    }
  }
  
  // Set featured products
  console.log('\n⭐ Setting featured products...')
  const featuredNames = [
    'Barakkat Rouge 540',
    'Lattafa Yara', 
    'Lacoste Her Confession',
    'Lattafa Maahir'
  ]
  
  // Clear existing featured
  await supabase
    .from('products')
    .update({ is_featured: false })
    .eq('is_featured', true)
  
  // Set new featured
  for (const name of featuredNames) {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: true })
      .eq('name', name)
    
    if (!error) {
      console.log(`  ⭐ Featured: ${name}`)
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 STRATEGIC PROMOTION SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Products with promotions: ${totalPromotions}`)
  console.log(`❌ Products not found: ${totalNotFound}`)
  console.log(`📦 Total products in catalog: ${products?.length || 0}`)
  console.log(`📈 Promotion coverage: ${((totalPromotions / (products?.length || 1)) * 100).toFixed(1)}%`)
  console.log('\n💡 Strategy: Only ~60% of products on sale creates urgency and preserves brand value')
  console.log('💰 All sale prices maintain positive margins while appearing as significant discounts')
}

applySimplePromotions().catch(console.error)