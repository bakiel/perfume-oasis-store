import { sendEmail, COMPANY_EMAILS } from './sendgrid-service'
import { getOrderConfirmationTemplate } from './templates/order-confirmation-template'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'
import { createServiceClient } from '@/lib/supabase/server'

export interface OrderEmailData {
  orderId: string
  customerEmail: string
  customerName: string
}

export async function sendOrderConfirmationEmail({ orderId, customerEmail, customerName }: OrderEmailData) {
  try {
    const supabase = await createServiceClient()
    
    // Fetch order details
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            name,
            brand:brands (name),
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single()
    
    if (error || !order) {
      console.error('Failed to fetch order:', error)
      return { success: false, error: 'Order not found' }
    }
    
    // Parse delivery address
    const deliveryAddress = typeof order.delivery_address === 'string' 
      ? JSON.parse(order.delivery_address) 
      : order.delivery_address
    
    // Prepare email template data
    const emailData = {
      orderNumber: order.order_number,
      customerName: customerName,
      orderDate: new Date(order.created_at).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      items: order.order_items?.map((item: any) => ({
        name: item.product?.name || 'Product',
        brand: item.product?.brand?.name || '',
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        imageUrl: item.product?.image_url || '/images/placeholder.jpg'
      })) || [],
      subtotal: order.subtotal || order.total,
      delivery: order.delivery_fee || 0,
      total: order.total || order.total_amount,
      deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.suburb}, ${deliveryAddress.city}, ${deliveryAddress.province} ${deliveryAddress.postalCode}`,
      trackingUrl: `https://perfumeoasis.co.za/track-order?order=${order.order_number}`
    }
    
    // Generate invoice PDF
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
    
    const pdfBuffer = await generateInvoicePDF(invoiceData)
    
    // Convert PDF buffer to base64 for email attachment
    const pdfBase64 = pdfBuffer.toString('base64')
    
    // Get email HTML
    const emailHtml = getOrderConfirmationTemplate(emailData)
    
    // Send email with invoice attachment
    const result = await sendEmail({
      to: customerEmail,
      subject: `Order Confirmation - ${order.order_number} | Perfume Oasis`,
      html: emailHtml,
      text: `Thank you for your order ${order.order_number}. Your invoice is attached.`,
      from: COMPANY_EMAILS.orders,
      attachments: [{
        content: pdfBase64,
        filename: `invoice-${order.order_number}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }]
    })
    
    if (result.success) {
      // Update order with email sent status
      await supabase
        .from('orders')
        .update({ 
          confirmation_email_sent: true,
          confirmation_email_sent_at: new Date().toISOString()
        })
        .eq('id', orderId)
    }
    
    return result
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error: error.message }
  }
}

// Send order shipped notification
export async function sendOrderShippedEmail({ 
  orderId, 
  trackingNumber,
  courier
}: {
  orderId: string
  trackingNumber?: string
  courier?: string
}) {
  try {
    const supabase = await createServiceClient()
    
    const { data: order, error } = await supabase
      .from('orders')
      .select('order_number, customer_email, customer_name')
      .eq('id', orderId)
      .single()
    
    if (error || !order) {
      return { success: false, error: 'Order not found' }
    }
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Order Has Been Shipped!</h1>
        <p>Dear ${order.customer_name},</p>
        <p>Great news! Your order <strong>${order.order_number}</strong> has been shipped.</p>
        ${trackingNumber ? `
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p><strong>Courier:</strong> ${courier || 'Standard Delivery'}</p>
        ` : ''}
        <p>You can track your order status at any time by visiting:</p>
        <a href="https://perfumeoasis.co.za/track-order?order=${order.order_number}" 
           style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
          Track Your Order
        </a>
      </div>
    `
    
    return await sendEmail({
      to: order.customer_email,
      subject: `Order Shipped - ${order.order_number} | Perfume Oasis`,
      html: emailHtml,
      from: COMPANY_EMAILS.orders
    })
  } catch (error: any) {
    console.error('Error sending shipped notification:', error)
    return { success: false, error: error.message }
  }
}