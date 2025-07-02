-- Update orders table to allow guest checkout
-- This script modifies the user_id column to allow NULL values

-- First, drop the existing foreign key constraint
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Modify the user_id column to allow NULL
ALTER TABLE public.orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Re-add the foreign key constraint but allow NULL
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;

-- Update RLS policies to handle guest orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Create new policy that allows users to view their own orders or guest orders by order number
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    (user_id IS NULL AND auth.jwt() IS NOT NULL) -- Allow viewing guest orders if authenticated
  );

-- Add a policy for anonymous users to create orders (guest checkout)
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Update order_items policy to handle guest orders
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

-- Update invoices policy to handle guest orders
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;

CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = invoices.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

-- Output result
SELECT 'Database updated to allow guest checkout' as result;
