import { Resend } from 'resend'
import { formatCurrency } from '@/lib/utils'

interface SendInvoiceEmailProps {
  order: any
  customer: any
  invoicePdf: Buffer
}

export async function sendInvoiceEmail({ 
  order, 
  customer, 
  invoicePdf 
}: SendInvoiceEmailProps) {
  // Initialize Resend only when the function is called
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email send')
    return null
  }
  
  const resend = new Resend(process.env.RESEND_API_KEY)
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Perfume Oasis</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2C2C2C;
            margin: 0;
            padding: 0;
            background-color: #F6F3EF;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
          }
          .header {
            background-color: #0E5C4A;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .header p {
            margin: 5px 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 20px;
            color: #0E5C4A;
            margin-bottom: 20px;
          }
          .order-box {
            background-color: #F6F3EF;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .order-number {
            font-size: 24px;
            font-weight: bold;
            color: #0E5C4A;
            margin-bottom: 10px;
          }
          .payment-instructions {
            background-color: #FFF9E6;
            border: 2px solid #C8A95B;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .payment-instructions h3 {
            color: #0E5C4A;
            margin-top: 0;
          }
          .bank-details {
            background-color: white;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            font-family: monospace;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #C8A95B;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            background-color: #F6F3EF;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            margin: 0 10px;
            color: #0E5C4A;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PERFUME OASIS</h1>
            <p>Refresh your senses</p>
          </div>
          
          <div class="content">
            <h2 class="greeting">Thank you for your order, ${customer.firstName}!</h2>
            
            <p>We're delighted to confirm that we've received your order. Your luxury fragrances will be on their way to you soon!</p>
            
            <div class="order-box">
              <div class="order-number">Order #${order.order_number}</div>
              <p><strong>Total Amount:</strong> ${formatCurrency(order.total_amount)}</p>
              <p><strong>Delivery Address:</strong><br>
              ${order.delivery_address.street}<br>
              ${order.delivery_address.suburb}, ${order.delivery_address.city}<br>
              ${order.delivery_address.province}, ${order.delivery_address.postal_code}</p>
            </div>
            
            <div class="payment-instructions">
              <h3>🏦 Payment Instructions</h3>
              <p>Please complete your payment via bank transfer to secure your order:</p>
              
              <div class="bank-details">
                <strong>Bank:</strong> Standard Bank<br>
                <strong>Account Name:</strong> Perfume Oasis (Pty) Ltd<br>
                <strong>Account Number:</strong> 123 456 7890<br>
                <strong>Branch Code:</strong> 051001<br>
                <strong>Reference:</strong> ${order.order_number}
              </div>
              
              <p><strong>Important:</strong> Please email your proof of payment to <a href="mailto:orders@perfumeoasis.co.za">orders@perfumeoasis.co.za</a> to expedite processing.</p>
            </div>
            
            <h3>What happens next?</h3>
            <ol>
              <li>Complete your payment using the details above</li>
              <li>Send proof of payment to our orders team</li>
              <li>We'll confirm payment and prepare your order</li>
              <li>Your fragrances will be delivered within 2-3 business days</li>
            </ol>
            
            <p>Your detailed invoice is attached to this email for your records.</p>
            
            <center>
              <a href="https://perfumeoasis.co.za/account/orders/${order.id}" class="button">
                View Order Status
              </a>
            </center>
            
            <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:support@perfumeoasis.co.za">support@perfumeoasis.co.za</a> or WhatsApp us on +27 XX XXX XXXX.</p>
            
            <p>Thank you for choosing Perfume Oasis!</p>
            
            <p>Warm regards,<br>
            <strong>The Perfume Oasis Team</strong></p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">WhatsApp</a>
            </div>
            <p>© 2024 Perfume Oasis. All rights reserved.<br>
            South Africa's Premier Fragrance Destination</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: 'Perfume Oasis <orders@perfumeoasis.co.za>',
      to: [customer.email],
      subject: `Order Confirmation #${order.order_number} - Perfume Oasis`,
      html: emailHtml,
      attachments: [
        {
          filename: `invoice-${order.order_number}.pdf`,
          content: invoicePdf.toString('base64'),
        },
      ],
    })

    if (error) {
      console.error('Email send error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send invoice email:', error)
    // Don't throw - we don't want to fail the order if email fails
    // Could implement a retry queue here
  }
}