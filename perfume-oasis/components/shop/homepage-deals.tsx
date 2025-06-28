"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Timer, Sparkles, TrendingUp, Percent } from "lucide-react"

interface DealProduct {
  id: string
  name: string
  slug: string
  brand: string
  price: number
  originalPrice: number
  image: string
  size: string
  discount: number
}

interface HomepageDealsProps {
  products: DealProduct[]
}

export function HomepageDeals({ products }: HomepageDealsProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!products || products.length === 0) return null

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-red-50 to-white">
      {/* Flash Sale Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display text-gray-900">
                ⚡ FLASH SALE
              </h2>
              <p className="text-sm text-gray-600">Limited time only!</p>
            </div>
          </div>
          <Link href="/sale">
            <Button variant="outline" size="sm" className="border-red-500 text-red-600 hover:bg-red-50">
              View All Deals
            </Button>
          </Link>
        </div>

        {/* Countdown Timer */}
        <div className="bg-black text-white rounded-lg p-4 mb-6">
          <p className="text-sm text-center mb-2 opacity-80">SALE ENDS IN</p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="bg-red-600 rounded-lg px-4 py-2 min-w-[60px]">
                <span className="text-2xl font-mono font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs mt-1 opacity-70">HOURS</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 rounded-lg px-4 py-2 min-w-[60px]">
                <span className="text-2xl font-mono font-bold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs mt-1 opacity-70">MINS</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 rounded-lg px-4 py-2 min-w-[60px]">
                <span className="text-2xl font-mono font-bold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs mt-1 opacity-70">SECS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Products Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {products.slice(0, 4).map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Discount Badge */}
              <div className="relative">
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </div>
                <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                  HOT DEAL
                </div>
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
                <h3 className="font-medium text-sm mt-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.size}</p>
                
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-sm line-through text-gray-400">
                      {formatCurrency(product.originalPrice)}
                    </p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Special Offers Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display mb-2">🎁 Bundle & Save!</h3>
            <p className="text-sm opacity-90 mb-3">Buy 2 get 15% OFF | Buy 3 get 20% OFF</p>
            <Link href="/products">
              <Button variant="white" size="sm">
                Shop Bundle Deals
              </Button>
            </Link>
          </div>
          <div className="text-right">
            <Percent className="h-16 w-16 opacity-20" />
          </div>
        </div>
      </div>

      {/* Category Deals */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/products?gender=women" className="bg-pink-100 rounded-lg p-4 text-center hover:bg-pink-200 transition-colors">
          <div className="text-2xl mb-1">👩</div>
          <p className="text-xs font-medium">Women's</p>
          <p className="text-xs text-pink-700 font-bold">Up to 30% OFF</p>
        </Link>
        <Link href="/products?gender=men" className="bg-blue-100 rounded-lg p-4 text-center hover:bg-blue-200 transition-colors">
          <div className="text-2xl mb-1">👨</div>
          <p className="text-xs font-medium">Men's</p>
          <p className="text-xs text-blue-700 font-bold">Up to 25% OFF</p>
        </Link>
        <Link href="/sale" className="bg-green-100 rounded-lg p-4 text-center hover:bg-green-200 transition-colors">
          <div className="text-2xl mb-1">🌟</div>
          <p className="text-xs font-medium">All Deals</p>
          <p className="text-xs text-green-700 font-bold">View All</p>
        </Link>
      </div>
    </section>
  )
}