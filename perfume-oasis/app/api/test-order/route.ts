import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    
    // Test creating a minimal order
    const testOrderData = {
      id: crypto.randomUUID(),
      order_number: `TEST${Date.now()}`,
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '0123456789',
      shipping_address: JSON.stringify({ street: 'Test St', city: 'Test City' }),
      total_amount: 100,
      payment_method: 'bank_transfer',
      status: 'test',
      // Try with idempotency_key
      idempotency_key: `test-${Date.now()}`
    }
    
    // First attempt with idempotency_key
    const { data: order1, error: error1 } = await supabase
      .from('orders')
      .insert(testOrderData)
      .select()
      .single()
    
    let result: any = {}
    
    if (error1) {
      result.withIdempotencyKey = { success: false, error: error1.message }
      
      // Try without idempotency_key
      const { idempotency_key, ...testOrderDataWithoutKey } = testOrderData
      const { data: order2, error: error2 } = await supabase
        .from('orders')
        .insert(testOrderDataWithoutKey)
        .select()
        .single()
      
      if (error2) {
        result.withoutIdempotencyKey = { success: false, error: error2.message }
      } else {
        result.withoutIdempotencyKey = { success: true, orderId: order2.id }
        // Clean up test order
        await supabase.from('orders').delete().eq('id', order2.id)
      }
    } else {
      result.withIdempotencyKey = { success: true, orderId: order1.id }
      // Clean up test order
      await supabase.from('orders').delete().eq('id', order1.id)
    }
    
    // Check column existence
    const { data: columns } = await supabase
      .rpc('get_columns', { table_name: 'orders' })
      .select()
    
    return NextResponse.json({
      testResults: result,
      schemaCheck: {
        hasIdempotencyKey: columns?.some((c: any) => c.column_name === 'idempotency_key') ?? 'Could not check',
        totalColumns: columns?.length ?? 'Could not count'
      },
      message: 'Test completed'
    })
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}