"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export default function CartClearPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Clear all cart-related localStorage items
    if (typeof window !== 'undefined') {
      localStorage.removeItem('perfume-oasis-cart')
      // Clear any other cart-related storage
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.includes('cart')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
    
    // Redirect to products page after clearing
    const timer = setTimeout(() => {
      router.push('/products')
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [router])
  
  return (
    <div className="min-h-screen bg-soft-sand flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-display text-emerald-palm mb-3">
          Cart Cleared Successfully
        </h1>
        <p className="text-gray-600 mb-2">
          Your cart has been cleared. You can now add fresh products.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting you to products page...
        </p>
      </div>
    </div>
  )
}