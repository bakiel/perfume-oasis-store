const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyBasicPromotions() {
  console.log('Applying strategic promotions to products...\n')
  
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
    premiumFlash: {
      products: ['Lacoste Her Confession', 'Dolce & Gabbana Dolores Pour Femme', 'Lalique Haya'],
      markup: 1.4,
      discount: 35,
      message: '🌟 LUXURY FLASH SALE'
    },
    bestSellers: {
      products: ['Lattafa Yara', 'Barakkat Rouge 540', 'Lattafa Maahir', 'Lattafa Eclaire'],
      markup: 1.25,
      discount: 20,
      message: '🔥 BEST SELLERS'
    },
    newCustomer: {
      products: ['Lattafa Ajwad', 'Lattafa BADEE AL OUD', 'Midnight OUD Midnight OUD'],
      markup: 1.15,
      discount: 15,
      message: '🎁 NEW CUSTOMER SPECIAL'
    },
    mensCollection: {
      products: ['Maison Alhambra The Tux', 'Lattafa Ameer Al Oudh', 'Emper Genius Ranger', 'Mousquetaire Mousquetaire'],
      markup: 1.2,
      discount: 25,
      message: '👔 MEN\'S COLLECTION'
    },
    summerFlorals: {
      products: ['Berries Weekend Pink edition', 'Jacques Yves Champ de Rose', 'NUDO Sweet Berries', 'Rodriguez for her'],
      markup: 1.3,
      discount: 30,
      message: '🌸 SUMMER FLORALS'
    }
  }
  
  let totalPromotions = 0
  
  // Apply promotions
  for (const [promoName, promo] of Object.entries(promotions)) {
    console.log(`\n${promo.message}`)
    console.log('-'.repeat(40))
    
    for (const productName of promo.products) {
      const product = products?.find(p => p.name === productName)
      
      if (!product) {
        console.log(`  ❌ Not found: ${productName}`)
        continue
      }
      
      const originalPrice = product.price
      const markedUpPrice = Math.round(originalPrice * promo.markup)
      const salePrice = Math.round(markedUpPrice * (1 - promo.discount / 100))
      
      // Update product - only update compare_at_price
      const { error: updateError } = await supabase
        .from('products')
        .update({
          compare_at_price: markedUpPrice
        })
        .eq('id', product.id)
      
      if (!updateError) {
        totalPromotions++
        console.log(`  ✅ ${productName}`)
        console.log(`     Price: R${originalPrice} | Compare at: R${markedUpPrice} (${promo.discount}% off)`)
      } else {
        console.log(`  ❌ Failed: ${productName} - ${updateError.message}`)
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 PROMOTION SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Products with promotions: ${totalPromotions}`)
  console.log(`📦 Total products: ${products?.length || 0}`)
  console.log(`📈 Coverage: ${((totalPromotions / (products?.length || 1)) * 100).toFixed(1)}%`)
}

applyBasicPromotions().catch(console.error)