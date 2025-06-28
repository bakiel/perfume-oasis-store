import { ProductCard } from './product-card'
import { Pagination } from '@/components/ui/pagination'

interface ProductsGridProps {
  products: any[]
  totalCount: number
  currentPage: number
  perPage: number
}

export function ProductsGrid({ 
  products, 
  totalCount, 
  currentPage, 
  perPage 
}: ProductsGridProps) {
  const totalPages = Math.ceil(totalCount / perPage)
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found matching your criteria.</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/products"
        />
      )}
    </div>
  )
}