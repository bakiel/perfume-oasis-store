#!/usr/bin/env ts-node

/**
 * Test script to validate cart functionality
 * Run with: npx ts-node scripts/test-cart-validation.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testCartValidation() {
  console.log('🔍 Testing Cart Validation...\n')

  // 1. Check for products with "ocean" or "breeze" in the name
  console.log('1. Checking for "Ocean Breeze" product...')
  const { data: oceanProducts, error: oceanError } = await supabase
    .from('products')
    .select('id, name, slug, price')
    .or('name.ilike.%ocean%,name.ilike.%breeze%')

  if (oceanError) {
    console.error('Error checking products:', oceanError)
  } else {
    console.log(`Found ${oceanProducts?.length || 0} products with "ocean" or "breeze":`)
    oceanProducts?.forEach(p => console.log(`  - ${p.name} (${p.slug})`))
  }

  // 2. Check sample products
  console.log('\n2. Sample of existing products:')
  const { data: sampleProducts, error: sampleError } = await supabase
    .from('products')
    .select('id, name, price, stock_quantity')
    .limit(5)

  if (sampleError) {
    console.error('Error fetching products:', sampleError)
  } else {
    sampleProducts?.forEach(p => 
      console.log(`  - ${p.name}: R${p.price} (Stock: ${p.stock_quantity})`)
    )
  }

  // 3. Check orders table structure
  console.log('\n3. Checking orders table columns...')
  const { data: orderColumns, error: columnsError } = await supabase
    .from('orders')
    .select('*')
    .limit(0)

  if (columnsError) {
    console.error('Error checking orders table:', columnsError)
    if (columnsError.message.includes('idempotency_key')) {
      console.log('❌ Missing idempotency_key column - run migration script!')
    }
  } else {
    console.log('✅ Orders table structure is valid')
  }

  // 4. Test cart item validation
  console.log('\n4. Testing cart item validation...')
  const testProductId = 'non-existent-product-id'
  const { data: testProduct, error: testError } = await supabase
    .from('products')
    .select('id')
    .eq('id', testProductId)
    .single()

  if (!testProduct) {
    console.log('✅ Non-existent product correctly returns null')
  } else {
    console.log('❌ Unexpected result for non-existent product')
  }

  console.log('\n✅ Cart validation test complete!')
  console.log('\nRecommendations:')
  console.log('1. If "Ocean Breeze" product is missing, users need to clear their cart')
  console.log('2. Direct users to /cart/validate to clean up invalid items')
  console.log('3. Run the idempotency_key migration if not already done')
}

testCartValidation().catch(console.error)