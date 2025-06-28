import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createProfessionalPromotions() {
  console.log('Creating professional promotional pricing strategy...')
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, brand:brands(name), category:categories(name)')
    
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  console.log(`Processing ${products?.length || 0} products...\n`)
  
  // Professional pricing strategy
  for (const product of products || []) {
    let markup = 1.0 // Default no markup
    let discountPercent = 0
    let shouldBeOnSale = false
    
    // Strategy 1: Summer Sale Collection (30% of products)
    const summerSaleProducts = [
      'Lattafa Yara',
      'Barakkat Rouge 540',
      'Dolce & Gabbana Dolores Pour Femme',
      'Lattafa Eclaire',
      'Emper Lady Presidente',
      'Jacques Yves Champ de Rose',
      'Berries Weekend Pink edition',
      'Rodriguez for her',
      'NUDO Sweet Berries',
      'Rave NOW Women'
    ]
    
    // Strategy 2: Men's Special (selected men's fragrances)
    const mensSpecialProducts = [
      'Lattafa Maahir',
      'Lattafa Ameer Al Oudh',
      'Emper Genius Ranger',
      'Maison Alhambra The Tux',
      'Lattafa Qaed Al Fursan',
      'Oud Al Layl Oud Al Layl',
      'Mousquetaire Mousquetaire'
    ]
    
    // Strategy 3: Luxury Flash Sale (premium brands)
    const luxuryFlashSale = [
      'Lacoste Her Confession',
      'Lalique Haya'
    ]
    
    // Strategy 4: Bundle Deals (popular unisex)
    const bundleDeals = [
      'Lattafa Ajwad',
      'Lattafa BADEE AL OUD',
      'Midnight OUD Midnight OUD',
      'Just عنابي',
      'Barakkat satin oud'
    ]
    
    // Apply strategic markups and discounts
    if (summerSaleProducts.includes(product.name)) {
      markup = 1.25 // 25% markup
      discountPercent = 30 // 30% off
      shouldBeOnSale = true
    } else if (mensSpecialProducts.includes(product.name)) {
      markup = 1.20 // 20% markup
      discountPercent = 25 // 25% off
      shouldBeOnSale = true
    } else if (luxuryFlashSale.includes(product.name)) {
      markup = 1.35 // 35% markup
      discountPercent = 40 // 40% off (appears as huge discount but still profitable)
      shouldBeOnSale = true
    } else if (bundleDeals.includes(product.name)) {
      markup = 1.15 // 15% markup
      discountPercent = 20 // 20% off (for bundle pricing)
      shouldBeOnSale = true
    } else if (Math.random() < 0.15) { // 15% random selection for variety
      markup = 1.18
      discountPercent = 15
      shouldBeOnSale = true
    }
    
    // Calculate new prices
    const originalPrice = product.price
    const markedUpPrice = Math.round(product.price * markup)
    const salePrice = shouldBeOnSale ? Math.round(markedUpPrice * (1 - discountPercent / 100)) : null
    
    // Update the product
    // If on sale, set the sale price as the actual price and marked up price as compare_at_price
    const updateData = shouldBeOnSale ? {
      price: salePrice,
      compare_at_price: markedUpPrice
    } : {
      price: markedUpPrice,
      compare_at_price: null
    }
    
    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', product.id)
      
    if (!updateError) {
      if (shouldBeOnSale) {
        console.log(`✅ ${product.name}: R${markedUpPrice} → R${salePrice} (${discountPercent}% OFF)`)
      } else {
        console.log(`   ${product.name}: R${markedUpPrice} (regular price)`)
      }
    } else {
      console.error(`❌ Error updating ${product.name}:`, updateError)
    }
  }
  
  // Set featured products for homepage
  const featuredProductNames = [
    'Lattafa Yara', // Popular women's
    'Barakkat Rouge 540', // Luxury dupe
    'Lattafa Maahir', // Popular men's
    'Lacoste Her Confession' // Premium brand
  ]
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('id')
    .in('name', featuredProductNames)
    
  if (featuredProducts) {
    // First, unset all featured
    await supabase
      .from('products')
      .update({ is_featured: false })
      .eq('is_featured', true)
      
    // Then set new featured
    for (const product of featuredProducts) {
      await supabase
        .from('products')
        .update({ is_featured: true })
        .eq('id', product.id)
    }
    
    console.log(`\n⭐ Set ${featuredProducts.length} featured products`)
  }
  
  console.log('\n🎯 Professional promotional pricing strategy applied!')
  console.log('📊 Marketing segments created:')
  console.log('   - Summer Sale Collection (30% OFF)')
  console.log('   - Men\'s Special (25% OFF)')  
  console.log('   - Luxury Flash Sale (40% OFF)')
  console.log('   - Bundle Deals (20% OFF)')
}

createProfessionalPromotions()