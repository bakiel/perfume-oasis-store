import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { CategoryScroll } from "@/components/shop/category-scroll"
import { PromoBanners } from "@/components/shop/promo-banners"
import { SalesPromo } from "@/components/shop/sales-promo"
import { HomepageDeals } from "@/components/shop/homepage-deals"
import { 
  Search, 
  Shield, 
  Truck, 
  BadgeDollarSign, 
  Gift 
} from "lucide-react"
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      main_image_url,
      size,
      brand:brands(name)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(4)
  
  // Fetch deal products (products with compare_at_price)
  const { data: dealProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      main_image_url,
      size,
      brand:brands(name)
    `)
    .eq('is_active', true)
    .not('compare_at_price', 'is', null)
    .order('compare_at_price', { ascending: false })
    .limit(8)

  // Fetch on-sale products
  const { data: saleProducts } = await supabase
    .from('products')
    .select('id, name, slug, price, compare_at_price, main_image_url, size, brand:brands(name)')
    .eq('is_active', true)
    .not('compare_at_price', 'is', null)
    .gt('compare_at_price', 0)
    .limit(4)
  
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header with Search */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/products" className="flex-1">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
                <Search className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Search fragrances...</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-palm/90 to-emerald-palm/70 z-10" />
        <Image
          src="/images/banners/PO-horizontal-banner-hero-emerald-gold.jpg"
          alt="Perfume Oasis"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4 text-center">
          <div className="mb-4">
            <Image
              src="/images/logos/Perfume Oasis Icon.png"
              alt="Perfume Oasis"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-display mb-3">
            Perfume Oasis
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light italic">
            Refresh your senses.
          </p>
          <Link href="/products">
            <Button size="lg" variant="gold">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Homepage Deals - Prominent Section */}
      {dealProducts && dealProducts.length > 0 && (
        <HomepageDeals 
          products={dealProducts.map((product: any) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            brand: Array.isArray(product.brand) ? product.brand[0]?.name || '' : '',
            price: product.price,
            originalPrice: product.compare_at_price,
            image: product.main_image_url,
            size: product.size,
            discount: Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
          }))}
        />
      )}

      {/* Promotional Banners */}
      <PromoBanners />

      {/* Sales Promo */}
      <SalesPromo products={saleProducts?.map(product => ({
        ...product,
        brand: Array.isArray(product.brand) ? product.brand[0] : product.brand
      })) || []} />

      {/* Categories */}
      <section className="py-6">
        <div className="px-4 mb-4">
          <h2 className="text-xl font-display text-emerald-palm">
            Shop by Category
          </h2>
        </div>
        <CategoryScroll />
      </section>

      {/* Promotional Banner */}
      <section className="px-4 py-6">
        <Link href="/products?category=luxury" className="block relative h-32 rounded-lg overflow-hidden">
          <Image
            src="/images/banners/PO-horizontal-banner-promo-emerald.jpg"
            alt="Luxury Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-palm/30 to-transparent" />
          <div className="relative z-10 h-full flex items-center px-6">
            <div>
              <h3 className="text-white font-display text-lg mb-1">Limited Edition</h3>
              <p className="text-white/90 text-sm">Discover exclusive fragrances</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Featured Products */}
      <section className="py-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display text-emerald-palm">
            Featured Fragrances
          </h2>
          <Link 
            href="/products" 
            className="text-sm text-royal-gold hover:text-royal-gold/80 transition-colors"
          >
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts && featuredProducts.length > 0 ? (
            featuredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  brand: Array.isArray(product.brand) ? product.brand[0]?.name || '' : '',
                  price: product.price,
                  originalPrice: product.compare_at_price,
                  image: product.main_image_url,
                  size: product.size,
                }}
              />
            ))
          ) : (
            // Fallback if no featured products
            [1, 2, 3, 4].map((i) => (
              <ProductCard
                key={i}
                product={{
                  id: `sample-${i}`,
                  name: "Coming Soon",
                  brand: "Perfume Oasis",
                  price: 0,
                  image: "/images/perfume-oasis-main-logo.png",
                  size: "100ml",
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 px-4 bg-white mt-8">
        <h2 className="text-xl font-display text-emerald-palm text-center mb-6">
          Why Choose Perfume Oasis
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="h-6 w-6 text-emerald-palm" />
            </div>
            <h3 className="font-medium text-sm mb-1">100% Authentic</h3>
            <p className="text-xs text-gray-600">Guaranteed genuine products</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Truck className="h-6 w-6 text-emerald-palm" />
            </div>
            <h3 className="font-medium text-sm mb-1">Fast Delivery</h3>
            <p className="text-xs text-gray-600">2-3 days nationwide</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <BadgeDollarSign className="h-6 w-6 text-emerald-palm" />
            </div>
            <h3 className="font-medium text-sm mb-1">Best Prices</h3>
            <p className="text-xs text-gray-600">Competitive pricing</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="h-6 w-6 text-emerald-palm" />
            </div>
            <h3 className="font-medium text-sm mb-1">Gift Ready</h3>
            <p className="text-xs text-gray-600">Beautiful packaging</p>
          </div>
        </div>
      </section>

      {/* Collection Banner */}
      <section className="px-4 py-8">
        <Link href="/products" className="block relative h-48 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/banners/PO-horizontal-banner-collection.jpg"
            alt="Full Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-6 text-white text-center">
            <h3 className="font-display text-2xl mb-2">Explore Our Collection</h3>
            <p className="text-sm mb-4">Premium fragrances from around the world</p>
            <Button size="sm" variant="gold">
              Shop Now
            </Button>
          </div>
        </Link>
      </section>
    </div>
  )
}