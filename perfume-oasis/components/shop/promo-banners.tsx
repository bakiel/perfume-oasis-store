"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Timer, Percent, Sparkles, TrendingUp, Sun, Users, Zap, Gift } from "lucide-react"
import { useEffect, useState } from "react"

export function PromoBanners() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
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
          return { hours: 47, minutes: 59, seconds: 59 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-4 px-4 py-6">
      {/* Summer Collection Sale Banner */}
      <Link href="/sale" className="block relative h-44 rounded-xl overflow-hidden shadow-xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-20" />
        <div className="relative z-30 h-full flex items-center justify-between px-6">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-6 w-6 animate-pulse" />
              <h3 className="font-display text-3xl">SUMMER COLLECTION</h3>
            </div>
            <p className="text-xl font-bold mb-1">Save up to 40% OFF</p>
            <p className="text-sm opacity-90 mb-3">Exclusive deals on premium fragrances</p>
            <div className="flex gap-3 items-center">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-xs opacity-90">Sale ends in</p>
                <div className="flex gap-1 font-mono text-sm font-bold">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90 mb-1">Starting from</p>
            <p className="text-3xl font-bold mb-2">R210</p>
            <Button variant="white" size="sm" className="group-hover:scale-105 transition-transform shadow-lg">
              Shop Now
            </Button>
          </div>
        </div>
      </Link>

      {/* Special Offers Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Men's Special */}
        <Link href="/products?gender=men" className="relative h-36 rounded-lg overflow-hidden shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700 z-10" />
          <div className="absolute inset-0 bg-black/20 z-20" />
          <div className="relative z-30 h-full p-4 flex flex-col justify-between text-white">
            <div>
              <Users className="h-5 w-5 mb-1 text-blue-400" />
              <h4 className="font-display text-lg">MEN'S SPECIAL</h4>
              <p className="text-xs opacity-90 mb-1">Premium Collection</p>
              <p className="text-sm font-bold text-blue-400">25% OFF</p>
            </div>
            <span className="text-xs font-medium group-hover:underline flex items-center gap-1">
              Shop Men's <span className="text-blue-400">→</span>
            </span>
          </div>
        </Link>

        {/* Luxury Flash Sale */}
        <Link href="/brands" className="relative h-36 rounded-lg overflow-hidden shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 z-10" />
          <div className="absolute inset-0 bg-black/20 z-20" />
          <div className="relative z-30 h-full p-4 flex flex-col justify-between text-white">
            <div>
              <Zap className="h-5 w-5 mb-1 animate-pulse text-yellow-300" />
              <h4 className="font-display text-lg">LUXURY DEALS</h4>
              <p className="text-xs opacity-90 mb-1">Designer Brands</p>
              <p className="text-sm font-bold text-yellow-300">40% OFF</p>
            </div>
            <span className="text-xs font-medium group-hover:underline flex items-center gap-1">
              Shop Luxury <span className="text-yellow-300">→</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Bundle & Save Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Gift className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg text-emerald-palm mb-1">Bundle & Save Special</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-white px-2 py-1 rounded-full shadow-sm">Buy 2 Get 15% OFF</span>
                  <span className="bg-white px-2 py-1 rounded-full shadow-sm">Buy 3 Get 20% OFF</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Automatically applied at checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Shipping Banner */}
      <Link href="/shipping" className="block bg-gradient-to-r from-royal-gold to-amber-500 text-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">FREE SHIPPING</p>
              <p className="text-sm opacity-90">On all orders over R1,000</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">No code needed</p>
            <p className="text-sm font-medium">Learn more →</p>
          </div>
        </div>
      </Link>

      {/* Featured Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 px-1">Shop by Collection</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Summer Collection */}
          <Link href="/products?category=Floral" className="relative h-28 rounded-lg overflow-hidden shadow-md group">
            <Image
              src="/images/categories/Floral.jpg"
              alt="Summer Collection"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-pink-900/50 to-transparent z-10" />
            <div className="relative z-20 h-full p-3 flex flex-col justify-end text-white">
              <h4 className="font-display text-sm">Summer</h4>
              <p className="text-xs font-bold text-pink-300">30% OFF</p>
            </div>
          </Link>

          {/* Woody Collection */}
          <Link href="/products?category=Woody" className="relative h-28 rounded-lg overflow-hidden shadow-md group">
            <Image
              src="/images/categories/Woody.jpg"
              alt="Woody Collection"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-900/50 to-transparent z-10" />
            <div className="relative z-20 h-full p-3 flex flex-col justify-end text-white">
              <h4 className="font-display text-sm">Woody</h4>
              <p className="text-xs font-bold text-amber-300">25% OFF</p>
            </div>
          </Link>

          {/* Oriental Collection */}
          <Link href="/products?category=Oriental" className="relative h-28 rounded-lg overflow-hidden shadow-md group">
            <Image
              src="/images/categories/Oriental.jpg"
              alt="Oriental Collection"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent z-10" />
            <div className="relative z-20 h-full p-3 flex flex-col justify-end text-white">
              <h4 className="font-display text-sm">Oriental</h4>
              <p className="text-xs font-bold text-purple-300">20% OFF</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-palm">100%</div>
            <p className="text-xs text-gray-600">Authentic</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-palm">2-3</div>
            <p className="text-xs text-gray-600">Day Delivery</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-palm">24/7</div>
            <p className="text-xs text-gray-600">Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}