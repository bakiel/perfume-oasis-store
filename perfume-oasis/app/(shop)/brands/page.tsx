import Link from "next/link"
import Image from "next/image"
import { createClient } from '@/lib/supabase/server'
import { ChevronRight } from "lucide-react"

export default async function BrandsPage() {
  const supabase = await createClient()
  
  const { data: brands } = await supabase
    .from('brands')
    .select(`
      *,
      products(count)
    `)
    .eq('is_active', true)
    .order('name')
  
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-display text-emerald-palm">Our Brands</h1>
          <p className="text-gray-600 mt-1">Explore our curated collection of luxury fragrance brands</p>
        </div>
      </header>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands?.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-display text-emerald-palm group-hover:text-emerald-palm/80 transition-colors">
                    {brand.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {brand.products?.[0]?.count || 0} products
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-palm transition-colors" />
              </div>
              
              {brand.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {brand.description}
                </p>
              )}
              
              {brand.logo_url && (
                <div className="mt-4 h-16 relative">
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    fill
                    className="object-contain object-left"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
        
        {(!brands || brands.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}