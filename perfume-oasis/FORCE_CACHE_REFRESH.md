# Force Supabase Cache Refresh

The checkout is working now (without idempotency checks temporarily).

To properly fix this and re-enable idempotency checks:

## Option 1: Wait for Auto-Refresh
Supabase typically refreshes its schema cache within 60 seconds to 5 minutes. 

## Option 2: Manual Refresh (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **Settings** > **API**
3. Look for "Reload Schema" or "Refresh Schema Cache" button
4. Click it and wait 30 seconds

## Option 3: Force Refresh via API
1. Go to SQL Editor in Supabase
2. Run: `NOTIFY pgrst, 'reload schema'`

## Option 4: Restart Supabase Services
1. Go to **Settings** > **Infrastructure**
2. Restart the database or API service

## After Cache Refresh
Once the cache is refreshed, uncomment the idempotency code in `/app/api/checkout/route.ts`:
- Line 87: Uncomment `idempotency_key: idempotencyKey,`
- Lines 62-77: Uncomment the duplicate order check

## Current Status
✅ Database has idempotency_key column
✅ Checkout works (without duplicate prevention)
⏳ Waiting for cache refresh to enable full functionality

The checkout and invoice generation are working now!