"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/hooks/use-cart"
import { CheckCircle } from "lucide-react"

export default function RemoveOceanBreezePage() {
  const router = useRouter()
  const { items, removeItem } = useCartStore()
  
  useEffect(() => {
    // Find and remove Ocean Breeze specifically
    const oceanBreezeItem = items.find(item => 
      item.name.toLowerCase().includes('ocean') || 
      item.name.toLowerCase().includes('breeze')
    )
    
    if (oceanBreezeItem) {
      removeItem(oceanBreezeItem.id)
    }
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/checkout')
    }, 2000)
  }, [items, removeItem, router])
  
  return (
    <div className="min-h-screen bg-soft-sand flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-display text-emerald-palm mb-3">
          Removing Unavailable Item
        </h1>
        <p className="text-gray-600 mb-2">
          We're removing "Ocean Breeze" from your cart as it's no longer available.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting you back to checkout...
        </p>
      </div>
    </div>
  )
}