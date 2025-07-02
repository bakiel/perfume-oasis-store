import { createServiceClient } from '../lib/supabase/server'

async function checkDatabase() {
  const supabase = await createServiceClient()
  
  console.log('Checking database tables...\n')
  
  // Check if orders table exists
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .limit(1)
    
  if (ordersError) {
    console.log('❌ Orders table:', ordersError.message)
  } else {
    console.log('✅ Orders table exists')
  }
  
  // Check if order_items table exists
  const { data: orderItems, error: orderItemsError } = await supabase
    .from('order_items')
    .select('*')
    .limit(1)
    
  if (orderItemsError) {
    console.log('❌ Order items table:', orderItemsError.message)
  } else {
    console.log('✅ Order items table exists')
  }
  
  // Check if invoices table exists
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select('*')
    .limit(1)
    
  if (invoicesError) {
    console.log('❌ Invoices table:', invoicesError.message)
  } else {
    console.log('✅ Invoices table exists')
  }
  
  // Check if products table exists
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .limit(1)
    
  if (productsError) {
    console.log('❌ Products table:', productsError.message)
  } else {
    console.log('✅ Products table exists')
  }
  
  // Check if users can authenticate
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    console.log('\n❌ Auth check failed:', authError.message)
  } else if (user) {
    console.log('\n✅ Auth is working, user found:', user.email)
  } else {
    console.log('\n⚠️  No authenticated user (this is normal for service role)')
  }
}

checkDatabase().catch(console.error)
