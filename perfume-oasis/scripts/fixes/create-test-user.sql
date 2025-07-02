-- Create a test user for guest checkout testing
-- This is a temporary solution for testing purposes

-- First, check if the test user already exists
DO $$
BEGIN
    -- Check if user exists in auth.users
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    ) THEN
        -- Insert test user into auth.users (Supabase managed table)
        -- Note: This is a special case for testing
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role
        ) VALUES (
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'test@perfumeoasis.co.za',
            crypt('TestPassword123!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Test User"}',
            'authenticated',
            'authenticated'
        );
    END IF;

    -- Create or update profile for test user
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        created_at,
        updated_at
    ) VALUES (
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'test@perfumeoasis.co.za',
        'Test User',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        updated_at = NOW();
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Output result
SELECT 'Test user created/updated successfully' as result;
