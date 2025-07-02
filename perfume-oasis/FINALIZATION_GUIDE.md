# Perfume Oasis - Final Setup Guide

## 🚨 Critical Fix for Checkout Error

The checkout error "Could not find the 'idempotency_key' column" indicates the database schema hasn't been fully updated.

### Immediate Fix Applied:
I've temporarily disabled the idempotency check in the checkout process so orders can be placed immediately.

### Permanent Fix Required:
Run this SQL script in your Supabase SQL editor:

```sql
-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON orders(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number) WHERE tracking_number IS NOT NULL;
```

### After Running the SQL:
1. Edit `/app/api/checkout/route.ts`
2. Uncomment lines 61-80 (the idempotency check)
3. Uncomment line 87 (add idempotency_key to orderData)

## 📸 Background Images Added

I've copied the forest background images to:
- `/public/images/backgrounds/hero-bg-1.jpg`
- `/public/images/backgrounds/hero-bg-2.jpg`

These can be used for:
- Hero sections
- Call-to-action sections
- Newsletter signup areas
- Special promotional banners

### Example Usage:
```tsx
<section 
  className="relative h-[400px] bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/backgrounds/hero-bg-1.jpg)' }}
>
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative z-10 container mx-auto h-full flex items-center">
    <!-- Content here -->
  </div>
</section>
```

## ✅ Order Tracking System
- Integrated with Courier Guy
- Tracking page at `/track-order`
- API endpoint ready
- Admin can add tracking numbers

## ✅ Social Media
- Only Instagram: [@perfumeoasisza](https://www.instagram.com/perfumeoasisza/)
- Facebook and Twitter removed

## 🎯 Final Checklist

1. **Database Migration** ⚠️
   - [ ] Run the SQL script above in Supabase
   - [ ] Re-enable idempotency check in checkout

2. **Email Configuration**
   - [ ] Add Resend API key to environment variables
   - [ ] Test order confirmation emails

3. **Payment Setup**
   - [ ] Ensure bank details are correct in Settings
   - [ ] Test order placement and invoice generation

4. **Go Live**
   - [ ] Add products to inventory
   - [ ] Set up promotions/specials
   - [ ] Create initial admin user
   - [ ] Test complete order flow

## 🚀 The store is ready to launch!

Once the database migration is complete, the checkout process will work perfectly with duplicate order prevention.