import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importSampleProducts() {
  try {
    console.log('Starting sample product import...')
    
    // Read sample data
    const sampleData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'sample-products.json'), 'utf-8')
    )
    
    // Create categories
    const categories = ['Oriental', 'Floral', 'Fresh', 'Woody', 'Gourmand', 'Citrus']
    const categoryMap: Record<string, string> = {}
    
    for (const categoryName of categories) {
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-')
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          name: categoryName,
          slug: slug,
          is_active: true,
          sort_order: categories.indexOf(categoryName)
        }, {
          onConflict: 'slug'
        })
        .select()
        .single()
      
      if (data) {
        categoryMap[categoryName] = data.id
      }
    }
    
    console.log('Categories created/updated')
    
    // Create brands
    const brands = [...new Set(sampleData.products.map((p: any) => p.brand))]
    const brandMap: Record<string, string> = {}
    
    for (const brandName of brands) {
      const { data, error } = await supabase
        .from('brands')
        .upsert({
          name: brandName,
          slug: brandName.toLowerCase().replace(/\s+/g, '-'),
          is_active: true
        }, {
          onConflict: 'name'
        })
        .select()
        .single()
      
      if (data) {
        brandMap[brandName] = data.id
      }
    }
    
    console.log('Brands created/updated')
    
    // Import products
    let imported = 0
    for (const product of sampleData.products) {
      const slug = product.name.toLowerCase().replace(/\s+/g, '-')
      
      // Use placeholder images from design assets
      const images = [
        '/images/products/product-placeholder-1.jpg',
        '/images/products/product-placeholder-2.jpg',
        '/images/products/product-placeholder-3.jpg'
      ]
      
      const { error } = await supabase
        .from('products')
        .upsert({
          name: product.name,
          slug: slug,
          description: product.description,
          price: product.price,
          brand_id: brandMap[product.brand],
          category_id: categoryMap[product.category],
          size: product.size,
          concentration: product.concentration,
          gender: product.gender,
          top_notes: product.notes.top,
          middle_notes: product.notes.middle,
          base_notes: product.notes.base,
          main_image_url: images[imported % 3],
          is_active: true,
          is_featured: imported < 4,
          stock_quantity: Math.floor(Math.random() * 50) + 10
        }, {
          onConflict: 'slug'
        })
      
      if (!error) {
        imported++
        console.log(`Imported: ${product.name}`)
      } else {
        console.error(`Failed to import ${product.name}:`, error)
      }
    }
    
    console.log(`✅ Successfully imported ${imported} products`)
    
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

importSampleProducts()