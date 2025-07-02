"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/hooks/use-cart"
import { Loader2 } from "lucide-react"

export default function ClearCartPage() {
  const router = useRouter()
  const { clearCart } = useCartStore()
  
  useEffect(() => {
    // Clear the cart
    clearCart()
    
    // Also clear localStorage directly to be sure
    if (typeof window !== 'undefined') {
      localStorage.removeItem('perfume-oasis-cart')
    }
    
    // Redirect to products page after a short delay
    setTimeout(() => {
      router.push('/products')
    }, 1500)
  }, [clearCart, router])
  
  return (
    <div className="min-h-screen bg-soft-sand flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-palm mx-auto mb-4" />
        <h2 className="text-xl font-display text-emerald-palm mb-2">Clearing your cart...</h2>
        <p className="text-gray-600">Redirecting to products page...</p>
      </div>
    </div>
  )
}