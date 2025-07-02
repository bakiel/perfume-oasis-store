import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    
    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()
    
    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Format estimated delivery based on status
    let estimatedDelivery = null
    if (order.status === 'shipped' && order.created_at) {
      const shippedDate = new Date(order.created_at)
      const estimatedDate = new Date(shippedDate)
      estimatedDate.setDate(estimatedDate.getDate() + 5) // 5 days for delivery
      estimatedDelivery = estimatedDate.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return NextResponse.json({
      orderNumber: order.order_number,
      status: order.status,
      trackingNumber: order.tracking_number,
      estimatedDelivery,
      shippedAt: order.shipped_at,
      deliveredAt: order.delivered_at
    })
    
  } catch (error) {
    console.error('Order tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    )
  }
}