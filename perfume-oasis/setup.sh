#!/bin/bash

echo "🔧 Fixing Perfume Oasis Setup..."
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the perfume-oasis directory"
    echo "Please run this script from the project root"
    exit 1
fi

echo "📦 Installing any missing dependencies..."
npm install

echo ""
echo "🗄️ Database Setup Instructions:"
echo "--------------------------------"
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy and paste the contents of scripts/database-schema.sql"
echo "4. Run the SQL to create all tables"
echo ""

echo "📧 Email Configuration (Optional):"
echo "---------------------------------"
echo "To enable email notifications:"
echo "1. Sign up at https://resend.com"
echo "2. Get your API key"
echo "3. Add it to .env.local as RESEND_API_KEY"
echo ""
echo "Without email configuration, the app will still work"
echo "but won't send order confirmation emails."
echo ""

echo "🚀 Starting the development server..."
echo "The app will open at http://localhost:3000"
echo ""

# Kill any existing process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start the dev server
npm run dev
