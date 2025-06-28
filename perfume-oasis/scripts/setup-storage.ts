import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log('Setting up Supabase Storage...')
  
  try {
    // Create product-images bucket
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    })
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✓ Bucket "product-images" already exists')
      } else {
        throw error
      }
    } else {
      console.log('✓ Created bucket "product-images"')
    }
    
    // Note: RLS policies for storage buckets need to be set up through the Supabase dashboard
    // or using direct SQL commands. The bucket is set to public=true which allows read access.
    console.log('Note: Storage bucket created with public read access.')
    console.log('For additional RLS policies, please configure through Supabase dashboard.')
    
    console.log('✓ Storage setup completed successfully!')
    
  } catch (error) {
    console.error('Error setting up storage:', error)
    process.exit(1)
  }
}

// Run setup
setupStorage()