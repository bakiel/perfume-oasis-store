import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')
    const invoiceNumber = searchParams.get('invoiceNumber')

    console.log('Invoice download request:', { orderId, invoiceNumber })

    if (!orderId || !invoiceNumber) {
      return NextResponse.json({ error: 'Missing orderId or invoiceNumber' }, { status: 400 })
    }

    // Get the order details - use service client to bypass RLS
    const supabase = await createServiceClient()
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products:product_id (
            name,
            price,
            brand:brand_id (
              name
            )
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Order fetch error:', orderError)
      console.error('Order ID:', orderId)
      return NextResponse.json({ error: 'Order not found', details: orderError }, { status: 404 })
    }

    console.log('Order fetched successfully:', order.order_number)

    // Prepare invoice data
    const invoiceData = {
      invoiceNumber: order.invoice_number,
      orderNumber: order.order_number,
      date: order.created_at,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address: JSON.parse(order.shipping_address || '{}'),
      },
      items: order.order_items.map((item: any) => ({
        product_name: item.products?.name || 'Unknown Product',
        product_brand: item.products?.brand?.name || 'Unknown',
        quantity: item.quantity,
        price: item.price,
        subtotal: item.total,
      })),
      subtotal: order.subtotal,
      delivery: order.delivery_fee,
      total: order.total,
      paymentStatus: order.payment_status === 'paid' ? 'Paid' : 'Pending',
      paymentMethod: order.payment_method === 'bank_transfer' ? 'Bank Transfer' : order.payment_method,
    }

    // Generate PDF
    console.log('Generating PDF for invoice:', invoiceNumber)
    const pdfBuffer = await generateInvoicePDF(invoiceData)
    console.log('PDF generated successfully, size:', pdfBuffer.length)

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Invoice download error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to download invoice' },
      { status: 500 }
    )
  }
}