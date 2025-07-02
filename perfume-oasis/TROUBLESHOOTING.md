# Troubleshooting Guide - Perfume Oasis

## Checkout Issues

### Problem: "Authentication required" error at checkout

**Solution:**
Users must be logged in to complete a purchase. This is by design for security and order tracking.

**Fix:**
1. Ensure users can register/login from the checkout page
2. The AuthDialog component handles this automatically
3. Check that Supabase Auth is properly configured

### Problem: PDF Invoice Generation Fails

**Possible Causes & Solutions:**

1. **Missing React PDF dependencies**
   ```bash
   npm install @react-pdf/renderer
   ```

2. **Server-side rendering issues**
   - The PDF generation happens server-side
   - Check the API logs for errors
   - Fallback text invoice will be generated if PDF fails

3. **Memory issues**
   - Large orders might cause memory issues
   - The fallback text invoice ensures orders still process

### Problem: Email not sending

**Solution:**
1. Check if RESEND_API_KEY is set in .env.local
2. If not set, emails won't send but orders will still be created
3. To enable emails:
   - Sign up at https://resend.com
   - Add API key to .env.local
   - Restart the dev server

### Problem: Database errors

**Common Issues:**

1. **"relation 'orders' does not exist"**
   - Run the database schema script in Supabase SQL editor
   - File: `scripts/database-schema.sql`

2. **"permission denied for table orders"**
   - Check Row Level Security policies
   - Ensure service role key is set correctly

3. **User ID errors**
   - Users must be authenticated to create orders
   - Check Supabase Auth configuration

## Quick Fixes

### Reset Database
```sql
-- Drop all tables (WARNING: This deletes all data!)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Then run scripts/database-schema.sql
```

### Test Checkout Without Email
Set RESEND_API_KEY to empty in .env.local:
```env
RESEND_API_KEY=
```

### Enable Debug Mode
Add to checkout API route for more logging:
```typescript
console.log('Debug:', JSON.stringify(body, null, 2))
```

### Check Server Logs
```bash
# In your terminal running npm run dev
# Look for error messages when placing an order
```

## Testing Checklist

1. **Products Page**
   - [ ] Products load correctly
   - [ ] Add to cart works
   - [ ] Cart badge updates

2. **Cart Page**
   - [ ] Items display with correct quantities
   - [ ] Update quantity works
   - [ ] Remove item works
   - [ ] Totals calculate correctly

3. **Checkout Flow**
   - [ ] Step 1: Personal details validation
   - [ ] Step 2: Address validation
   - [ ] Step 3: Review order
   - [ ] Authentication prompt appears if not logged in
   - [ ] Order creates successfully
   - [ ] Redirect to confirmation page

4. **Order Confirmation**
   - [ ] Order details display
   - [ ] Invoice information shown
   - [ ] Bank details visible

## Contact Support

If issues persist:
1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Review Supabase logs in dashboard
4. Create an issue in the repository with:
   - Error messages
   - Steps to reproduce
   - Browser and OS information
