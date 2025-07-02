# Admin System Setup Guide

## Quick Setup Instructions

### 1. Apply Database Schema Updates

First, run the database migration to add admin functionality:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/admin-system-schema.sql`
4. Click "Run" to execute the migration

### 2. Create Admin User Account

**Option A: Quick Setup (Recommended)**

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" → "Create new user"
3. Enter the following details:
   - Email: `admin@perfumeoasis.co.za`
   - Password: `TempAdmin2024!`
   - Click "Create user"
4. Copy the User ID from the created user
5. Go to SQL Editor and run:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = 'paste-user-id-here';
   ```

**Option B: Alternative Admin Email**

If you want to use a different email:
1. Create a user with your preferred email
2. Run this SQL command (replace with your email):
   ```sql
   SELECT promote_to_admin('your-email@example.com');
   ```

### 3. Test Admin Access

1. Go to your website
2. Log in with the admin credentials
3. Scroll to the bottom of any page
4. You should see an "Admin" link in the footer (only visible to admins)
5. Click it to access the admin dashboard

## Admin Features

### Currently Implemented:
- ✅ Role-based access control
- ✅ Admin-only dashboard access
- ✅ Audit logging for all admin actions
- ✅ Promotions/specials management system
- ✅ Store settings configuration
- ✅ Email tracking system
- ✅ Order duplicate prevention

### Product Management:
- Add/edit/delete products
- Bulk operations
- Stock management
- Featured products toggle
- Sale pricing (using compare_at_price)

### Order Management:
- View all orders
- Update order status
- Track payments
- Export order data

### Promotions (Specials):
- Create percentage or fixed amount discounts
- Set start/end dates
- Auto-apply promotions
- Display on homepage

### Settings:
- Store configuration
- Delivery fees
- Email settings
- Tax configuration

## Security Notes

1. **Change the default password immediately** after first login
2. The admin system uses row-level security (RLS) policies
3. All admin actions are logged in the audit_logs table
4. Only users with 'admin' or 'staff' role can access admin areas

## Email System

To enable email sending:
1. Sign up for a Resend account at https://resend.com
2. Get your API key
3. Add to your `.env.local`:
   ```
   RESEND_API_KEY=your-api-key-here
   ```
4. Emails will automatically start sending

## Troubleshooting

If you can't access admin:
1. Check that your user has 'admin' role in the profiles table
2. Clear your browser cache and cookies
3. Make sure you're logged in
4. Check the browser console for errors

For support, contact: info@perfumeoasis.co.za