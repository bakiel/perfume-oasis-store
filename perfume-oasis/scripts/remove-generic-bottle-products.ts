import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function removeGenericBottleProducts() {
  console.log('Removing products with generic bottle images...')
  
  // Products to remove based on the screenshots
  const productsToRemove = [
    'Amber Dreams',
    'Ocean Breeze', 
    'Rose Garden',
    'Oud Royale',
    'Black Leather',
    'Vanilla Luxe'
  ]
  
  console.log(`Looking for products: ${productsToRemove.join(', ')}`)
  
  // Get these products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name')
    .in('name', productsToRemove)
    
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products?.length || 0} products to remove`)
  
  if (products && products.length > 0) {
    // Delete these products
    const idsToDelete = products.map(p => p.id)
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', idsToDelete)
      
    if (deleteError) {
      console.error('Error deleting products:', deleteError)
    } else {
      console.log(`✅ Successfully deleted ${products.length} products with generic bottle images`)
      products.forEach(p => {
        console.log(`  - Deleted: ${p.name}`)
      })
    }
  }
  
  // Get remaining products count
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    
  console.log(`\n📊 Remaining products in database: ${count}`)
}

removeGenericBottleProducts()