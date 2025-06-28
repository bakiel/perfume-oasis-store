"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileStoryAd() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the ad in this session
    const dismissed = sessionStorage.getItem('storyAdDismissed')
    if (!dismissed) {
      // Show ad after 3 seconds on mobile
      const timer = setTimeout(() => {
        if (window.innerWidth < 768) {
          setIsVisible(true)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setHasBeenDismissed(true)
    sessionStorage.setItem('storyAdDismissed', 'true')
  }

  if (!isVisible || hasBeenDismissed) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:hidden">
      <div className="relative w-full max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
          <Image
            src="/images/vertical-designs/stories/PO-vertical-story-main.jpg"
            alt="Special Offer"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
            <h3 className="text-2xl font-display mb-2">New Arrivals</h3>
            <p className="text-sm mb-4 opacity-90">Discover the latest luxury fragrances</p>
            <div className="flex gap-3 justify-center">
              <Link href="/products?sort=newest" onClick={handleDismiss}>
                <Button 
                  size="sm" 
                  variant="gold"
                >
                  Shop Now
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={handleDismiss}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}