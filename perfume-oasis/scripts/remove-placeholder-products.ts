import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function removePlaceholderProducts() {
  console.log('Removing products with placeholder images...')
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, main_image_url')
    
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products?.length || 0} total products`)
  
  // Identify products with placeholder images
  const placeholderPatterns = [
    'placeholder',
    'perfume-oasis-main-logo',
    'via.placeholder.com',
    'placehold.it',
    'no-image',
    'default'
  ]
  
  const productsToDelete = products?.filter(product => {
    if (!product.main_image_url) return true // No image at all
    
    const imageUrl = product.main_image_url.toLowerCase()
    return placeholderPatterns.some(pattern => imageUrl.includes(pattern))
  }) || []
  
  console.log(`Found ${productsToDelete.length} products with placeholder images`)
  
  if (productsToDelete.length > 0) {
    // Delete products with placeholder images
    const idsToDelete = productsToDelete.map(p => p.id)
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', idsToDelete)
      
    if (deleteError) {
      console.error('Error deleting products:', deleteError)
    } else {
      console.log(`✅ Successfully deleted ${productsToDelete.length} products with placeholder images`)
      productsToDelete.forEach(p => {
        console.log(`  - Deleted: ${p.name}`)
      })
    }
  }
  
  // Get remaining products count
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    
  console.log(`\n📊 Remaining products in database: ${count}`)
  
  // List remaining products
  const { data: remainingProducts } = await supabase
    .from('products')
    .select('name, main_image_url, brand:brands(name)')
    .order('name')
    
  console.log('\n📋 Products with real images:')
  remainingProducts?.forEach((product: any, index) => {
    console.log(`${index + 1}. ${product.name} (${product.brand?.name}) - ${product.main_image_url}`)
  })
}

removePlaceholderProducts()