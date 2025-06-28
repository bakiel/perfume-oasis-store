import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createStrategicPromotions() {
  console.log('Creating strategic promotional system...\n')
  
  // First, reset all promotions
  await supabase
    .from('products')
    .update({ 
      is_on_sale: false,
      compare_at_price: null,
      promotion_type: null,
      promotion_value: null
    })
    .neq('id', '')
  
  // Get all products with their current prices
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, brand:brands(name), category:categories(name)')
    .order('price', { ascending: false })
    
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  console.log(`Analyzing ${products?.length || 0} products for strategic promotions...\n`)
  
  // Strategic promotion categories
  const promotions = {
    // 1. Premium Brand Flash Sale (High-ticket, high-margin)
    premiumFlash: {
      products: ['Lacoste Her Confession', 'Dolce & Gabbana Dolores Pour Femme', 'Lalique Haya'],
      markup: 1.4, // 40% markup
      discount: 35, // 35% off marked up price
      type: 'percentage',
      message: 'LUXURY FLASH SALE - Limited Time'
    },
    
    // 2. Best Sellers (Popular mid-range products)
    bestSellers: {
      products: ['Lattafa Yara', 'Barakkat Rouge 540', 'Lattafa Maahir', 'Lattafa Eclaire'],
      markup: 1.25, // 25% markup
      discount: 20, // 20% off
      type: 'percentage',
      message: 'BEST SELLERS - Customer Favorites'
    },
    
    // 3. New Customer Special (Entry-level pricing)
    newCustomer: {
      products: ['Lattafa Ajwad', 'Lattafa BADEE AL OUD', 'Midnight OUD Midnight OUD'],
      markup: 1.15, // 15% markup
      discount: 15, // 15% off
      type: 'percentage',
      message: 'NEW CUSTOMER SPECIAL'
    },
    
    // 4. Volume Discount (Higher-priced items for bulk buyers)
    volumeDiscount: {
      products: ['Armaf Club de nuit Untold', 'Maison Alhambra The Tux', 'Lattafa Ameer Al Oudh'],
      markup: 1.2, // 20% markup
      discount: 25, // 25% off on 2+ items
      type: 'bundle',
      message: 'BUY 2+ SAVE 25%'
    },
    
    // 5. Seasonal Collection (Rotating seasonal items)
    seasonal: {
      products: ['Berries Weekend Pink edition', 'Jacques Yves Champ de Rose', 'NUDO Sweet Berries'],
      markup: 1.3, // 30% markup
      discount: 30, // 30% off
      type: 'percentage',
      message: 'SUMMER COLLECTION'
    }
  }
  
  // Apply strategic promotions
  let totalPromotions = 0
  const promotionSummary: Record<string, Array<{
    name: string
    originalPrice: number
    markedUpPrice: number
    salePrice: number
    savedAmount: number
    margin: number
  }>> = {}
  
  for (const [promoName, promo] of Object.entries(promotions)) {
    console.log(`\n📌 ${promo.message}`)
    promotionSummary[promoName] = []
    
    for (const productName of promo.products) {
      const product = products?.find(p => p.name === productName)
      if (!product) continue
      
      const originalPrice = product.price
      const markedUpPrice = Math.round(originalPrice * promo.markup)
      const salePrice = Math.round(markedUpPrice * (1 - promo.discount / 100))
      
      // Update product with strategic promotion
      const { error: updateError } = await supabase
        .from('products')
        .update({
          price: salePrice,
          compare_at_price: markedUpPrice,
          is_on_sale: true,
          promotion_type: promo.type,
          promotion_value: promo.discount,
          promotion_starts_at: new Date().toISOString(),
          promotion_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .eq('id', product.id)
      
      if (!updateError) {
        totalPromotions++
        const savedAmount = markedUpPrice - salePrice
        const margin = ((salePrice - originalPrice) / originalPrice * 100).toFixed(1)
        
        console.log(`  ✓ ${product.name}: R${markedUpPrice} → R${salePrice} (Save R${savedAmount}, Margin: ${margin}%)`)
        
        promotionSummary[promoName].push({
          name: product.name,
          originalPrice,
          markedUpPrice,
          salePrice,
          savedAmount,
          margin: parseFloat(margin)
        })
      }
    }
  }
  
  // Set featured products (mix of different promotion types)
  const featuredProductNames = [
    'Barakkat Rouge 540', // Best seller
    'Lacoste Her Confession', // Premium
    'Lattafa Maahir', // Men's best seller
    'Berries Weekend Pink edition' // Seasonal
  ]
  
  // Reset featured products
  await supabase
    .from('products')
    .update({ is_featured: false })
    .eq('is_featured', true)
  
  // Set new featured products
  for (const name of featuredProductNames) {
    await supabase
      .from('products')
      .update({ is_featured: true })
      .eq('name', name)
  }
  
  // Summary statistics
  console.log('\n' + '='.repeat(60))
  console.log('📊 PROMOTION STRATEGY SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total products on promotion: ${totalPromotions}`)
  console.log(`Total products in catalog: ${products?.length || 0}`)
  console.log(`Promotion rate: ${((totalPromotions / (products?.length || 1)) * 100).toFixed(1)}%`)
  
  // Calculate average margins by category
  console.log('\n💰 Average Margins by Promotion Type:')
  for (const [promoName, items] of Object.entries(promotionSummary)) {
    if (items.length > 0) {
      const avgMargin = items.reduce((sum, item) => sum + item.margin, 0) / items.length
      const totalSavings = items.reduce((sum, item) => sum + item.savedAmount, 0)
      console.log(`  ${promoName}: ${avgMargin.toFixed(1)}% margin, R${totalSavings} total customer savings`)
    }
  }
  
  console.log('\n✅ Strategic promotion system implemented!')
  console.log('📱 Admins can now manage promotions through the admin panel')
}

createStrategicPromotions()