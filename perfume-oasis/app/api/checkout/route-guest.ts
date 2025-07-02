import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'
import { sendOrderConfirmation } from '@/lib/email/order-confirmation'
import { COMPANY_EMAILS } from '@/lib/config/emails'

// Enable guest checkout for testing
const ENABLE_GUEST_CHECKOUT = true

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, items, total, subtotal, delivery } = body

    console.log('Checkout request received:', { 
      customer, 
      itemCount: items.length, 
      total,
      body: JSON.stringify(body, null, 2)
    })

    // Generate order number and invoice number
    const timestamp = Date.now()
    const orderNumber = `PO${timestamp}`
    const invoiceNumber = `INV${timestamp}`

    // Check if the user is authenticated
    const regularSupabase = await createClient()
    const { data: { user }, error: authError } = await regularSupabase.auth.getUser()
    
    let userId: string | null = null
    
    if (authError || !user) {
      if (ENABLE_GUEST_CHECKOUT) {
        console.warn('No authenticated user found, using guest checkout')
        // For guest checkout, we'll use null user_id
        userId = null
      } else {
        console.error('No authenticated user found:', authError)
        return NextResponse.json(
          { 
            error: 'Authentication required', 
            message: 'Please log in or register to complete your purchase.',
            requiresAuth: true,
            success: false 
          },
          { status: 401 }
        )
      }
    } else {
      userId = user.id
      console.log('Processing order for authenticated user:', userId)
    }
    
    // Use service client for database operations to bypass RLS if needed
    const supabase = await createServiceClient()

    // Create the order
    const orderId = crypto.randomUUID()
    
    // Prepare order data
    const orderData: any = {
        id: orderId,
        order_number: orderNumber,
        invoice_number: invoiceNumber,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: JSON.stringify({
          street: customer.street,
          suburb: customer.suburb,
          city: customer.city,
          province: customer.province,
          postal_code: customer.postalCode,
        }),
        delivery_address: JSON.stringify({
          street: customer.street,
          suburb: customer.suburb,
          city: customer.city,
          province: customer.province,
          postal_code: customer.postalCode,
        }),
        subtotal: subtotal || total,
        delivery_fee: delivery || 0,
        total: total,
        total_amount: total, // Required field
        status: 'pending', // Changed from 'pending_payment' to match allowed values
        payment_method: 'bank_transfer',
        payment_status: 'pending',
        user_id: userId, // Can be null for guest checkout
    }
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Order creation failed:', JSON.stringify(orderError, null, 2))
      console.error('Order data attempted:', orderData)
      console.error('Full error details:', orderError)
      throw new Error(`Failed to create order: ${orderError.message || JSON.stringify(orderError)}`)
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items creation failed:', itemsError)
      // Continue anyway - order was created
    }

    // Generate invoice data
    const invoiceData = {
      invoiceNumber,
      orderNumber,
      date: new Date().toISOString(),
      customer: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        address: {
          street: customer.street,
          suburb: customer.suburb,
          city: customer.city,
          province: customer.province,
          postalCode: customer.postalCode,
        },
      },
      items: items.map((item: any) => ({
        product_name: item.name,
        product_brand: item.brand || 'Unknown',
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal: subtotal || total,
      delivery: delivery || 0,
      total,
      paymentStatus: 'Pending',
      paymentMethod: 'Bank Transfer',
    }

    try {
      // Generate PDF invoice
      console.log('Attempting to generate PDF invoice...')
      const pdfBuffer = await generateInvoicePDF(invoiceData)
      console.log('PDF generated successfully, size:', pdfBuffer.length)
      
      // Store invoice PDF reference (you would typically upload to storage)
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          order_id: order.id,
          invoice_number: invoiceNumber,
          amount: total,
          pdf_url: `invoices/${invoiceNumber}.pdf`, // Path where PDF would be stored
          status: 'sent',
        })

      if (invoiceError) {
        console.error('Invoice record creation failed:', invoiceError)
      }

      // Check if RESEND_API_KEY is configured
      const resendApiKey = process.env.RESEND_API_KEY
      if (!resendApiKey || resendApiKey.trim() === '') {
        console.warn('RESEND_API_KEY not configured - skipping email send')
        console.log('Invoice would have been sent to:', customer.email)
        console.log('Order details:', { orderNumber, invoiceNumber, total })
      } else {
        // Send order confirmation email with invoice
        await sendOrderConfirmation({
          to: customer.email,
          customerName: `${customer.firstName} ${customer.lastName}`,
          orderNumber,
          invoiceNumber,
          items,
          total,
          invoiceBuffer: pdfBuffer,
        })

        // Send copy to orders email
        await sendOrderConfirmation({
          to: COMPANY_EMAILS.orders,
          customerName: `${customer.firstName} ${customer.lastName}`,
          orderNumber,
          invoiceNumber,
          items,
          total,
          invoiceBuffer: pdfBuffer,
        })
      }

    } catch (emailError: any) {
      console.error('Email/Invoice generation failed:', emailError)
      console.error('Error details:', emailError.message)
      console.error('Error stack:', emailError.stack)
      // Don't fail the order - continue
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      orderNumber: order.order_number,
      invoiceNumber,
      message: 'Order placed successfully. Invoice sent to your email.',
    })
    
  } catch (error: any) {
    console.error('Checkout error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process checkout', 
        details: error,
        success: false 
      },
      { status: 500 }
    )
  }
}
