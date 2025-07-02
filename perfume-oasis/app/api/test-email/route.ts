import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/sendgrid-service'
import { sendOrderConfirmationEmail } from '@/lib/email/order-email-service'

export async function POST(request: NextRequest) {
  try {
    const { type, email, orderId } = await request.json()
    
    if (type === 'simple') {
      // Test simple email
      const result = await sendEmail({
        to: email || 'asurah.info@gmail.com',
        subject: 'Test Email from Perfume Oasis',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Test Email</h1>
            <p>This is a test email from Perfume Oasis to verify SendGrid integration.</p>
            <p>If you received this, the email service is working correctly!</p>
            <hr />
            <p style="color: #666; font-size: 12px;">
              Sent from Perfume Oasis<br />
              <a href="https://perfumeoasis.co.za">perfumeoasis.co.za</a>
            </p>
          </div>
        `,
        text: 'This is a test email from Perfume Oasis.'
      })
      
      return NextResponse.json(result)
    } else if (type === 'order' && orderId) {
      // Test order confirmation email
      const result = await sendOrderConfirmationEmail({
        orderId,
        customerEmail: email || 'asurah.info@gmail.com',
        customerName: 'Test Customer'
      })
      
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: 'Invalid test type. Use "simple" or "order" (with orderId)' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint to check configuration
export async function GET() {
  const hasApiKey = !!process.env.SENDGRID_API_KEY
  const apiKeyPreview = process.env.SENDGRID_API_KEY 
    ? `SG.${process.env.SENDGRID_API_KEY.slice(3, 10)}...`
    : 'Not set'
  
  return NextResponse.json({
    configured: hasApiKey,
    apiKeyPreview,
    fromEmails: {
      orders: 'orders@perfumeoasis.co.za',
      info: 'info@perfumeoasis.co.za',
      noreply: 'noreply@perfumeoasis.co.za',
      support: 'support@perfumeoasis.co.za'
    },
    note: 'Use POST with { type: "simple", email: "test@example.com" } to send test email'
  })
}