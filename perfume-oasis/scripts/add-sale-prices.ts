import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addSalePrices() {
  const { error } = await supabase.rpc('exec_sql', {
    query: `
      UPDATE products 
      SET sale_price = ROUND(price * 0.8) 
      WHERE name IN ('Ocean Breeze', 'Spring Blossom', 'Citrus Burst')
    `
  }).catch(async () => {
    // If RPC doesn't exist, update directly
    const productsToUpdate = ['Ocean Breeze', 'Spring Blossom', 'Citrus Burst']
    
    for (const productName of productsToUpdate) {
      const { data: product } = await supabase
        .from('products')
        .select('id, price')
        .eq('name', productName)
        .single()
      
      if (product) {
        await supabase
          .from('products')
          .update({ sale_price: Math.round(product.price * 0.8) })
          .eq('id', product.id)
      }
    }
  })
  
  console.log('✅ Sale prices added successfully')
}

addSalePrices()