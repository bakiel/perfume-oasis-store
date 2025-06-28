import { PromoBanners } from "@/components/shop/promo-banners"
import { ProductCard } from "@/components/shop/product-card"

export default function TestPromoPage() {
  // Sample products with promotions
  const sampleProducts = [
    {
      id: '1',
      name: 'Lattafa Yara',
      slug: 'lattafa-yara',
      brand: 'Lattafa',
      price: 240,
      originalPrice: 300,
      image: 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816481751-lattafa-yara-parfum-50ml-unisex.jpg',
      size: '50ml'
    },
    {
      id: '2',
      name: 'Barakkat Rouge 540',
      slug: 'barakkat-rouge-540',
      brand: 'Barakkat',
      price: 680,
      originalPrice: 850,
      image: 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816478688-barakkat-rouge-540-extrait-de-parfum-100ml-unisex.jpg',
      size: '100ml'
    },
    {
      id: '3',
      name: 'Lacoste Her Confession',
      slug: 'lacoste-her-confession',
      brand: 'Lacoste',
      price: 400,
      originalPrice: 560,
      image: 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816509854-lacoste-her-confession-parfum-30ml-women.jpg',
      size: '30ml'
    },
    {
      id: '4',
      name: 'Dolce & Gabbana Dolores',
      slug: 'dolce-gabbana-dolores',
      brand: 'Dolce & Gabbana',
      price: 1200,
      originalPrice: 1680,
      image: 'https://cjmyhlkmszdolfhybcie.supabase.co/storage/v1/object/public/product-images/products/1750816507799-dolce---gabbana-dolores-pour-femme-parfum-100ml-women.jpg',
      size: '100ml'
    }
  ]

  return (
    <div className="min-h-screen bg-soft-sand">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-display text-emerald-palm mb-6">
          Test Promotional Banners
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-display text-emerald-palm mb-4">
            Promotional Banners Component:
          </h2>
          <PromoBanners />
        </div>
        
        <div>
          <h2 className="text-xl font-display text-emerald-palm mb-4">
            Products with Promotions:
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {sampleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}