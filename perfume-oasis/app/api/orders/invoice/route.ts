import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoiceTemplate } from '@/lib/pdf/invoice-template'
import React from 'react'

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
    
    const supabase = await createClient()
    
    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          quantity,
          unit_price,
          total_price,
          product:products(name, sku)
        )
      `)
      .eq('id', orderId)
      .single()
    
    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Get bank details from settings
    const { data: bankDetailsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'bank_details')
      .single()
    
    // Prepare invoice data
    const invoiceData = {
      orderNumber: order.order_number,
      orderDate: new Date(order.created_at),
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address: order.shipping_address
      },
      items: order.items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.unit_price,
        total: item.total_price
      })),
      subtotal: order.subtotal_amount,
      shipping: order.shipping_amount,
      tax: order.tax_amount,
      total: order.total_amount,
      paymentMethod: order.payment_method === 'bank_transfer' ? 'Bank Transfer' : 'Invoice',
      bankDetails: bankDetailsData?.value ? {
        ...bankDetailsData.value,
        reference: order.order_number
      } : null
    }
    
    // Generate PDF
    const document = React.createElement(InvoiceTemplate, { data: invoiceData })
    const pdfBuffer = await renderToBuffer(document as any)
    
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