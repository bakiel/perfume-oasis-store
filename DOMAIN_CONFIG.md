# Perfume Oasis - Domain Configuration

## Primary Domain
- **Website**: https://perfumeoasis.co.za
- **Country**: South Africa (.co.za)

## Email Addresses
- **Orders**: orders@perfumeoasis.co.za
- **Support**: support@perfumeoasis.co.za
- **Info**: info@perfumeoasis.co.za
- **Admin**: admin@perfumeoasis.co.za

## Vercel Configuration
When deploying to Vercel, you'll need to:

1. **Add Custom Domain**
   - Go to Vercel Dashboard → Settings → Domains
   - Add: `perfumeoasis.co.za`
   - Add: `www.perfumeoasis.co.za`

2. **DNS Configuration**
   Update your DNS records at your domain registrar:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com.
   ```

3. **SSL Certificate**
   - Vercel will automatically provision SSL certificates
   - Both perfumeoasis.co.za and www.perfumeoasis.co.za will be secured

## Environment Variables
Update these in Vercel dashboard:
```
NEXT_PUBLIC_SITE_URL=https://perfumeoasis.co.za
FROM_EMAIL=orders@perfumeoasis.co.za
REPLY_TO_EMAIL=support@perfumeoasis.co.za
```

## Email Service Configuration
When setting up SendGrid or other email service:
- **Sender Domain**: perfumeoasis.co.za
- **Default From**: orders@perfumeoasis.co.za
- **Reply To**: support@perfumeoasis.co.za

## Brand Email Signatures
```
Perfume Oasis
Refresh your senses
https://perfumeoasis.co.za
```

## Legal Pages URLs
- Terms of Service: https://perfumeoasis.co.za/terms
- Privacy Policy: https://perfumeoasis.co.za/privacy
- Refund Policy: https://perfumeoasis.co.za/refunds
- Shipping Policy: https://perfumeoasis.co.za/shipping

## Social Media Handles
(To be configured)
- Instagram: @perfumeoasisza
- Facebook: /perfumeoasisza
- Twitter: @perfumeoasisza

## SEO Configuration
```xml
<link rel="canonical" href="https://perfumeoasis.co.za" />
<meta property="og:url" content="https://perfumeoasis.co.za" />
```

## Payment Instructions Footer
```
Perfume Oasis (Pty) Ltd
South Africa
orders@perfumeoasis.co.za
https://perfumeoasis.co.za
```
