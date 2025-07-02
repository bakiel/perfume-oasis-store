# Perfume Oasis - Client Handover Documentation

Welcome to your Perfume Oasis e-commerce platform! This guide will help you manage and operate your online perfume store effectively.

## Table of Contents
1. [System Overview](#system-overview)
2. [Getting Started - Setup Instructions](#getting-started)
3. [Admin Access](#admin-access)
4. [Managing Products](#managing-products)
5. [Managing Promotions & Specials](#managing-promotions)
6. [Processing Orders](#processing-orders)
7. [Daily Operations Checklist](#daily-operations)
8. [Troubleshooting Common Issues](#troubleshooting)
9. [Technical Requirements](#technical-requirements)
10. [Backup & Security](#backup-security)
11. [Support Contact](#support-contact)

---

## 1. System Overview {#system-overview}

### What is Perfume Oasis?
Perfume Oasis is your complete online perfume store solution featuring:
- 🛍️ Beautiful product catalog with 33 premium perfumes
- 🛒 Shopping cart and secure checkout
- 👤 Customer accounts and order history
- 📱 Mobile-friendly design
- 🎯 Admin dashboard for managing everything
- 📧 Automated order confirmations
- 📄 PDF invoice generation

### Technology Stack (for your IT team)
- **Frontend**: Next.js 14 with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Payment**: Ready for payment integration
- **Hosting**: Can be deployed on Vercel, Netlify, or similar platforms

---

## 2. Getting Started - Setup Instructions {#getting-started}

### Prerequisites
Before you begin, ensure you have:
1. A computer with internet access
2. A modern web browser (Chrome, Firefox, Safari, or Edge)
3. Access credentials (provided separately)
4. Supabase account details

### Initial Setup Steps

1. **Access Your Store**
   - Main website: `https://your-domain.com`
   - Admin panel: `https://your-domain.com/admin`

2. **First Time Login**
   - Go to the admin panel URL
   - Enter your admin email and password
   - You'll be directed to your dashboard

---

## 3. Admin Access {#admin-access}

### Accessing the Admin Panel

1. **Navigate to Admin**
   - Go to `https://your-domain.com/admin`
   - Or click "Admin" in the website footer (when logged in as admin)

2. **Login Credentials**
   - Email: [Your admin email]
   - Password: [Set during setup]
   - **Important**: Change your password after first login!

3. **Admin Dashboard Features**
   - View sales overview
   - Manage products
   - Process orders
   - View customer data
   - Generate reports

### Managing Admin Users

To add new admin users:
1. Contact your developer to add them to the database
2. They will need to be added with admin privileges in Supabase

---

## 4. Managing Products {#managing-products}

### Viewing Products
1. Go to Admin Dashboard → Products
2. You'll see a list of all products with:
   - Product images
   - Names and descriptions
   - Prices
   - Stock levels
   - Status (active/inactive)

### Adding New Products
1. Click "Add New Product" button
2. Fill in the required information:
   - **Product Name**: Enter the perfume name
   - **Brand**: Select or add new brand
   - **Description**: Write compelling product description
   - **Price**: Set the selling price
   - **Stock**: Enter quantity available
   - **Category**: Select appropriate category (Men/Women/Unisex)
   - **Images**: Upload high-quality product images
3. Click "Save Product"

### Editing Products
1. Find the product in your list
2. Click "Edit" button
3. Update any information
4. Click "Save Changes"

### Managing Inventory
1. Go to Admin → Products
2. Find the product
3. Update the "Stock" field
4. Save changes
5. Products with 0 stock will show as "Out of Stock"

### Best Practices
- Use high-quality images (recommended: 800x800px minimum)
- Write detailed descriptions including fragrance notes
- Keep stock levels updated daily
- Set products to "inactive" instead of deleting them

---

## 5. Managing Promotions & Specials {#managing-promotions}

### Creating Promotions
1. Go to Admin → Promotions
2. Click "Create New Promotion"
3. Set promotion details:
   - **Name**: Internal name for the promotion
   - **Display Text**: What customers will see
   - **Discount Type**: Percentage or fixed amount
   - **Discount Value**: Enter the discount
   - **Start/End Date**: Set promotion period
   - **Products**: Select which products are included

### Types of Promotions
- **Percentage Discounts**: e.g., "20% off selected items"
- **Fixed Discounts**: e.g., "$10 off"
- **Buy One Get One**: Set up as special promotion
- **Category Discounts**: Apply to entire categories

### Managing Active Promotions
1. View all promotions in Admin → Promotions
2. Active promotions show with green status
3. Edit or pause promotions as needed
4. Expired promotions are automatically deactivated

---

## 6. Processing Orders {#processing-orders}

### Order Management Workflow

1. **New Order Notification**
   - You'll receive email notifications for new orders
   - Orders appear in Admin → Orders with "New" status

2. **Processing Steps**
   ```
   New Order → Processing → Shipped → Delivered
   ```

3. **View Order Details**
   - Click on any order to see:
     - Customer information
     - Ordered items
     - Payment status
     - Shipping address
     - Order notes

4. **Update Order Status**
   - Open the order
   - Click "Update Status"
   - Select new status
   - Add tracking number (when shipping)
   - Customer receives automatic email updates

5. **Print Invoice**
   - Click "Download Invoice" button
   - PDF invoice generated automatically
   - Can be printed or emailed to customer

### Handling Refunds/Cancellations
1. Open the order
2. Click "Cancel Order" or "Process Refund"
3. Enter reason for records
4. Customer notified automatically

---

## 7. Daily Operations Checklist {#daily-operations}

### Morning Tasks (9:00 AM)
- [ ] Check new orders from overnight
- [ ] Review inventory levels
- [ ] Process pending orders
- [ ] Check for customer messages

### Afternoon Tasks (2:00 PM)
- [ ] Update tracking for shipped orders
- [ ] Review and respond to customer inquiries
- [ ] Check product stock levels
- [ ] Process afternoon orders

### End of Day (5:00 PM)
- [ ] Final order processing
- [ ] Update inventory if needed
- [ ] Review daily sales report
- [ ] Plan next day's shipments

### Weekly Tasks
- [ ] Review sales reports
- [ ] Update promotional materials
- [ ] Check for low stock items
- [ ] Plan inventory reorders
- [ ] Review customer feedback

---

## 8. Troubleshooting Common Issues {#troubleshooting}

### Customer Can't Login
**Problem**: Customer reports login issues
**Solution**:
1. Ask them to use "Forgot Password" link
2. Check if their email is registered
3. Clear browser cache and cookies
4. Try different browser

### Order Not Showing
**Problem**: Customer says order is missing
**Solution**:
1. Check order number in admin panel
2. Verify payment was completed
3. Check customer's email (including spam)
4. Look for incomplete checkouts

### Product Images Not Loading
**Problem**: Images appear broken
**Solution**:
1. Check image file size (keep under 2MB)
2. Re-upload images in JPG or PNG format
3. Clear browser cache
4. Check internet connection

### Payment Issues
**Problem**: Payment not processing
**Solution**:
1. Verify payment gateway is configured
2. Check for error messages
3. Try different payment method
4. Contact payment provider support

### Website Running Slowly
**Problem**: Pages load slowly
**Solution**:
1. Check your internet connection
2. Clear browser cache
3. Try different browser
4. Contact hosting support

---

## 9. Technical Requirements {#technical-requirements}

### Environment Variables Needed
Your developer will need to set these up:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service (if using)
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

# Payment Gateway (when ready)
PAYMENT_PUBLIC_KEY=your_payment_public_key
PAYMENT_SECRET_KEY=your_payment_secret_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Browser Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Hosting Requirements
- Node.js 18+
- 2GB RAM minimum
- SSL certificate (for https)

---

## 10. Backup & Security {#backup-security}

### Daily Backups
1. **Database Backups**
   - Automatic daily backups via Supabase
   - Keep last 30 days of backups
   - Test restore process monthly

2. **Image Backups**
   - Store product images in cloud storage
   - Keep local copies as backup
   - Organize by date and category

### Security Best Practices

1. **Password Security**
   - Use strong passwords (12+ characters)
   - Change passwords every 90 days
   - Don't share login credentials
   - Use different passwords for each service

2. **Admin Access**
   - Limit admin users
   - Review access quarterly
   - Remove inactive users
   - Log all admin activities

3. **Customer Data**
   - Never share customer information
   - Follow privacy policy strictly
   - Secure all printed orders
   - Use encrypted connections only

4. **Regular Updates**
   - Keep software updated
   - Apply security patches promptly
   - Review security logs weekly

### Emergency Procedures
If you suspect a security breach:
1. Change all passwords immediately
2. Contact your developer
3. Review recent orders for fraud
4. Notify affected customers if needed

---

## 11. Support Contact {#support-contact}

### Primary Support
**Developer/Technical Support**
- Name: [Developer Name]
- Email: [Developer Email]
- Phone: [Developer Phone]
- Hours: Monday-Friday, 9 AM - 5 PM

### Emergency Support
For urgent issues outside business hours:
- Emergency Email: [Emergency Email]
- Emergency Phone: [Emergency Phone]

### Hosting Support
**Supabase Support**
- Dashboard: https://app.supabase.com
- Documentation: https://supabase.com/docs

**Web Hosting Support**
- Provider: [Your hosting provider]
- Support URL: [Support website]
- Account #: [Your account number]

### Common Support Requests
Before contacting support, please:
1. Note the exact error message
2. Take screenshots if possible
3. Note what you were doing when issue occurred
4. Check this troubleshooting guide first

### Response Times
- Critical issues: Within 2 hours
- Normal issues: Within 24 hours
- Feature requests: Within 48 hours

---

## Quick Reference Card

### Most Used URLs
- Store: `https://your-domain.com`
- Admin: `https://your-domain.com/admin`
- Orders: `https://your-domain.com/admin/orders`
- Products: `https://your-domain.com/admin/products`

### Keyboard Shortcuts (Admin Panel)
- `Ctrl/Cmd + S`: Save changes
- `Ctrl/Cmd + F`: Search
- `Esc`: Close popups

### Order Status Codes
- **NEW**: Just received
- **PROCESSING**: Preparing to ship
- **SHIPPED**: On the way
- **DELIVERED**: Completed
- **CANCELLED**: Order cancelled
- **REFUNDED**: Money returned

---

## Final Notes

Remember, your Perfume Oasis platform is designed to grow with your business. Don't hesitate to reach out for support or training. We're here to ensure your success!

Keep this document handy and update it as you learn new features or processes. Your feedback helps us improve the platform for everyone.

**Welcome to the Perfume Oasis family!** 🌸

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Next Review: [30 days from now]*