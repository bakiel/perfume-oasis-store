"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number
    main_image_url?: string
    brand?: { name: string }
    category?: { name: string }
    concentration?: string
    sizes_available?: string[]
    stock_quantity: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (product.stock_quantity === 0) {
      toast.error('Product is out of stock')
      return
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image_url || '',
      quantity: 1
    })
    
    toast.success('Added to cart')
  }
  
  const discountPercentage = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.main_image_url ? (
            <Image
              src={product.main_image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}
          
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              -{discountPercentage}%
            </div>
          )}
          
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              toast.success('Added to wishlist')
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.brand?.name}</p>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {product.concentration} • {product.sizes_available?.[0]}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-emerald-palm">
                  {formatCurrency(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.compare_at_price)}
                  </span>
                )}
              </div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}