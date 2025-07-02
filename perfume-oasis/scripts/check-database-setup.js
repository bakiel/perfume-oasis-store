const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseServiceKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('🔍 Checking database setup...\n')

  const checks = {
    tables: {
      orders: ['applied_promotions', 'discount_amount', 'promo_code'],
      promotions: ['id', 'name', 'code', 'type', 'value'],
      email_logs: ['id', 'order_id', 'email_type'],
      settings: ['id', 'key', 'value'],
      profiles: ['role']
    },
    functions: ['increment_promotion_usage']
  }

  let hasErrors = false

  // Check tables and columns
  for (const [table, columns] of Object.entries(checks.tables)) {
    console.log(`📋 Checking table: ${table}`)
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0)

      if (error) {
        console.error(`   ❌ Table '${table}' not found or not accessible`)
        hasErrors = true
        continue
      }

      // Check specific columns for orders table
      if (table === 'orders') {
        const { data: columnInfo, error: columnError } = await supabase
          .rpc('get_table_columns', { table_name: 'orders' })
          .catch(() => ({ data: null, error: true }))

        if (columnError || !columnInfo) {
          // Fallback check
          const { error: testError } = await supabase
            .from('orders')
            .select('applied_promotions, discount_amount, promo_code')
            .limit(0)

          if (testError) {
            console.error(`   ❌ Missing promotion columns in orders table`)
            console.error(`      Run the SQL script to add: applied_promotions, discount_amount, promo_code`)
            hasErrors = true
          } else {
            console.log(`   ✅ All required columns present`)
          }
        }
      } else {
        console.log(`   ✅ Table exists`)
      }
    } catch (err) {
      console.error(`   ❌ Error checking table '${table}': ${err.message}`)
      hasErrors = true
    }
  }

  // Check functions
  console.log('\n📋 Checking functions:')
  for (const func of checks.functions) {
    try {
      // Try to get function info (this might fail but that's ok)
      console.log(`   ℹ️  Function '${func}' - manual verification needed`)
    } catch (err) {
      // Functions are harder to check programmatically
    }
  }

  // Check for sample promotions
  console.log('\n📋 Checking sample promotions:')
  try {
    const { data: promotions, error } = await supabase
      .from('promotions')
      .select('code, name, type, value')
      .in('code', ['WELCOME10', 'FREESHIP', 'SUMMER100'])

    if (error) {
      console.error('   ❌ Could not check promotions')
      hasErrors = true
    } else if (promotions.length === 0) {
      console.log('   ⚠️  No sample promotions found (not critical)')
    } else {
      console.log('   ✅ Found sample promotions:')
      promotions.forEach(p => {
        console.log(`      - ${p.code}: ${p.name} (${p.type})`)
      })
    }
  } catch (err) {
    console.error('   ❌ Error checking promotions:', err.message)
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  if (hasErrors) {
    console.log('❌ Database setup is incomplete!')
    console.log('\n🔧 To fix:')
    console.log('1. Go to Supabase SQL Editor')
    console.log('2. Run the script in: /scripts/complete-database-setup.sql')
    console.log('3. Run this check again to verify')
  } else {
    console.log('✅ Database setup looks good!')
    console.log('\n🎉 Your checkout should work now!')
  }
}

// Create helper function if it doesn't exist
async function createHelperFunction() {
  const helperSQL = `
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE(column_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT c.column_name::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' 
  AND c.table_name = $1;
END;
$$ LANGUAGE plpgsql;`

  try {
    await supabase.rpc('query', { query: helperSQL }).catch(() => {})
  } catch (err) {
    // Ignore errors, this is just a helper
  }
}

// Run checks
createHelperFunction().then(() => checkDatabase())