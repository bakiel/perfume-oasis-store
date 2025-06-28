// components/ui/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
}

export function ProductCard({ id, name, brand, price, originalPrice, image, slug }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <div className="group">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square rounded-lg overflow-hidden bg-white mb-4">
          <Image 
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-[#C8A95B] text-[#0E5C4A] px-2 py-1 rounded text-xs font-semibold">
            NEW
          </div>
        </div>
      </Link>
      <div className="space-y-2">
        <p className="text-sm text-[#C8A95B] font-medium">{brand}</p>
        <h3 className="font-semibold text-[#2C2C2C]">{name}</h3>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-[#0E5C4A]">R {price.toFixed(2)}</p>
          {originalPrice && originalPrice > price && (
            <p className="text-sm text-gray-500 line-through">R {originalPrice.toFixed(2)}</p>
          )}
        </div>
        <Button 
          className="w-full bg-[#0E5C4A] hover:bg-[#0A4A3B] text-white flex items-center justify-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            addItem({
              id,
              name,
              brand,
              price,
              image,
              size: '100ml' // Default size, can be made dynamic later
            });
            toast.success(`${name} added to cart!`);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}