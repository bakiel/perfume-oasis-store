'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function HeroButtons() {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        size="lg" 
        className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-semibold"
        onClick={() => router.push('/products')}
      >
        Shop Collection
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="border-white text-white hover:bg-white/10"
        onClick={() => router.push('/brands')}
      >
        View Brands
      </Button>
    </div>
  )
}