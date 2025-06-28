const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setFeatured() {
  // Clear all featured
  await supabase
    .from('products')
    .update({ is_featured: false })
    .eq('is_featured', true)
  
  // Set featured products
  const featuredNames = [
    'Barakkat Rouge 540',
    'Lattafa Yara',
    'Lacoste Her Confession',
    'Lattafa Maahir'
  ]
  
  for (const name of featuredNames) {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: true })
      .eq('name', name)
    
    if (!error) {
      console.log(`✅ Set featured: ${name}`)
    } else {
      console.log(`❌ Failed: ${name}`)
    }
  }
}

setFeatured()