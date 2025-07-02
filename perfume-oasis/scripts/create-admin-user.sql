-- Create Initial Admin User
-- Run this after running admin-system-schema.sql

-- First, create the admin user in Supabase Auth
-- You'll need to run this through Supabase Dashboard SQL Editor or use the Supabase CLI

-- Note: Replace the user ID below with the actual ID after creating the user
-- To create the user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" 
-- 3. Email: admin@perfumeoasis.co.za
-- 4. Password: TempAdmin2024!
-- 5. Copy the user ID and replace below

-- After creating the user in Auth, run this to set them as admin:
/*
UPDATE profiles 
SET 
    role = 'admin',
    full_name = 'Admin User',
    updated_at = TIMEZONE('utc', NOW())
WHERE id = 'REPLACE_WITH_USER_ID';

-- Also insert into user_roles for future permission expansion
INSERT INTO user_roles (user_id, role, permissions) 
VALUES (
    'REPLACE_WITH_USER_ID',
    'admin',
    '{
        "products": ["create", "read", "update", "delete"],
        "orders": ["create", "read", "update", "delete"],
        "customers": ["read", "update"],
        "settings": ["read", "update"],
        "reports": ["read"]
    }'::jsonb
);
*/

-- Alternative: Create admin user programmatically
-- This function can be called from your application to create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    email TEXT,
    password TEXT,
    full_name TEXT DEFAULT 'Admin User'
)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Note: This requires the Supabase service role key to create users
    -- In production, you'd typically create the user through the Supabase Dashboard
    
    -- For now, return instructions
    RETURN 'Please create the admin user through Supabase Dashboard:
    1. Go to Authentication > Users
    2. Click "Add user"
    3. Email: ' || email || '
    4. Password: ' || password || '
    5. After creation, run: UPDATE profiles SET role = ''admin'' WHERE id = ''[USER_ID]''';
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT create_admin_user('admin@perfumeoasis.co.za', 'TempAdmin2024!');

-- Create a helper function to promote a user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Get user ID from auth.users
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Update profile role
    UPDATE profiles 
    SET role = 'admin', updated_at = TIMEZONE('utc', NOW())
    WHERE id = user_id;
    
    -- Insert/update user_roles
    INSERT INTO user_roles (user_id, role, permissions)
    VALUES (
        user_id,
        'admin',
        '{
            "products": ["create", "read", "update", "delete"],
            "orders": ["create", "read", "update", "delete"],
            "customers": ["read", "update"],
            "settings": ["read", "update"],
            "reports": ["read"]
        }'::jsonb
    )
    ON CONFLICT (user_id, role) 
    DO UPDATE SET permissions = EXCLUDED.permissions;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage after creating user in Supabase Dashboard:
-- SELECT promote_to_admin('admin@perfumeoasis.co.za');