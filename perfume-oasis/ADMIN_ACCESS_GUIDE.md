# Perfume Oasis Admin Access Setup

## Admin Login Credentials

- **Email:** admin@perfumeoasis.co.za
- **Password:** PerfumeOasis2025!

## Admin Access Points

### 1. Direct Login Page
- URL: `/login`
- Features:
  - Standard email/password login
  - Quick admin login button (shield icon) for development
  - Automatically redirects admins to `/admin` dashboard

### 2. Header Navigation
- Admin shield icon appears in header when logged in as admin
- Located next to the user account icon
- Gold-colored shield icon for visibility

### 3. Footer Link
- "Admin" link appears in footer for admin users
- Only visible when logged in with admin privileges

### 4. Hidden Admin Access
- On the home page, click the invisible area in bottom-left corner 3 times
- Reveals "Admin Access" button that links to login page

## Admin Dashboard Features

The admin dashboard is located at `/admin` and includes:

- **Dashboard Overview** - Main metrics and stats
- **Products Management** - Add/edit/delete products
- **Orders Management** - View and process orders
- **Customers** - Customer management
- **Inventory** - Stock management
- **Categories** - Category management
- **Brands** - Brand management
- **Promotions** - Discount and promotion management
- **Reports** - Sales and analytics reports
- **Settings** - System configuration

## Security Features

1. **Authentication Check**
   - Uses Supabase Auth for secure authentication
   - Admin status verified by email and user metadata

2. **Protected Routes**
   - Admin routes are protected by authentication
   - Non-admin users cannot access admin areas

3. **Session Management**
   - Secure session handling via Supabase
   - Automatic logout on session expiry

## Quick Access for Development

The login page includes a small shield icon button that auto-fills admin credentials for quick development access.

## Database Setup

Admin user is created in:
- `auth.users` table (Supabase Auth)
- `public.profiles` table (User profile data)

Admin identification is based on:
1. Email matching `admin@perfumeoasis.co.za`
2. User metadata `is_admin: true`
3. User metadata `role: 'admin'`
