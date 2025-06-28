// components/ui/PromoBanner.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  type: 'luxury' | 'collection' | 'homepage' | 'promo' | 'dark';
  title: string;
  subtitle?: string;
  cta?: string;
  href?: string;
  height?: 'small' | 'medium' | 'large';
}

const bannerMap = {
  luxury: 'PO-horizontal-banner-luxury-gradient.jpg',
  collection: 'PO-horizontal-banner-collection.jpg',
  homepage: 'PO-horizontal-banner-homepage-palm.jpg',
  promo: 'PO-horizontal-banner-promo-emerald.jpg',
  dark: 'PO-horizontal-banner-dark-green.jpg'
};

const heightMap = {
  small: 'h-[250px]',
  medium: 'h-[400px]',
  large: 'h-[500px]'
};

export function PromoBanner({ 
  type, 
  title, 
  subtitle, 
  cta = 'Shop Now', 
  href = '/shop',
  height = 'medium' 
}: PromoBannerProps) {
  return (
    <div className={`relative ${heightMap[height]} rounded-xl overflow-hidden my-8 group`}>
      <Image 
        src={`/images/banners/${bannerMap[type]}`}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-emerald-900/30" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90">{subtitle}</p>
          )}
          <Link href={href}>
            <Button 
              size="lg"
              className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-semibold group"
            >
              {cta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
