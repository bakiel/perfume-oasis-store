// Simple invoice data structure for now
// PDF generation will be handled client-side or with a different approach

export interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: string
  customer: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      suburb: string
      city: string
      province: string
      postalCode: string
    }
  }
  items: Array<{
    product_name: string
    product_brand: string
    quantity: number
    price: number
    subtotal: number
  }>
  subtotal: number
  delivery: number
  total: number
  paymentStatus: string
  paymentMethod: string
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  // For now, return a simple buffer
  // In production, you would use a proper PDF generation service
  const simpleText = `
INVOICE #${data.invoiceNumber}
Order #${data.orderNumber}
Date: ${data.date}

Customer: ${data.customer.name}
Email: ${data.customer.email}
Phone: ${data.customer.phone}

Items:
${data.items.map(item => `${item.product_name} x${item.quantity} - R${item.price}`).join('\n')}

Subtotal: R${data.subtotal}
Delivery: R${data.delivery}
Total: R${data.total}

Payment Method: ${data.paymentMethod}
Payment Status: ${data.paymentStatus}
  `.trim()
  
  return Buffer.from(simpleText, 'utf-8')
}