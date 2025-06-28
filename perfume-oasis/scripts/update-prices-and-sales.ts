import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updatePricesAndSales() {
  console.log('Updating product prices and adding sale items...')
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, brand:brands(name)')
    
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  // Update prices based on brand and add sale prices
  for (const product of products || []) {
    let newPrice = product.price
    let salePrice = null
    
    // Increase base prices by brand tier
    if (product.brand?.name) {
      if (['Dolce & Gabbana', 'Lacoste'].includes(product.brand.name)) {
        // Premium brands - higher prices
        newPrice = Math.round(product.price * 2.5)
      } else if (['Lattafa', 'Barakkat', 'Arabian Nights', 'Oriental Tales'].includes(product.brand.name)) {
        // Mid-tier brands
        newPrice = Math.round(product.price * 1.8)
      } else {
        // Standard brands
        newPrice = Math.round(product.price * 1.5)
      }
    }
    
    // Add sale prices for specific products (20-40% off)
    const saleProducts = ['Ocean Breeze', 'Spring Blossom', 'Citrus Burst', 'Vanilla Luxe', 'Rose Garden']
    if (saleProducts.includes(product.name)) {
      const discount = 0.2 + Math.random() * 0.2 // 20-40% off
      salePrice = Math.round(newPrice * (1 - discount))
    }
    
    // Update the product
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        price: newPrice,
        sale_price: salePrice 
      })
      .eq('id', product.id)
      
    if (!updateError) {
      console.log(`Updated ${product.name}: R${newPrice} ${salePrice ? `(Sale: R${salePrice})` : ''}`)
    }
  }
  
  console.log('✅ Prices updated successfully!')
}

updatePricesAndSales()