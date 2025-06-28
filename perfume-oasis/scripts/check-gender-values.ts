import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkGenderValues() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, gender')
    
  console.log('Gender values in database:')
  const genderCounts: Record<string, number> = {}
  
  data?.forEach(product => {
    const gender = product.gender || 'null'
    genderCounts[gender] = (genderCounts[gender] || 0) + 1
  })
  
  console.log(genderCounts)
  
  // Fix gender values
  console.log('\nFixing gender values...')
  
  const updates = [
    { gender: 'Women', names: ['Rose Garden', 'Vanilla Luxe', 'Spring Blossom', 'Royal Jasmine'] },
    { gender: 'Men', names: ['Ocean Breeze', 'Black Leather'] },
    { gender: 'Unisex', names: ['Oud Royale', 'Amber Dreams', 'Midnight Oud', 'Citrus Burst'] }
  ]
  
  for (const update of updates) {
    const { error } = await supabase
      .from('products')
      .update({ gender: update.gender })
      .in('name', update.names)
      
    if (!error) {
      console.log(`Updated ${update.names.length} products to ${update.gender}`)
    }
  }
}

checkGenderValues()