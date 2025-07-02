# Database Setup Guide for Perfume Oasis

## Quick Setup (5 minutes)

### Step 1: Check Current Setup
```bash
npm run check-db
```

### Step 2: Run Database Setup
1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Copy the entire contents of `/scripts/complete-database-setup.sql`
4. Paste into the SQL Editor
5. Click **Run**

### Step 3: Verify Setup
```bash
npm run check-db
```

## What Gets Set Up

### 1. **Orders Table Enhancements**
- `applied_promotions` - Stores promotion details as JSON
- `discount_amount` - Tracks total discount amount
- `promo_code` - Records the promo code used

### 2. **Promotions System**
- Complete promotions table with all fields
- Sample promotions (WELCOME10, FREESHIP, SUMMER100)
- Increment usage function
- RLS policies for security

### 3. **Email Tracking**
- `email_logs` table for tracking sent emails
- Integration with SendGrid

### 4. **Admin System**
- Role-based access (admin, staff, customer)
- Settings table for store configuration

## Environment Variables Required

### Supabase (Required)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### SendGrid (For Email)
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=orders@perfumeoasis.co.za
SENDGRID_FROM_NAME=Perfume Oasis
```

## Testing Checkout

### 1. Without Promotions
- Add items to cart
- Proceed to checkout
- Complete order

### 2. With Promotions
- **WELCOME10** - 10% off entire order
- **FREESHIP** - Free shipping
- **SUMMER100** - R100 off (min R500 order)

## Troubleshooting

### "Column not found" errors
1. Run the complete setup script again
2. Clear Supabase cache: `NOTIFY pgrst, 'reload schema'`

### Email not sending
1. Check SendGrid environment variables
2. Verify SendGrid domain authentication
3. Check email logs in Supabase

### Promotion not applying
1. Check promotion is active in admin panel
2. Verify minimum purchase requirements
3. Check promotion date validity

## Manual Database Checks

### Check Orders Columns
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('applied_promotions', 'discount_amount', 'promo_code');
```

### Check Promotions
```sql
SELECT * FROM promotions WHERE is_active = true;
```

### Check Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'increment_promotion_usage';
```

## Next Steps

1. **Configure SendGrid**
   - Set up domain authentication
   - Verify sender email

2. **Create Admin User**
   - Register a new account
   - Update role to 'admin' in Supabase

3. **Test Everything**
   - Place test orders
   - Check email delivery
   - Verify promotions work

## Need Help?

- Check `/CHECKOUT_ERROR_FIX.md` for specific checkout issues
- Review `/scripts/complete-database-setup.sql` for all SQL
- Run `npm run check-db` to diagnose issues