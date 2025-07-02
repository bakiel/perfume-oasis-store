import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key from environment variable
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

if (!SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY environment variable is not set')
} else {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

// Company email addresses
export const COMPANY_EMAILS = {
  orders: 'orders@perfumeoasis.co.za',
  info: 'info@perfumeoasis.co.za',
  noreply: 'noreply@perfumeoasis.co.za',
  support: 'support@perfumeoasis.co.za'
}

// Email template IDs (if using SendGrid templates)
export const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: 'order-confirmation',
  INVOICE: 'invoice',
  SHIPPING_NOTIFICATION: 'shipping-notification',
  WELCOME: 'welcome'
}

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = COMPANY_EMAILS.orders,
  attachments = []
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  attachments?: Array<{
    content: string
    filename: string
    type?: string
    disposition?: string
  }>
}) {
  try {
    const msg = {
      to,
      from: {
        email: from,
        name: 'Perfume Oasis'
      },
      subject,
      text: text || subject,
      html,
      attachments
    }

    const response = await sgMail.send(msg)
    console.log('Email sent successfully:', response[0].statusCode)
    return { success: true, messageId: response[0].headers['x-message-id'] }
  } catch (error: any) {
    console.error('SendGrid error:', error)
    if (error.response) {
      console.error('SendGrid response error:', error.response.body)
    }
    return { success: false, error: error.message }
  }
}

// Send multiple emails
export async function sendMultipleEmails(messages: any[]) {
  try {
    const response = await sgMail.send(messages)
    console.log('Multiple emails sent successfully')
    return { success: true, response }
  } catch (error: any) {
    console.error('SendGrid error:', error)
    return { success: false, error: error.message }
  }
}