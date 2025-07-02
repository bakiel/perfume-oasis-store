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
    
    // Generate idempotency key to prevent duplicate orders
    const idempotencyKey = `${customer.email}-${items.map((i: any) => i.id).join('-')}-${timestamp}`

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
    
    // Check for duplicate order using idempotency key - with error handling
    let existingOrder = null
    try {
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, invoice_number')
        .eq('idempotency_key', idempotencyKey)
        .single()
      
      existingOrder = data
    } catch (error) {
      // If idempotency_key column doesn't exist, continue without it
      console.log('Idempotency check skipped:', error)
    }
    
    if (existingOrder) {
      console.log('Duplicate order detected, returning existing order:', existingOrder)
      return NextResponse.json({ 
        success: true, 
        orderId: existingOrder.id,
        orderNumber: existingOrder.order_number,
        invoiceNumber: existingOrder.invoice_number,
        message: 'Order already processed.',
      })
    }

    // Create the order
    const orderId = crypto.randomUUID()
    
    // Prepare order data - with fallback for schema issues
    const baseOrderData: any = {
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
        status: 'pending',
        payment_method: 'bank_transfer',
        payment_status: 'pending',
        user_id: userId, // Can be null for guest checkout
    }
    
    // Try to add idempotency_key if the column exists
    let orderData = { ...baseOrderData }
    try {
      // First attempt with idempotency_key
      orderData.idempotency_key = idempotencyKey
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) {
        // If error mentions idempotency_key, retry without it
        if (orderError.message?.includes('idempotency_key')) {
          console.log('Retrying without idempotency_key...')
          delete orderData.idempotency_key
          
          const { data: retryOrder, error: retryError } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single()
          
          if (retryError) {
            throw retryError
          }
          
          // Continue with the retry order
          await processOrder(retryOrder, items, supabase, customer, orderNumber, invoiceNumber, subtotal, delivery, total)
          
          return NextResponse.json({ 
            success: true, 
            orderId: retryOrder.id,
            orderNumber: retryOrder.order_number,
            invoiceNumber,
            message: 'Order placed successfully. Invoice sent to your email.',
          })
        } else {
          throw orderError
        }
      }

      // Continue with the successful order
      await processOrder(order, items, supabase, customer, orderNumber, invoiceNumber, subtotal, delivery, total)
      
      return NextResponse.json({ 
        success: true, 
        orderId: order.id,
        orderNumber: order.order_number,
        invoiceNumber,
        message: 'Order placed successfully. Invoice sent to your email.',
      })
      
    } catch (error: any) {
      console.error('Order creation failed:', JSON.stringify(error, null, 2))
      console.error('Order data attempted:', orderData)
      throw new Error(`Failed to create order: ${error.message || JSON.stringify(error)}`)
    }
    
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

// Helper function to process order after creation
async function processOrder(
  order: any, 
  items: any[], 
  supabase: any, 
  customer: any, 
  orderNumber: string, 
  invoiceNumber: string, 
  subtotal: number, 
  delivery: number, 
  total: number
) {
  // Filter out invalid items and check inventory
  const validItems = []
  const invalidItems = []
  
  for (const item of items) {
    // Check current inventory
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock_quantity, name, price')
      .eq('id', item.id)
      .single()
    
    if (productError || !product) {
      console.error('Product not found:', item.id, item.name)
      invalidItems.push(item.name)
      continue // Skip this item instead of failing
    }
    
    // Validate price hasn't changed
    if (parseFloat(product.price) !== item.price) {
      console.error('Price mismatch:', item.name, 'expected:', item.price, 'actual:', product.price)
      invalidItems.push(`${item.name} (price changed)`)
      continue // Skip this item
    }
    
    // Check if enough inventory
    if (product.stock_quantity < item.quantity) {
      console.error(`Insufficient inventory for ${product.name}. Only ${product.stock_quantity} available.`)
      invalidItems.push(`${item.name} (insufficient stock)`)
      continue // Skip this item
    }
    
    // Item is valid, add to valid items
    validItems.push({...item, product})
  }
  
  // If no valid items, rollback and return error
  if (validItems.length === 0) {
    await supabase.from('orders').delete().eq('id', order.id)
    throw new Error('All items in your cart are unavailable. Please add new products and try again.')
  }
  
  // Update inventory for valid items only
  for (const validItem of validItems) {
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        stock_quantity: validItem.product.stock_quantity - validItem.quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', validItem.id)
    
    if (updateError) {
      console.error('Failed to update inventory:', updateError)
      // Continue anyway - order is more important than inventory tracking
    }
  }

  // Create order items for valid items only
  const orderItems = validItems.map((item: any) => ({
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
    items: validItems.map((item: any) => ({
      product_name: item.name,
      product_brand: item.brand || 'Unknown',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    })),
    subtotal: subtotal,
    delivery: delivery || 0,
    total: total,
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
  }

  try {
    // Generate PDF invoice
    console.log('Attempting to generate PDF invoice...')
    const pdfBuffer = await generateInvoicePDF(invoiceData)
    console.log('PDF generated successfully, size:', pdfBuffer.length)
    
    // Store invoice PDF reference
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        order_id: order.id,
        invoice_number: invoiceNumber,
        amount: total,
        pdf_url: `invoices/${invoiceNumber}.pdf`,
        status: 'sent',
      })

    if (invoiceError) {
      console.error('Invoice record creation failed:', invoiceError)
    }

    // Send order confirmation email with invoice
    await sendOrderConfirmation({
      to: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      orderNumber,
      invoiceNumber,
      items: validItems,
      subtotal: subtotal,
      delivery: delivery || 0,
      total: total,
      deliveryAddress: {
        street: customer.street,
        suburb: customer.suburb,
        city: customer.city,
        province: customer.province,
        postalCode: customer.postalCode,
      },
      invoiceBuffer: pdfBuffer,
    })

  } catch (emailError: any) {
    console.error('Email/Invoice generation failed:', emailError)
    console.error('Error details:', emailError.message)
    console.error('Error stack:', emailError.stack)
    // Don't fail the order - continue
  }
}