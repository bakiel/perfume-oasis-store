import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { BottomNav } from "@/components/mobile/bottom-nav";
import { MobileStoryAd } from "@/components/shop/mobile-story-ad";

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
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/perfume-oasis-icon-favicon.png',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Perfume Oasis - Luxury Fragrances",
    description: "Refresh your senses with authentic luxury fragrances",
    url: "https://perfumeoasis.co.za",
    siteName: "Perfume Oasis",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/images/social/perfume-oasis-whatsapp-share.jpg",
        width: 1024,
        height: 1024,
        alt: "Perfume Oasis - Luxury Fragrances",
      },
      {
        url: "/images/social/perfume-oasis-bottle-share.jpg",
        width: 1200,
        height: 1200,
        alt: "Perfume Oasis - Luxury Fragrances",
      },
      {
        url: "/images/banners/PO-horizontal-banner-hero-emerald-gold.jpg",
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
    images: ["/images/social/perfume-oasis-bottle-share.jpg"],
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
        <link rel="apple-touch-icon" href="/images/logos/Perfume Oasis Icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-sand-50">
        <StoreHeader />
        <main className="flex-1">
          {children}
        </main>
        <StoreFooter />
        <div className="h-20 lg:hidden" /> {/* Spacer for bottom nav on mobile only */}
        <BottomNav />
        <MobileStoryAd />
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