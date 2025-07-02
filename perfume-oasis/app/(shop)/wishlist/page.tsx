'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/use-cart'
import { toast } from 'react-hot-toast'

interface WishlistItem {
  id: string
  name: string
  brand: string
  price: number
  image_url: string
  size: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem('wishlist')
        if (saved) {
          setWishlistItems(JSON.parse(saved))
        }
      } catch (error) {
        console.error('Error loading wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()

    // Listen for wishlist changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wishlist') {
        loadWishlist()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistItems.filter(item => item.id !== productId)
    setWishlistItems(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    
    // Dispatch custom event for wishlist icon update
    window.dispatchEvent(new CustomEvent('wishlistChange'))
    toast.success('Removed from wishlist')
  }

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image_url,
      brand: item.brand,
      size: item.size
    })
    toast.success('Added to cart')
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem('wishlist')
    window.dispatchEvent(new CustomEvent('wishlistChange'))
    toast.success('Wishlist cleared')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save your favorite fragrances here for easy access later.
            </p>
            <Link href="/products">
              <Button>
                Browse Fragrances
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Wishlist ({wishlistItems.length} items)
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              <Link href={`/products/${item.id}`} className="block">
                <div className="aspect-square relative bg-gray-50">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {item.brand}
                </p>
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{item.size}</p>
                <p className="text-lg font-semibold text-emerald-600 mb-4">
                  R {item.price.toFixed(2)}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(item)}
                    size="sm"
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => removeFromWishlist(item.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}