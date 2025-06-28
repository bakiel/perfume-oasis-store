import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/product-card'
import { Badge } from '@/components/ui/badge'
import { Timer, Zap, TrendingDown } from 'lucide-react'

export default async function SalePage() {
  const supabase = await createClient()
  
  // Get products on sale (with compare_at_price)
  const { data: products } = await supabase
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
    .order('created_at', { ascending: false })
  
  // Calculate biggest discount
  const biggestDiscount = products?.reduce((max, product) => {
    if (product.compare_at_price) {
      const discount = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      return discount > max ? discount : max
    }
    return max
  }, 0) || 0
  
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-6 w-6 animate-pulse" />
              <h1 className="text-3xl font-display">MEGA SALE</h1>
              <Timer className="h-6 w-6 animate-pulse" />
            </div>
            <p className="text-xl mb-4">Save Up to {biggestDiscount}% OFF</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Limited Time Only</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                <span>Lowest Prices of the Season</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sale Benefits */}
      <div className="bg-red-50 py-4 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="text-red-700">
              <p className="font-bold">FREE SHIPPING</p>
              <p className="text-xs">Orders R1,000+</p>
            </div>
            <div className="text-red-700">
              <p className="font-bold">EXTRA 10% OFF</p>
              <p className="text-xs">Code: SAVE10</p>
            </div>
            <div className="text-red-700">
              <p className="font-bold">BUY 2 GET 15%</p>
              <p className="text-xs">Auto-applied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display text-emerald-palm">
            {products?.length || 0} Items on Sale
          </h2>
          <div className="text-sm text-gray-600">
            Hurry! Sale ends soon
          </div>
        </div>
        
        {products && products.length > 0 ? (
          <>
            {/* Featured Sale Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {products.slice(0, 2).map((product) => {
                const discount = product.compare_at_price ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) : 0
                return (
                  <div key={product.id} className="relative bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      <Badge variant="destructive" className="text-lg px-3 py-1">
                        {discount}% OFF
                      </Badge>
                      <Badge className="bg-amber-500 text-white">
                        BEST DEAL
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="relative h-48">
                        <img
                          src={product.main_image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <p className="text-sm text-gray-500 mb-1">{Array.isArray(product.brand) ? product.brand[0]?.name : ''}</p>
                        <h3 className="font-display text-lg text-emerald-palm mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{product.size}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-red-600">R{product.price}</span>
                          <span className="text-lg text-gray-400 line-through">R{product.compare_at_price}</span>
                        </div>
                        <p className="text-sm text-green-600 mt-2">You save R{(product.compare_at_price || 0) - product.price}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Regular Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(2).map((product: any) => (
                <div key={product.id} className="relative">
                  {product.compare_at_price && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="destructive">
                        {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                      </Badge>
                    </div>
                  )}
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      brand: Array.isArray(product.brand) ? product.brand[0]?.name || '' : '',
                      price: product.price,
                      originalPrice: product.compare_at_price || undefined,
                      image: product.main_image_url,
                      size: product.size,
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No items on sale at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}