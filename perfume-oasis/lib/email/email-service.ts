import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { COMPANY_EMAILS, EMAIL_CONFIG } from '@/lib/config/emails'

// Initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
  template?: string
  metadata?: Record<string, any>
}

export async function sendEmail(options: EmailOptions) {
  const {
    to,
    subject,
    html,
    text,
    from = `${EMAIL_CONFIG.fromName} <${COMPANY_EMAILS.noreply}>`,
    replyTo = COMPANY_EMAILS.support,
    attachments,
    template,
    metadata
  } = options

  // Log email to database
  const supabase = createServiceClient()
  
  try {
    // Create email log entry
    const { data: emailLog } = await supabase
      .from('email_logs')
      .insert({
        to_email: Array.isArray(to) ? to.join(', ') : to,
        from_email: from,
        subject,
        template,
        status: 'pending',
        metadata: metadata || {}
      })
      .select()
      .single()

    // If Resend is not configured, log and return
    if (!resend) {
      console.log('📧 Email (Resend not configured):', {
        to,
        from,
        subject,
        template,
        hasAttachments: attachments ? attachments.length : 0
      })

      // Update status to failed
      if (emailLog) {
        await supabase
          .from('email_logs')
          .update({
            status: 'failed',
            error_message: 'Resend API key not configured. Add RESEND_API_KEY to environment variables.'
          })
          .eq('id', emailLog.id)
      }

      return {
        success: false,
        error: 'Email service not configured'
      }
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || '',
      text,
      reply_to: replyTo,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: att.content
      }))
    })

    // Update email log with result
    if (emailLog) {
      await supabase
        .from('email_logs')
        .update({
          status: error ? 'failed' : 'sent',
          error_message: error?.message,
          sent_at: error ? null : new Date().toISOString()
        })
        .eq('id', emailLog.id)
    }

    if (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data,
      emailId: emailLog?.id
    }
  } catch (err) {
    console.error('Email service error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (data: {
    customerName: string
    orderNumber: string
    invoiceNumber: string
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
    subtotal: number
    delivery: number
    total: number
    deliveryAddress: {
      street: string
      suburb: string
      city: string
      province: string
      postalCode: string
    }
  }) => {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R ${item.price.toFixed(2)}</td>
      </tr>
    `).join('')

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - Perfume Oasis</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #0E5C4A; color: white; padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { background-color: #ffffff; padding: 30px; }
            .order-info { background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f8f8f8; padding: 12px; text-align: left; font-weight: 600; }
            .totals { margin-top: 20px; border-top: 2px solid #0E5C4A; padding-top: 20px; }
            .button { display: inline-block; background-color: #0E5C4A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">PERFUME OASIS</div>
              <div>Premium Fragrances</div>
            </div>
            
            <div class="content">
              <h2>Thank you for your order, ${data.customerName}!</h2>
              <p>We're pleased to confirm that we've received your order and it's being processed.</p>
              
              <div class="order-info">
                <strong>Order Number:</strong> ${data.orderNumber}<br>
                <strong>Invoice Number:</strong> ${data.invoiceNumber}<br>
                <strong>Order Date:</strong> ${new Date().toLocaleDateString('en-ZA')}
              </div>
              
              <h3>Order Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div class="totals">
                <table>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Subtotal:</strong></td>
                    <td style="text-align: right;">R ${data.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Delivery:</strong></td>
                    <td style="text-align: right;">${data.delivery === 0 ? 'FREE' : `R ${data.delivery.toFixed(2)}`}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-size: 18px;"><strong>Total:</strong></td>
                    <td style="text-align: right; font-size: 18px;"><strong>R ${data.total.toFixed(2)}</strong></td>
                  </tr>
                </table>
              </div>
              
              <h3>Delivery Address</h3>
              <div class="order-info">
                ${data.deliveryAddress.street}<br>
                ${data.deliveryAddress.suburb}, ${data.deliveryAddress.city}<br>
                ${data.deliveryAddress.province} ${data.deliveryAddress.postalCode}
              </div>
              
              <h3>Payment Instructions</h3>
              <p>Please make your payment to:</p>
              <div class="order-info">
                <strong>Bank:</strong> Nedbank<br>
                <strong>Account Name:</strong> Torrencial<br>
                <strong>Account Number:</strong> 1313614866<br>
                <strong>Branch Code:</strong> 198765<br>
                <strong>Reference:</strong> ${data.orderNumber}
              </div>
              
              <p><strong>Important:</strong> Please use your order number as the payment reference and email proof of payment to orders@perfumeoasis.co.za</p>
              
              <div style="text-align: center;">
                <a href="https://perfumeoasis.co.za/account/orders" class="button">View Order Status</a>
              </div>
            </div>
            
            <div class="footer">
              <p>If you have any questions about your order, please contact us at:<br>
              <a href="mailto:orders@perfumeoasis.co.za">orders@perfumeoasis.co.za</a> or call +27 82 480 1311</p>
              
              <p style="margin-top: 20px;">
                Perfume Oasis - Premium Fragrances<br>
                www.perfumeoasis.co.za
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  welcomeEmail: (data: { customerName: string }) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Perfume Oasis</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #0E5C4A; color: white; padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { background-color: #ffffff; padding: 30px; }
            .button { display: inline-block; background-color: #0E5C4A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">PERFUME OASIS</div>
              <div>Welcome to Premium Fragrances</div>
            </div>
            
            <div class="content">
              <h2>Welcome ${data.customerName}!</h2>
              <p>Thank you for joining Perfume Oasis, South Africa's destination for authentic luxury fragrances.</p>
              
              <p>As a valued customer, you'll enjoy:</p>
              <ul>
                <li>Access to exclusive fragrances from world-renowned brands</li>
                <li>Special member-only promotions and early access to sales</li>
                <li>Free delivery on orders over R1,000</li>
                <li>Personalized fragrance recommendations</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="https://perfumeoasis.co.za/products" class="button">Start Shopping</a>
              </div>
              
              <p>If you have any questions, our customer service team is here to help at info@perfumeoasis.co.za</p>
            </div>
            
            <div class="footer">
              <p>Perfume Oasis - Premium Fragrances<br>
              www.perfumeoasis.co.za | +27 82 480 1311</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}