"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, ShoppingCart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartHelperPage() {
  const router = useRouter()
  const [cleared, setCleared] = useState(false)
  const [cartContents, setCartContents] = useState<any>(null)
  
  const viewCart = () => {
    if (typeof window !== 'undefined') {
      const cart = localStorage.getItem('perfume-oasis-cart')
      if (cart) {
        try {
          const parsed = JSON.parse(cart)
          setCartContents(parsed)
        } catch (e) {
          setCartContents({ error: 'Invalid cart data' })
        }
      } else {
        setCartContents({ empty: true })
      }
    }
  }
  
  const clearCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('perfume-oasis-cart')
      setCleared(true)
      setCartContents(null)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/products')
      }, 2000)
    }
  }
  
  return (
    <div className="min-h-screen bg-soft-sand py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="h-8 w-8 text-emerald-palm" />
            <h1 className="text-2xl font-display text-emerald-palm">Cart Helper</h1>
          </div>
          
          {cleared ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Cart Cleared Successfully!</h2>
              <p className="text-gray-600 mb-4">Redirecting you to the products page...</p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Cart Issue Detected</h3>
                    <p className="text-amber-800 text-sm">
                      You have products in your cart that are no longer available. 
                      This tool will help you clear your cart so you can continue shopping.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={viewCart}
                  variant="outline"
                  className="w-full"
                >
                  <span>View Cart Contents (Debug)</span>
                </Button>
                
                {cartContents && (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono overflow-auto max-h-48">
                    {cartContents.empty ? (
                      <p className="text-gray-600">Cart is empty</p>
                    ) : (
                      <pre>{JSON.stringify(cartContents, null, 2)}</pre>
                    )}
                  </div>
                )}
                
                <Button 
                  onClick={clearCart}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span>Clear Cart & Start Fresh</span>
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <p>After clearing your cart, you'll be redirected to browse our products.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}