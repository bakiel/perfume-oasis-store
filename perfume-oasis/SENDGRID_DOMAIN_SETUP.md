# SendGrid Domain Authentication Setup for perfumeoasis.co.za

## Prerequisites
- SendGrid account (sign up at https://sendgrid.com)
- Access to your DNS management (Asurah)
- Domain: perfumeoasis.co.za

## Step 1: Access SendGrid Domain Authentication

1. Log in to SendGrid: https://app.sendgrid.com
2. Navigate to: **Settings** → **Sender Authentication**
3. Click **"Authenticate Your Domain"**

## Step 2: Domain Authentication Process

1. **Select DNS Host**: Choose "Other Host" (since Asurah isn't listed)
2. **Enter Domain**: Enter `perfumeoasis.co.za`
3. **Advanced Settings**:
   - Use automated security: Yes (recommended)
   - Use custom DKIM selector: No
   - Assign to a subuser: No (unless you have subusers)
4. Click **Next**

## Step 3: Add DNS Records to Asurah

SendGrid will provide you with DNS records. Add these to your Asurah DNS management:

### Typical Records (SendGrid will provide your specific values):

#### 1. CNAME Records for Domain Authentication:
| Name | Type | Value | TTL |
|------|------|-------|-----|
| em[XXXX] | CNAME | u[XXXXXXX].wl[XXX].sendgrid.net | 3600 |
| s1._domainkey | CNAME | s1._domainkey.perfumeoasis.co.za.sendgrid.net | 3600 |
| s2._domainkey | CNAME | s2._domainkey.perfumeoasis.co.za.sendgrid.net | 3600 |

#### 2. CNAME Records for Link Branding (optional but recommended):
| Name | Type | Value | TTL |
|------|------|-------|-----|
| url[XXXX] | CNAME | sendgrid.net | 3600 |
| [XXXX] | CNAME | sendgrid.net | 3600 |

#### 3. MX Record (if using Inbound Parse):
| Name | Type | Priority | Value | TTL |
|------|------|----------|-------|-----|
| mx | MX | 10 | mx.sendgrid.net | 3600 |

## Step 4: Verify Domain in SendGrid

1. After adding all DNS records, go back to SendGrid
2. Click **"Verify"** button
3. SendGrid will check your DNS records
4. If successful, you'll see green checkmarks

## Step 5: Update Your Application Code

### Install SendGrid Package:
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis
npm install @sendgrid/mail
```

### Update Environment Variables:

Add to your `.env.local`:
```env
# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=orders@perfumeoasis.co.za
SENDGRID_REPLY_TO_EMAIL=support@perfumeoasis.co.za
SENDGRID_FROM_NAME=Perfume Oasis

# Keep Resend as backup (optional)
RESEND_API_KEY=your-resend-api-key
```

### Create SendGrid Email Service:

Create `/lib/sendgrid.ts`:
```typescript
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  const msg = {
    to: options.to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: process.env.SENDGRID_FROM_NAME!
    },
    replyTo: process.env.SENDGRID_REPLY_TO_EMAIL!,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid');
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
}

// Send order confirmation with invoice
export async function sendOrderConfirmation(
  customerEmail: string,
  orderDetails: any,
  invoicePdf?: Buffer
) {
  const attachments = invoicePdf ? [{
    content: invoicePdf.toString('base64'),
    filename: `invoice-${orderDetails.orderNumber}.pdf`,
    type: 'application/pdf',
    disposition: 'attachment'
  }] : [];

  const html = `
    <h2>Thank you for your order!</h2>
    <p>Your order #${orderDetails.orderNumber} has been confirmed.</p>
    <p>We'll send you another email when your order ships.</p>
    <h3>Order Summary:</h3>
    <p>Total: R ${orderDetails.total}</p>
    <p>Items: ${orderDetails.itemCount}</p>
    ${invoicePdf ? '<p>Your invoice is attached to this email.</p>' : ''}
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Order Confirmation #${orderDetails.orderNumber} - Perfume Oasis`,
    html,
    attachments
  });
}
```

## Step 6: Important DNS Considerations

Since you already have email-related records for Asurah hosting:
- Keep your existing MX record pointing to `mail.perfumeoasis.co.za`
- SendGrid will work alongside your existing email setup
- SendGrid is for sending transactional emails
- Your existing setup handles receiving emails

## Step 7: Test Your Setup

1. Send a test email from SendGrid dashboard
2. Check domain authentication status
3. Monitor email delivery in SendGrid Activity Feed

## Best Practices

1. **Warm up your IP**: Start with low volume and gradually increase
2. **Monitor reputation**: Check SendGrid's sender reputation dashboard
3. **Use templates**: Create reusable templates in SendGrid
4. **Track engagement**: Monitor open rates and clicks
5. **Handle bounces**: Set up webhook for bounce handling

## Troubleshooting

### DNS Not Verifying?
- Wait 24-48 hours for propagation
- Check exact values (no extra spaces)
- Some DNS hosts auto-append domain names

### Emails Going to Spam?
- Complete domain authentication
- Set up link branding
- Maintain good sender reputation
- Use proper unsubscribe links

## SendGrid Features to Enable

1. **Event Webhook**: Track email events
2. **Inbound Parse**: Receive emails (optional)
3. **IP Warmup**: If using dedicated IP
4. **Suppressions**: Manage bounces and unsubscribes

## Support Resources

- SendGrid Docs: https://docs.sendgrid.com
- DNS Check: https://app.sendgrid.com/settings/sender_auth
- Support: https://support.sendgrid.com
