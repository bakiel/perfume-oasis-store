import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Test 1: Check if we can connect to the database
    const { data: testConnection, error: connectionError } = await supabase
      .from('products')
      .select('count')
      .single()
    
    if (connectionError) {
      return NextResponse.json({
        error: 'Database connection failed',
        details: connectionError
      }, { status: 500 })
    }
    
    // Test 2: Check Ocean Breeze product
    const { data: oceanBreeze, error: oceanBreezeError } = await supabase
      .from('products')
      .select('*')
      .ilike('name', '%ocean%breeze%')
      .single()
    
    // Test 3: Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Test 4: Check product with specific ID if provided
    const productId = request.nextUrl.searchParams.get('productId')
    let specificProduct = null
    if (productId) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
      
      specificProduct = { data, error }
    }
    
    return NextResponse.json({
      success: true,
      tests: {
        databaseConnection: 'OK',
        oceanBreezeProduct: oceanBreeze || oceanBreezeError,
        authStatus: user ? 'Authenticated' : 'Not authenticated',
        authError,
        specificProduct,
        allProductsCount: await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .then(res => res.count)
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}