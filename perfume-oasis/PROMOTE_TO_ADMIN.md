# How to Make a User Admin

To access the admin dashboard at `/admin`, your user account needs to have the `admin` role in the database.

## Quick Steps:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run this SQL command** (replace email with your actual email):
   ```sql
   -- Update user role to admin
   UPDATE profiles 
   SET role = 'admin'
   WHERE email = 'admin@perfumeoasis.co.za';
   ```

   Or if the email field doesn't exist in profiles, use this to find and update by user ID:
   ```sql
   -- First, find your user ID
   SELECT id, email FROM auth.users WHERE email = 'admin@perfumeoasis.co.za';
   
   -- Then update the profile (replace 'your-user-id' with the ID from above)
   UPDATE profiles 
   SET role = 'admin'
   WHERE id = 'your-user-id';
   ```

4. **Alternative: Use the promote_to_admin function**
   ```sql
   SELECT promote_to_admin('admin@perfumeoasis.co.za');
   ```

5. **Sign out and sign back in**
   - After updating your role, sign out from the website
   - Sign back in to refresh your session
   - You should now have access to `/admin`

## Troubleshooting:

If you still can't access the admin panel:

1. **Check if the profile exists:**
   ```sql
   SELECT * FROM profiles WHERE email = 'admin@perfumeoasis.co.za';
   ```

2. **If no profile exists, create one:**
   ```sql
   -- Get the user ID first
   SELECT id FROM auth.users WHERE email = 'admin@perfumeoasis.co.za';
   
   -- Create profile with admin role (replace with actual user ID)
   INSERT INTO profiles (id, email, role, created_at, updated_at)
   VALUES ('your-user-id', 'admin@perfumeoasis.co.za', 'admin', NOW(), NOW());
   ```

3. **Verify the role was set:**
   ```sql
   SELECT id, email, role FROM profiles WHERE role = 'admin';
   ```

## Admin Access Requirements:

The admin panel checks for:
- User must be logged in
- User must have `role = 'admin'` or `role = 'staff'` in the profiles table

Once your account has the admin role, you'll be able to access:
- Dashboard: `/admin`
- Orders: `/admin/orders`
- Products: `/admin/products`
- And all other admin sections