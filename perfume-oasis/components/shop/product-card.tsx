"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/hooks/use-cart"
import toast from "react-hot-toast"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug?: string
    brand: string
    price: number
    originalPrice?: number
    image: string
    size: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: product.size,
    })
    
    toast.success(`${product.name} added to cart`)
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/products/${product.slug || product.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {discount}% OFF
            </div>
          )}
          <button 
            className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toast.success("Added to wishlist")
            }}
          >
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
        
        <div className="p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.brand}
          </p>
          <h3 className="font-medium text-sm mt-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{product.size}</p>
          
          <div className="flex items-center justify-between mt-3">
            <div>
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg text-red-600">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </p>
                </div>
              ) : (
                <p className="font-bold text-lg text-emerald-palm">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}