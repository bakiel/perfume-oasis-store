#!/bin/bash

# Read environment variables from .env.local and add them to Vercel
cd perfume-oasis

echo "Setting up Vercel environment variables..."

# Add each environment variable
vercel env add NEXT_PUBLIC_SUPABASE_URL production < <(echo "https://cjmyhlkmszdolfhybcie.supabase.co")
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODY0NDEsImV4cCI6MjA2NjM2MjQ0MX0.W70Hcd-oXuPJzL5jTq_Qqn0HK-KkzgOJhdGbAo9Q7fI")
vercel env add SUPABASE_SERVICE_ROLE_KEY production < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbXlobGttc3pkb2xmaHliY2llIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc4NjQ0MSwiZXhwIjoyMDY2MzYyNDQxfQ.ciogTVO1-pzJLaPpZlxvLmrzQpXecPgExoG2qeX4pGk")
vercel env add OPENROUTER_API_KEY production < <(echo "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")
vercel env add NEXT_PUBLIC_SITE_NAME production < <(echo "Perfume Oasis")
vercel env add NEXT_PUBLIC_SITE_DESCRIPTION production < <(echo "Refresh your senses")
vercel env add NEXT_PUBLIC_SITE_URL production < <(echo "https://perfumeoasis.co.za")
vercel env add FROM_EMAIL production < <(echo "orders@perfumeoasis.co.za")
vercel env add REPLY_TO_EMAIL production < <(echo "support@perfumeoasis.co.za")

echo "Environment variables set!"