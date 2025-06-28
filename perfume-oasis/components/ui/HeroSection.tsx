// components/ui/HeroSection.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
      {/* Background Banner */}
      <Image 
        src="/images/banners/PO-horizontal-banner-hero-emerald-gold.jpg"
        alt="Perfume Oasis Luxury Collection"
        fill
        className="object-cover"
        priority
        quality={100}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-emerald-900/50 to-transparent" />
      
      {/* Content */}
      <div className="relative container mx-auto h-full px-4">
        <div className="flex h-full items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Discover Luxury<br />
              <span className="text-gold-400">Perfumes</span> in<br />
              South Africa
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Premium fragrances from world-renowned brands, delivered to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-semibold"
                >
                  Shop Collection
                </Button>
              </Link>
              <Link href="/products">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  View Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand-50 to-transparent" />
    </section>
  );
}
