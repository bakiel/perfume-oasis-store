# Perfume Oasis Payment System

## Overview
Perfume Oasis uses an invoice-based payment system where customers place orders and receive PDF invoices via email with payment instructions.

## Payment Flow

### 1. Order Placement
- Customer adds items to cart
- Proceeds to checkout
- Fills in shipping/billing information
- Reviews order summary
- Confirms order (no immediate payment)

### 2. Invoice Generation
- System generates order number
- Creates PDF invoice using PDFKit
- Invoice includes:
  - Order details
  - Customer information
  - Itemized product list
  - Shipping costs
  - Tax calculations
  - Total amount due
  - Payment instructions
  - Bank account details

### 3. Email Notification
- Invoice PDF attached to email
- Order confirmation details
- Payment instructions
- Expected delivery timeline

### 4. Payment Processing
- Customer makes bank transfer
- Admin manually verifies payment
- Order status updated to "paid"
- Fulfillment process begins

## Technical Implementation

### Dependencies
```json
{
  "dependencies": {
    "pdfkit": "^0.13.0",
    "@react-pdf/renderer": "^3.1.0",
    "nodemailer": "^6.9.0",
    "@sendgrid/mail": "^7.7.0"
  }
}
```

### Invoice Generation API
```typescript
// /api/invoices/generate
import PDFDocument from 'pdfkit';

export async function generateInvoice(order: Order) {
  const doc = new PDFDocument();
  
  // Add logo and header
  doc.image('logo.png', 50, 45, { width: 100 });
  doc.fontSize(20).text('INVOICE', 50, 160);
  
  // Add order details
  doc.fontSize(10)
    .text(`Order #: ${order.orderNumber}`, 50, 200)
    .text(`Date: ${new Date().toLocaleDateString()}`, 50, 215)
    .text(`Due Date: ${getDueDate()}`, 50, 230);
  
  // Add customer details
  // Add items table
  // Add totals
  // Add payment instructions
  
  return doc;
}
```

### Email Service
```typescript
// /api/emails/send-invoice
export async function sendInvoiceEmail(order: Order, invoicePdf: Buffer) {
  const msg = {
    to: order.email,
    from: 'orders@perfumeoasis.co.za',
    subject: `Order Confirmation #${order.orderNumber} - Perfume Oasis`,
    text: 'Thank you for your order...',
    html: generateEmailTemplate(order),
    attachments: [
      {
        content: invoicePdf.toString('base64'),
        filename: `invoice-${order.orderNumber}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };
  
  await sgMail.send(msg);
}
```

## Database Schema Updates

### Bank Account Information Table
```sql
CREATE TABLE IF NOT EXISTS payment_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    routing_number VARCHAR(100),
    swift_code VARCHAR(20),
    iban VARCHAR(50),
    account_type VARCHAR(50), -- 'checking', 'savings'
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment confirmations table
CREATE TABLE IF NOT EXISTS payment_confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    reference_number VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    confirmed_by UUID REFERENCES auth.users(id),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Admin Features

### Payment Management
- View pending payments
- Confirm payment receipt
- Match payments to orders
- Generate payment reports
- Send payment reminders

### Invoice Management
- Regenerate invoices
- Edit invoice details
- Bulk invoice generation
- Invoice template customization

## Invoice Template Structure

### Header
- Perfume Oasis logo
- Company details
- Invoice number
- Date issued

### Bill To
- Customer name
- Billing address
- Contact information

### Order Details
- Product table with:
  - Item description
  - Quantity
  - Unit price
  - Total

### Summary
- Subtotal
- Shipping
- Tax
- **Total Due**

### Payment Instructions
- Bank account details
- Payment reference
- Due date
- Contact information

## Configuration

### Environment Variables
```
# Email Service
SENDGRID_API_KEY=
FROM_EMAIL=orders@perfumeoasis.co.za
REPLY_TO_EMAIL=support@perfumeoasis.co.za

# Invoice Settings
INVOICE_DUE_DAYS=7
INVOICE_LOGO_URL=
COMPANY_NAME=Perfume Oasis
COMPANY_ADDRESS=
COMPANY_PHONE=
COMPANY_EMAIL=

# Bank Details (stored encrypted in DB)
```

## Security Considerations
1. Bank details stored encrypted
2. Invoice PDFs generated server-side only
3. Secure email delivery
4. Payment confirmation audit trail
5. Admin-only payment verification

## Customer Experience
1. Clear payment instructions
2. Professional invoice design
3. Timely email delivery
4. Payment confirmation emails
5. Order tracking updates
