#!/bin/bash

# Component Generation Script with South African English

echo "🎨 Generating mobile-first components with SA English..."

PROJECT_DIR="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis"
cd ${PROJECT_DIR}

# Create Tailwind config with custom colours
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colours
        'emerald-palm': '#0E5C4A',
        'royal-gold': '#C8A95B',
        'soft-sand': '#F6F3EF',
        'deep-charcoal': '#2C2C2C',
        
        // UI colours
        'pearl': '#FAF9F7',
        'champagne': '#F5E6D3',
        'bronze': '#B8956A',
        'forest': '#0A4236',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'accent': ['Italiana', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
EOF

# Create global styles with mobile-first approach
cat > app/globals.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&family=Italiana&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --safe-area-inset-top: env(safe-area-inset-top);
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-soft-sand text-deep-charcoal;
    font-family: 'Inter', sans-serif;
    overscroll-behavior-y: none;
    padding-top: var(--safe-area-inset-top);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-soft-sand;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-emerald-palm/30 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-emerald-palm/50;
  }
}

@layer components {
  /* Mobile-first utilities */
  .safe-top {
    padding-top: var(--safe-area-inset-top);
  }

  .safe-bottom {
    padding-bottom: var(--safe-area-inset-bottom);
  }

  .tap-target {
    @apply min-h-[44px] min-w-[44px] flex items-center justify-center;
  }

  /* Typography */
  .heading-display {
    @apply font-display font-bold text-emerald-palm;
  }

  .text-accent {
    @apply font-accent text-royal-gold;
  }

  /* Animations */
  .shimmer {
    @apply relative overflow-hidden;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(200, 169, 91, 0.1) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }

  /* Glass effect */
  .glass {
    @apply backdrop-blur-md bg-white/70 border border-white/20;
  }

  /* Product card hover */
  .product-hover {
    @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }
}

@layer utilities {
  /* Hide scrollbar but keep functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
EOF

# Create PWA manifest
cat > public/manifest.json << 'EOF'
{
  "name": "Perfume Oasis - Luxury Fragrances",
  "short_name": "Perfume Oasis",
  "description": "Refresh your senses with luxury fragrances",
  "theme_color": "#0E5C4A",
  "background_color": "#F6F3EF",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "categories": ["shopping", "lifestyle"],
  "lang": "en-ZA",
  "dir": "ltr",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# Create next.config.js with PWA support
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cjmyhlkmszdolfhybcie.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Optimisations for mobile
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
EOF

# Create layout.tsx with mobile-first design
cat > app/layout.tsx << 'EOF'
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Perfume Oasis - Luxury Fragrances | South Africa",
  description: "Refresh your senses with authentic luxury fragrances. Shop premium perfumes from top international brands with fast delivery across South Africa.",
  keywords: "perfume, fragrance, luxury perfume, South Africa, cologne, eau de parfum, perfume shop",
  authors: [{ name: "Perfume Oasis" }],
  creator: "Perfume Oasis",
  publisher: "Perfume Oasis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://perfumeoasis.co.za"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Perfume Oasis - Luxury Fragrances",
    description: "Refresh your senses with authentic luxury fragrances",
    url: "https://perfumeoasis.co.za",
    siteName: "Perfume Oasis",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/images/perfume-oasis-main-logo.png",
        width: 1200,
        height: 630,
        alt: "Perfume Oasis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfume Oasis - Luxury Fragrances",
    description: "Refresh your senses with authentic luxury fragrances",
    images: ["/images/perfume-oasis-main-logo.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/perfume-oasis-icon-favicon.png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0E5C4A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Perfume Oasis" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0E5C4A",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#C8A95B",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
EOF

echo "✅ Core files created successfully!"
echo "📱 Mobile-first setup complete with SA English spelling"
echo "🎨 Custom colour scheme applied"
echo "⚡ PWA configuration ready"