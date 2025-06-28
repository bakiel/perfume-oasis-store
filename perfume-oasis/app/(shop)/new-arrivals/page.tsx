import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/product-card'

export default async function NewArrivalsPage() {
  const supabase = await createClient()
  
  // Get products from the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      main_image_url,
      size,
      brand:brands(name)
    `)
    .eq('is_active', true)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(20)
  
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-display text-emerald-palm">New Arrivals</h1>
          <p className="text-gray-600 mt-1">Discover our latest fragrance additions</p>
        </div>
      </header>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  brand: Array.isArray(product.brand) ? product.brand[0]?.name || '' : '',
                  price: product.price,
                  image: product.main_image_url,
                  size: product.size,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}