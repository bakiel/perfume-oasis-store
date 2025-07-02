import { sendEmail, emailTemplates } from './email-service'

interface OrderConfirmationProps {
  to: string
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
  invoiceBuffer?: Buffer
}

export async function sendOrderConfirmation({
  to,
  customerName,
  orderNumber,
  invoiceNumber,
  items,
  subtotal,
  delivery,
  total,
  deliveryAddress,
  invoiceBuffer
}: OrderConfirmationProps) {
  const emailData = {
    customerName,
    orderNumber,
    invoiceNumber,
    items,
    subtotal,
    delivery,
    total,
    deliveryAddress
  }

  const attachments = invoiceBuffer ? [{
    filename: `invoice-${invoiceNumber}.pdf`,
    content: invoiceBuffer
  }] : []

  return await sendEmail({
    to,
    subject: `Order Confirmation #${orderNumber} - Perfume Oasis`,
    html: emailTemplates.orderConfirmation(emailData),
    attachments,
    template: 'order_confirmation',
    metadata: {
      orderNumber,
      invoiceNumber,
      customerName,
      total
    }
  })
}