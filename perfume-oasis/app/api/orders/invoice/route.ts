import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateInvoicePDF } from '@/lib/pdf/invoice'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createServiceClient()
    
    // Fetch order details with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            name,
            brand:brands (name)
          )
        )
      `)
      .eq('id', orderId)
      .single()
    
    if (orderError || !order) {
      console.error('Order fetch error:', orderError)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Parse delivery address
    const deliveryAddress = typeof order.delivery_address === 'string' 
      ? JSON.parse(order.delivery_address) 
      : order.delivery_address
    
    // Prepare invoice data
    const invoiceData = {
      invoiceNumber: order.invoice_number || `INV${Date.now()}`,
      orderNumber: order.order_number,
      date: order.created_at,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address: deliveryAddress
      },
      items: order.order_items?.map((item: any) => ({
        name: item.product?.name || 'Product',
        brand: item.product?.brand?.name || '',
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })) || [],
      subtotal: order.subtotal || order.total,
      delivery: order.delivery_fee || 0,
      total: order.total || order.total_amount,
      paymentStatus: order.payment_status === 'paid' ? 'Paid' : 'Pending',
      paymentMethod: 'Bank Transfer',
    }
    
    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoiceData)
    
    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.order_number}.pdf"`
      }
    })
    
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}