# Fix for Checkout Error: Missing 'applied_promotions' Column

## Quick Fix (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to the SQL Editor

2. **Run the Complete Setup Script**
   - Copy the entire contents of `/scripts/complete-database-setup.sql`
   - Paste into the SQL Editor
   - Click "Run"

3. **Verify the Fix**
   ```bash
   npm run check-db
   ```

## What This Fixes

The checkout process is failing because the `orders` table is missing these columns:
- `applied_promotions` (JSONB) - Stores promotion details
- `discount_amount` (DECIMAL) - Stores total discount
- `promo_code` (TEXT) - Stores the promo code used

## Alternative: Manual Fix

If you prefer to only add the missing columns:

```sql
-- Add promotion columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS applied_promotions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS promo_code TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code);
```

## Test the Fix

1. **Try checkout without a promo code**
   - Should work normally

2. **Try checkout with promo codes**
   - `WELCOME10` - 10% discount
   - `FREESHIP` - Free shipping
   - `SUMMER100` - R100 off (min R500 order)

## Troubleshooting

If you still get errors:

1. **Clear Supabase cache**
   - In SQL Editor, run: `NOTIFY pgrst, 'reload schema'`

2. **Check browser console**
   - Look for any other error messages

3. **Verify email configuration**
   - Ensure SendGrid environment variables are set

## Email System

The checkout process sends order confirmation emails. Ensure these environment variables are set:
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `SENDGRID_FROM_NAME`

## Need More Help?

Check the complete setup guide: `/DATABASE_SETUP_GUIDE.md`