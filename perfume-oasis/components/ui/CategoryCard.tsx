// components/ui/CategoryCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  count: number;
  image: string;
  href: string;
}

export function CategoryCard({ name, count, image, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-lg aspect-square">
        {/* Square design overlay for branding */}
        <div className="absolute top-4 right-4 w-16 h-16 z-10 opacity-20 group-hover:opacity-30 transition-opacity">
          <Image 
            src="/images/square-designs/logos/PO-square-logo-main.jpg"
            alt="Perfume Oasis"
            fill
            className="object-cover rounded"
          />
        </div>
        
        {/* Main category image */}
        <div className="relative h-full">
          <Image 
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/50 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            <div className="flex items-center justify-between">
              <p className="text-gold-400">{count} Products</p>
              <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center group-hover:bg-gold-400/30 transition-colors">
                <ArrowRight className="w-5 h-5 text-gold-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
