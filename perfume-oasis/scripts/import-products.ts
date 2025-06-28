import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Not set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Path to the product catalog and images
const CATALOG_PATH = '/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images/detailed_product_catalog.json'
const IMAGES_DIR = '/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images'

interface ProductData {
  sku: string
  brand: string
  product_name: string
  full_name: string
  type: string
  size_ml: number
  gender: string
  description: string
  short_description: string
  suggested_price_zar: number
  category: string
  image_file: string
  original_image: string
  stock_quantity: number
  is_featured: boolean
  meta_keywords: string
  meta_description: string
}

// Map concentration types
const concentrationMap: Record<string, string> = {
  'Eau de Parfum': 'Eau de Parfum',
  'Parfum': 'Parfum',
  'Extrait De Parfum': 'Extrait de Parfum',
  'Eau de Toilette': 'Eau de Toilette',
  'EDT': 'Eau de Toilette',
  'EDP': 'Eau de Parfum'
}

// Generate fragrance notes based on product type and gender
function generateFragranceNotes(product: ProductData) {
  const notes: Record<string, { top: string[], heart: string[], base: string[] }> = {
    'Women': {
      top: ['Bergamot', 'Mandarin', 'Pink Pepper', 'Freesia'],
      heart: ['Rose', 'Jasmine', 'Peony', 'Lily of the Valley'],
      base: ['Vanilla', 'Musk', 'Sandalwood', 'Amber']
    },
    'Men': {
      top: ['Bergamot', 'Lemon', 'Lavender', 'Cardamom'],
      heart: ['Geranium', 'Violet', 'Nutmeg', 'Cedar'],
      base: ['Vetiver', 'Patchouli', 'Leather', 'Amber']
    },
    'Unisex': {
      top: ['Citrus', 'Saffron', 'Pink Pepper', 'Bergamot'],
      heart: ['Oud', 'Rose', 'Jasmine', 'Amberwood'],
      base: ['Musk', 'Vanilla', 'Sandalwood', 'Patchouli']
    }
  }

  const genderNotes = notes[product.gender] || notes['Unisex']
  
  // Add special notes for oud-based fragrances
  if (product.product_name.toLowerCase().includes('oud')) {
    genderNotes.heart = ['Oud', 'Rose', 'Saffron', 'Amber']
    genderNotes.base = ['Agarwood', 'Sandalwood', 'Musk', 'Patchouli']
  }
  
  return genderNotes
}

async function ensureBrandsAndCategories() {
  console.log('Ensuring brands and categories exist...')
  
  // Get unique brands from catalog
  const catalogData = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8')) as ProductData[]
  const uniqueBrands = Array.from(new Set(catalogData.map(p => p.brand)))
  const uniqueCategories = Array.from(new Set(catalogData.map(p => p.category)))
  
  // Insert brands
  for (const brandName of uniqueBrands) {
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const { error } = await supabase
      .from('brands')
      .upsert({
        name: brandName,
        slug: slug,
        is_featured: ['Lattafa', 'Barakkat', 'Maison Alhambra'].includes(brandName),
        country: brandName === 'Lattafa' ? 'UAE' : 'International'
      }, {
        onConflict: 'slug'
      })
    
    if (error && !error.message.includes('duplicate key')) {
      console.error(`Error creating brand ${brandName}:`, error)
    }
  }
  
  // Insert categories
  for (const categoryName of uniqueCategories) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const { error } = await supabase
      .from('categories')
      .upsert({
        name: categoryName,
        slug: slug,
        description: `Premium ${categoryName} available at Perfume Oasis South Africa`,
        sort_order: categoryName.includes('Women') ? 1 : categoryName.includes('Men') ? 2 : 3
      }, {
        onConflict: 'slug'
      })
    
    if (error && !error.message.includes('duplicate key')) {
      console.error(`Error creating category ${categoryName}:`, error)
    }
  }
  
  console.log('Brands and categories created')
}

