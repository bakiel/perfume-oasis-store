// Test Email Configuration for Perfume Oasis
// Order: PO1751474973173
// Customer: bakielisrael@gmail.com

const emailData = {
  to: "bakielisrael@gmail.com",
  from: "orders@perfumeoasis.co.za",
  replyTo: "support@perfumeoasis.co.za",
  subject: "Order Confirmation - PO1751474973173 | Perfume Oasis",
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0E5C4A; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .order-details { background-color: #f4f4f4; padding: 15px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Perfume Oasis</h1>
      <p>Thank you for your order!</p>
    </div>
    
    <div class="content">
      <h2>Order Confirmation</h2>
      <p>Dear Zenzele Nxumalo,</p>
      <p>We've received your order and will process it shortly. Here are your order details:</p>
      
      <div class="order-details">
        <p><strong>Order Number:</strong> PO1751474973173</p>
        <p><strong>Order Date:</strong> July 2, 2025</p>
        <p><strong>Total Amount:</strong> R650.00</p>
      </div>
      
      <h3>Order Items</h3>
      <table>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        <tr>
          <td>NUDO Sweet Berries</td>
          <td>2</td>
          <td>R250.00</td>
          <td>R500.00</td>
        </tr>
      </table>
      
      <div class="order-details">
        <p><strong>Subtotal:</strong> R500.00</p>
        <p><strong>Delivery Fee:</strong> R150.00</p>
        <p><strong>Total:</strong> R650.00</p>
      </div>
      
      <h3>Delivery Address</h3>
      <p>
        41 Moffat Rd, Unit 4 Rus. Biejie<br>
        Bela-Bela, Bela-Bela<br>
        Limpopo, 0480
      </p>
      
      <h3>Payment Information</h3>
      <p>Please make your payment to:</p>
      <div class="order-details">
        <p><strong>Bank:</strong> First National Bank (FNB)</p>
        <p><strong>Account Name:</strong> Perfume Oasis</p>
        <p><strong>Account Number:</strong> 62987654321</p>
        <p><strong>Reference:</strong> PO1751474973173</p>
      </div>
      
      <p>Once payment is confirmed, we'll dispatch your order within 1-2 business days for delivery in 3-7 working days.</p>
    </div>
    
    <div class="footer">
      <p>If you have any questions, please contact us at support@perfumeoasis.co.za</p>
      <p>&copy; 2025 Perfume Oasis. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `,
  text: `
Order Confirmation - PO1751474973173

Dear Zenzele Nxumalo,

Thank you for your order! We've received your order and will process it shortly.

Order Details:
- Order Number: PO1751474973173
- Order Date: July 2, 2025
- Total Amount: R650.00

Order Items:
- NUDO Sweet Berries x2 @ R250.00 = R500.00

Summary:
- Subtotal: R500.00
- Delivery Fee: R150.00
- Total: R650.00

Delivery Address:
41 Moffat Rd, Unit 4 Rus. Biejie
Bela-Bela, Bela-Bela
Limpopo, 0480

Payment Information:
Bank: First National Bank (FNB)
Account Name: Perfume Oasis
Account Number: 62987654321
Reference: PO1751474973173

Once payment is confirmed, we'll dispatch your order within 1-2 business days for delivery in 3-7 working days.

If you have any questions, please contact us at support@perfumeoasis.co.za

© 2025 Perfume Oasis. All rights reserved.
  `
};

console.log("Email data prepared for sending:");
console.log("To:", emailData.to);
console.log("Subject:", emailData.subject);
console.log("\nSendGrid API Key is configured in Vercel environment variables");
console.log("The email will be sent automatically when new orders are created");
