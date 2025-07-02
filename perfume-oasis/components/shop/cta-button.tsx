'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function CTAButton() {
  const router = useRouter()
  
  return (
    <Button 
      size="lg" 
      className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-semibold shadow-lg hover:shadow-xl transition-all"
      onClick={() => router.push('/products')}
    >
      View Full Collection
    </Button>
  )
}