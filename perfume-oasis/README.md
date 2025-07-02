# Perfume Oasis - Mobile-First E-commerce Platform 🌸

A premium perfume e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Designed with a mobile-first approach for the South African market.

## 🚀 Features

### Customer Features
- **Mobile-First Design**: Optimized for mobile devices with bottom navigation
- **Product Catalog**: Browse perfumes with search, filters, and categories
- **Shopping Cart**: Persistent cart with quantity management
- **Secure Checkout**: Multi-step checkout process with validation
- **Invoice System**: Professional PDF invoices with South African formatting
- **User Accounts**: Sign up, login, and order history
- **Email Notifications**: Order confirmations with attached invoices

### Admin Features
- **Dashboard**: View sales metrics and recent orders
- **Order Management**: Track and manage customer orders
- **Product Management**: Add, edit, and manage products
- **Payment Tracking**: Monitor payment status

### Technical Features
- **PWA Ready**: Progressive Web App configuration
- **SEO Optimized**: Meta tags and structured data
- **Performance**: Image optimization and code splitting
- **Type Safety**: Full TypeScript implementation
- **Database**: Supabase PostgreSQL with Row Level Security

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Generation**: React PDF
- **Email**: Resend API
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI, Headless UI

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Resend account (for emails, optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd perfume-oasis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your values:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Email (optional)
   RESEND_API_KEY=your-resend-api-key
   FROM_EMAIL=orders@yourdomain.com
   REPLY_TO_EMAIL=support@yourdomain.com

   # Site
   NEXT_PUBLIC_SITE_NAME=Perfume Oasis
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Set up the database**
   
   Go to your Supabase project SQL editor and run the schema from:
   ```
   scripts/database-schema.sql
   ```

5. **Import sample products (optional)**
   ```bash
   npm run import-sample
   ```

## 🚀 Running the Application

### Development
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 📱 Testing Mobile View

1. Open Chrome DevTools (F12)
2. Click the device toggle toolbar (Ctrl+Shift+M)
3. Select a mobile device or responsive view
4. Test touch gestures and mobile navigation

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output will be in `.next` folder

3. Deploy to your preferred hosting service

## 📁 Project Structure

```
perfume-oasis/
├── app/                    # Next.js 14 app directory
│   ├── (shop)/            # Shop pages (products, cart, checkout)
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── shop/             # Shop-specific components
│   └── admin/            # Admin components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   ├── pdf/              # PDF generation
│   └── email/            # Email templates
├── hooks/                 # Custom React hooks
├── public/               # Static assets
└── scripts/              # Database and import scripts
```

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Service role key only used server-side
- Secure authentication flow
- Input validation and sanitization
- CSRF protection

## 🎨 Customization

### Brand Colors
Edit `tailwind.config.ts` to change brand colors:
```js
colors: {
  'emerald-palm': '#0E5C4A',
  'royal-gold': '#C8A95B',
  'soft-sand': '#F6F3EF',
  'deep-charcoal': '#2C2C2C',
}
```

### Typography
Update font imports in `app/layout.tsx`

### Email Templates
Modify templates in `lib/email/`

### Invoice Design
Customize `lib/pdf/invoice-template.tsx`

## 📧 Email Configuration

If you don't have a Resend API key:
1. The app will still work without sending emails
2. Orders will be created successfully
3. Invoice details will be logged to console

To enable emails:
1. Sign up at [Resend](https://resend.com)
2. Add your API key to `.env.local`
3. Configure your domain in Resend dashboard

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication required" error at checkout**
   - Users must be logged in to complete purchases
   - Ensure auth is properly configured

2. **PDF generation fails**
   - Check console for errors
   - Fallback text invoice will be generated

3. **Database connection issues**
   - Verify Supabase credentials
   - Check if tables are created
   - Ensure RLS policies are applied

### Debug Mode

Check browser console for detailed error messages. The app logs helpful debugging information during development.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💝 Acknowledgments

- Built with love for the South African perfume market
- Inspired by modern mobile shopping experiences
- Thanks to all open-source contributors

## 📞 Support

For support, email support@perfumeoasis.co.za or open an issue in the repository.

---

**Made with 💚 by Perfume Oasis - Refresh Your Senses**
