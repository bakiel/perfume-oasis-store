import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/server'
import { CategoryCard } from "@/components/ui/CategoryCard"
import { ProductCard } from "@/components/ui/ProductCard"

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get product counts by gender
  const { data: products } = await supabase
    .from('products')
    .select('gender')
    .eq('is_active', true)
  
  const categoryCounts = {
    women: 0,
    men: 0,
    unisex: 0
  }
  
  products?.forEach(product => {
    const gender = product.gender?.toLowerCase()
    if (gender === 'women' || gender === 'female') categoryCounts.women++
    else if (gender === 'men' || gender === 'male') categoryCounts.men++
    else if (gender === 'unisex') categoryCounts.unisex++
  })
  
  // Get featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      main_image_url,
      brand:brands(name)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(4)
  
  // Get products on sale (with compare_at_price)
  const { data: saleProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      main_image_url,
      brand:brands(name)
    `)
    .eq('is_active', true)
    .not('compare_at_price', 'is', null)
    .gt('compare_at_price', 0)
    .order('created_at', { ascending: false })
    .limit(4)
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
        <Image 
          src="/images/banners/PO-horizontal-banner-hero-emerald-gold.jpg"
          alt="Perfume Oasis Luxury Collection"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-emerald-900/50 to-transparent" />
        
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
                <Link href="/brands">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                  >
                    View Brands
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-soft-sand to-transparent" />
      </section>

      {/* Special Offers Banner */}
      {saleProducts && saleProducts.length > 0 && (
        <section className="py-8 bg-gold-400/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-palm mb-2">
                Special Offers
              </h2>
              <p className="text-gray-600">Save up to 30% on selected fragrances</p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  LIMITED TIME
                </span>
              </div>
              <Link 
                href="/sale" 
                className="text-sm text-emerald-palm hover:text-emerald-palm/80 font-medium"
              >
                View all specials →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {saleProducts.map((product: any) => {
                const discount = product.compare_at_price 
                  ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
                  : 0
                
                return (
                  <div key={product.id} className="relative">
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        -{discount}%
                      </span>
                    )}
                    <ProductCard 
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      originalPrice={product.compare_at_price}
                      image={product.main_image_url || '/images/products/product-placeholder-1.jpg'}
                      brand={Array.isArray(product.brand) 
                        ? product.brand[0]?.name || 'Unknown Brand'
                        : product.brand?.name || 'Unknown Brand'
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-palm mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard 
              name="Women's Fragrances" 
              count={categoryCounts.women} 
              image="/images/category-defining visuals/cat_women_floral_bottle.jpg"
              href="/products?gender=women"
            />
            <CategoryCard 
              name="Men's Fragrances" 
              count={categoryCounts.men} 
              image="/images/category-defining visuals/cat_men_atomiser_bottle.jpg"
              href="/products?gender=men"
            />
            <CategoryCard 
              name="Unisex Collection" 
              count={categoryCounts.unisex} 
              image="/images/category-defining visuals/cat_unisex_duo_bottles.jpg"
              href="/products?gender=unisex"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-soft-sand">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-palm mb-12">
              Featured Fragrances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  image={product.main_image_url || '/images/products/product-placeholder-1.jpg'}
                  brand={Array.isArray(product.brand) 
                    ? product.brand[0]?.name || 'Unknown Brand'
                    : product.brand?.name || 'Unknown Brand'
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-emerald-palm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience Luxury Fragrances
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our curated collection of authentic perfumes from the world's most prestigious brands
          </p>
          <Link href="/products">
            <Button 
              size="lg" 
              className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-semibold"
            >
              View Full Collection
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}