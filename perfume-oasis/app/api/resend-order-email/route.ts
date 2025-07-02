import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail } from '@/lib/email/order-email-service'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createServiceClient()
    
    // Fetch order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Send email
    const result = await sendOrderConfirmationEmail({
      orderId: order.id,
      customerEmail: order.customer_email,
      customerName: order.customer_name
    })
    
    return NextResponse.json(result)
    
  } catch (error: any) {
    console.error('Resend email error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to resend email' },
      { status: 500 }
    )
  }
}