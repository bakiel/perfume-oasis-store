import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoiceDocument } from './invoice-template';

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      suburb: string;
      city: string;
      province: string;
      postalCode: string;
    };
  };
  items: Array<{
    product_name: string;
    product_brand: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  delivery: number;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  discount?: number;
  appliedPromotions?: Array<{
    name: string;
    type: string;
    discount_amount: number;
    code?: string;
  }>;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  try {
    // Generate PDF using React PDF
    const pdfBuffer = await renderToBuffer(<InvoiceDocument {...data} />);
    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation failed:', error);
    // Fallback to simple text buffer
    return generateSimpleInvoice(data);
  }
}

function generateSimpleInvoice(data: InvoiceData): Buffer {
  const bankDetails = `
BANK DETAILS:
Bank: First National Bank
Account Name: Perfume Oasis (Pty) Ltd
Account Number: 62859471234
Branch Code: 250655
Reference: ${data.orderNumber}
`;

  const simpleText = `
PERFUME OASIS
Tax Invoice

INVOICE #${data.invoiceNumber}
Order #${data.orderNumber}
Date: ${new Date(data.date).toLocaleDateString('en-ZA')}

BILL TO:
${data.customer.name}
${data.customer.email}
${data.customer.phone}
${data.customer.address.street}
${data.customer.address.suburb}, ${data.customer.address.city}
${data.customer.address.province}, ${data.customer.address.postalCode}

ITEMS:
${data.items.map(item => 
  `${item.product_name} (${item.product_brand})\n` +
  `  Qty: ${item.quantity} × R${item.price.toFixed(2)} = R${item.subtotal.toFixed(2)}`
).join('\n')}

SUBTOTAL: R${data.subtotal.toFixed(2)}${
  data.appliedPromotions && data.appliedPromotions.length > 0 
    ? '\n\nPROMOTIONS:\n' + data.appliedPromotions.map(promo => 
        `${promo.name}${promo.code ? ` (${promo.code})` : ''}: -R${promo.discount_amount.toFixed(2)}`
      ).join('\n')
    : data.discount && data.discount > 0 
      ? `\nDISCOUNT: -R${data.discount.toFixed(2)}`
      : ''
}
DELIVERY: R${data.delivery.toFixed(2)}
TOTAL: R${data.total.toFixed(2)}

Payment Method: ${data.paymentMethod}
Payment Status: ${data.paymentStatus}

${bankDetails}

Thank you for your order!
Perfume Oasis - Refresh Your Senses
www.perfumeoasis.co.za
  `.trim();
  
  return Buffer.from(simpleText, 'utf-8');
}