async function uploadImageToSupabase(imagePath: string, imageName: string): Promise<string | null> {
  try {
    const imageBuffer = fs.readFileSync(imagePath)
    // Remove special characters from filename
    const safeFileName = imageName.replace(/[^\w\-\.]/g, '-')
    const fileName = `products/${Date.now()}-${safeFileName}`
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error(`Error uploading image ${imageName}:`, error)
      return null
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
    
    return publicUrl
  } catch (error) {
    console.error(`Failed to upload image ${imageName}:`, error)
    return null
  }
}

async function importProducts() {
  try {
    console.log('Starting product import...')
    
    // Ensure brands and categories exist
    await ensureBrandsAndCategories()
    
    // Read product catalog
    const catalogData = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8')) as ProductData[]
    console.log(`Found ${catalogData.length} products to import`)
    
    // Get brand and category mappings
    const { data: brands } = await supabase.from('brands').select('id, name')
    const { data: categories } = await supabase.from('categories').select('id, name')
    
    if (!brands || !categories) {
      throw new Error('Failed to fetch brands or categories')
    }
    
    const brandMap = brands.reduce((acc, b) => ({ ...acc, [b.name]: b.id }), {} as Record<string, string>)
    const categoryMap = categories.reduce((acc, c) => ({ ...acc, [c.name]: c.id }), {} as Record<string, string>)
    
    // Create storage bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    })
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Error creating bucket:', bucketError)
    }
    
    // Import each product
    let successCount = 0
    for (const product of catalogData) {
      console.log(`Processing: ${product.full_name}`)
      
      const brandId = brandMap[product.brand]
      const categoryId = categoryMap[product.category]
      
      if (!brandId || !categoryId) {
        console.error(`Missing brand or category for ${product.full_name}`)
        continue
      }
      
      // Upload image
      let imageUrl = null
      const imagePath = path.join(IMAGES_DIR, product.image_file)
      if (fs.existsSync(imagePath)) {
        imageUrl = await uploadImageToSupabase(imagePath, product.image_file)
      }
      
      // Generate fragrance notes
      const notes = generateFragranceNotes(product)
      
      // Create product
      const { error } = await supabase
        .from('products')
        .upsert({
          sku: product.sku,
          name: product.full_name,
          slug: product.full_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          brand_id: brandId,
          category_id: categoryId,
          description: product.description,
          short_description: product.short_description,
          price: product.suggested_price_zar,
          compare_at_price: product.suggested_price_zar * 1.3, // 30% markup
          cost: product.suggested_price_zar * 0.6, // 40% margin
          track_inventory: true,
          stock_quantity: product.stock_quantity,
          size: `${product.size_ml}ml`,
          main_image_url: imageUrl || `https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80`,
          concentration: concentrationMap[product.type] || product.type,
          gender: product.gender,
          top_notes: notes.top,
          middle_notes: notes.heart,
          base_notes: notes.base,
          is_active: true,
          is_featured: product.is_featured,
          meta_title: product.short_description,
          meta_description: product.meta_description
        }, {
          onConflict: 'sku'
        })
      
      if (error) {
        console.error(`Error importing ${product.full_name}:`, error)
      } else {
        successCount++
        console.log(`✓ Imported ${product.full_name}`)
        
        // Add product image record if upload was successful
        if (imageUrl) {
          const { error: imageError } = await supabase
            .from('product_images')
            .insert({
              product_id: (await supabase.from('products').select('id').eq('sku', product.sku).single()).data?.id,
              image_url: imageUrl,
              alt_text: product.full_name,
              sort_order: 0
            })
          
          if (imageError) {
            console.error(`Error adding product image for ${product.full_name}:`, imageError)
          }
        }
      }
    }
    
    console.log(`\nImport completed! Successfully imported ${successCount}/${catalogData.length} products`)
    
  } catch (error) {
    console.error('Import failed:', error)
  }
}

// Run the import
importProducts()
