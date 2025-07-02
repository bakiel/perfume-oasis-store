export function getOrderConfirmationTemplate({
  orderNumber,
  customerName,
  orderDate,
  items,
  subtotal,
  delivery,
  total,
  deliveryAddress,
  trackingUrl,
  invoiceUrl
}: {
  orderNumber: string
  customerName: string
  orderDate: string
  items: Array<{
    name: string
    brand: string
    quantity: number
    price: number
    subtotal: number
    image?: string
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
  trackingUrl?: string
  invoiceUrl?: string
}) {
  const formatCurrency = (amount: number) => `R${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Perfume Oasis</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0E5C4A; padding: 30px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">
                                            PERFUME OASIS
                                        </h1>
                                        <p style="margin: 10px 0 0 0; color: #C8A95B; font-size: 14px; letter-spacing: 2px;">
                                            PREMIUM FRAGRANCES
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Order Confirmation Message -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #eeeeee;">
                            <img src="https://perfumeoasis.co.za/images/icons/checkmark.png" alt="Success" width="60" height="60" style="margin-bottom: 20px;">
                            <h2 style="margin: 0 0 10px 0; color: #0E5C4A; font-size: 28px;">Order Confirmed!</h2>
                            <p style="margin: 0; color: #666666; font-size: 16px;">
                                Thank you for your order, ${customerName}
                            </p>
                            <p style="margin: 10px 0 0 0; color: #666666; font-size: 14px;">
                                Order #${orderNumber} • ${orderDate}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 30px;">
                            <h3 style="margin: 0 0 20px 0; color: #333333; font-size: 20px;">Order Summary</h3>
                            
                            <!-- Items -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                ${items.map(item => `
                                <tr>
                                    <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="80" valign="top">
                                                    ${item.image ? `
                                                    <img src="${item.image}" alt="${item.name}" width="80" height="80" style="border-radius: 8px; object-fit: cover;">
                                                    ` : `
                                                    <div style="width: 80px; height: 80px; background-color: #f0f0f0; border-radius: 8px;"></div>
                                                    `}
                                                </td>
                                                <td style="padding-left: 20px;" valign="top">
                                                    <h4 style="margin: 0 0 5px 0; color: #333333; font-size: 16px;">${item.name}</h4>
                                                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">${item.brand}</p>
                                                    <p style="margin: 0; color: #999999; font-size: 14px;">Qty: ${item.quantity} × ${formatCurrency(item.price)}</p>
                                                </td>
                                                <td align="right" valign="top">
                                                    <p style="margin: 0; color: #0E5C4A; font-size: 16px; font-weight: bold;">
                                                        ${formatCurrency(item.subtotal)}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                `).join('')}
                            </table>
                            
                            <!-- Totals -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px;">
                                <tr>
                                    <td align="right" style="padding: 10px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding: 5px 20px 5px 0; color: #666666;">Subtotal:</td>
                                                <td style="padding: 5px 0; color: #333333; font-weight: bold; width: 100px; text-align: right;">
                                                    ${formatCurrency(subtotal)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 5px 20px 5px 0; color: #666666;">Delivery:</td>
                                                <td style="padding: 5px 0; color: #333333; font-weight: bold; text-align: right;">
                                                    ${delivery === 0 ? 'FREE' : formatCurrency(delivery)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 10px; border-top: 2px solid #0E5C4A;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 20px 10px 0; color: #0E5C4A; font-size: 18px; font-weight: bold;">Total:</td>
                                                <td style="padding: 10px 0; color: #0E5C4A; font-size: 18px; font-weight: bold; text-align: right;">
                                                    ${formatCurrency(total)}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Delivery Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #f8f8f8; border-radius: 8px; padding: 20px;">
                                <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px;">Delivery Information</h3>
                                <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                    ${deliveryAddress.street}<br>
                                    ${deliveryAddress.suburb}, ${deliveryAddress.city}<br>
                                    ${deliveryAddress.province}, ${deliveryAddress.postalCode}
                                </p>
                                <p style="margin: 15px 0 0 0; color: #666666; font-size: 14px;">
                                    <strong>Estimated Delivery:</strong> 2-3 business days
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Payment Instructions -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #0E5C4A; color: #ffffff; border-radius: 8px; padding: 20px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 18px;">Payment Instructions</h3>
                                <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                                    Please make payment via bank transfer to complete your order:
                                </p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(255,255,255,0.1); border-radius: 4px; padding: 15px;">
                                    <tr>
                                        <td style="padding: 3px 0; font-size: 14px;">
                                            <strong>Bank:</strong> Nedbank<br>
                                            <strong>Account:</strong> Torrencial<br>
                                            <strong>Account No:</strong> 1313614866<br>
                                            <strong>Branch Code:</strong> 198765<br>
                                            <strong>Reference:</strong> <span style="color: #C8A95B; font-weight: bold;">${orderNumber}</span>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin: 15px 0 0 0; font-size: 13px; line-height: 1.6;">
                                    Please email proof of payment to: <a href="mailto:orders@perfumeoasis.co.za" style="color: #C8A95B;">orders@perfumeoasis.co.za</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Action Buttons -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            ${invoiceUrl ? `
                            <a href="${invoiceUrl}" style="display: inline-block; padding: 15px 30px; background-color: #0E5C4A; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 0 10px;">
                                Download Invoice
                            </a>
                            ` : ''}
                            ${trackingUrl ? `
                            <a href="${trackingUrl}" style="display: inline-block; padding: 15px 30px; background-color: #C8A95B; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 0 10px;">
                                Track Order
                            </a>
                            ` : ''}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                                Need help? Contact us:
                            </p>
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px;">
                                <a href="tel:+27824801311" style="color: #0E5C4A; text-decoration: none;">+27 82 480 1311</a> | 
                                <a href="mailto:info@perfumeoasis.co.za" style="color: #0E5C4A; text-decoration: none;">info@perfumeoasis.co.za</a>
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © 2025 Perfume Oasis. All rights reserved.<br>
                                Torrencial (Pty) Ltd | Company Reg: 2025/213013/07
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
}