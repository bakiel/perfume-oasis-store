
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ProductCard } from './product-card';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number;
  main_image_url: string;
  size: string;
  brand: { name: string };
}

interface SalesPromoProps {
  products: Product[];
}

export function SalesPromo({ products }: SalesPromoProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-6">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display text-emerald-palm">On Sale Now</h2>
          <Link href="/sale">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                brand: product.brand.name,
                price: product.price,
                originalPrice: product.compare_at_price,
                image: product.main_image_url,
                size: product.size,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

