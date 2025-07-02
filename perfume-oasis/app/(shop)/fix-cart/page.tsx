"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FixCartPage() {
  const router = useRouter()
  const { items, removeItem, clearCart } = useCartStore()
  const [checking, setChecking] = useState(true)
  const [invalidItems, setInvalidItems] = useState<any[]>([])
  const [validItems, setValidItems] = useState<any[]>([])
  
  useEffect(() => {
    checkCart()
  }, [])
  
  const checkCart = async () => {
    const supabase = createClient()
    const invalid = []
    const valid = []
    
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('id', item.id)
        .single()
      
      if (!product) {
        invalid.push(item)
      } else if (parseFloat(product.price) !== item.price) {
        invalid.push({...item, reason: 'price changed', newPrice: product.price})
      } else {
        valid.push(item)
      }
    }
    
    setInvalidItems(invalid)
    setValidItems(valid)
    setChecking(false)
  }
  
  const removeInvalidItems = () => {
    invalidItems.forEach(item => removeItem(item.id))
    router.push('/cart')
  }
  
  const clearAndStartFresh = () => {
    clearCart()
    router.push('/products')
  }
  
  if (checking) {
    return (
      <div className="min-h-screen bg-soft-sand flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-palm mx-auto mb-4" />
          <h2 className="text-xl font-display text-emerald-palm">Checking your cart...</h2>
          <p className="text-gray-600 mt-2">Please wait while we validate your items</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-soft-sand py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-display text-emerald-palm mb-6">Cart Validation</h1>
          
          {invalidItems.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is valid!</h2>
              <p className="text-gray-600 mb-6">All items are available at their current prices.</p>
              <Button onClick={() => router.push('/cart')} className="bg-emerald-palm hover:bg-emerald-700">
                Return to Cart
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Invalid items found</h3>
                    <p className="text-red-800 text-sm mb-3">
                      The following items are no longer available or have changed:
                    </p>
                    <ul className="space-y-2">
                      {invalidItems.map((item, index) => (
                        <li key={index} className="text-sm text-red-700">
                          <strong>{item.name}</strong>
                          {item.reason === 'price changed' && (
                            <span> - Price changed from R{item.price} to R{item.newPrice}</span>
                          )}
                          {!item.reason && <span> - No longer available</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={removeInvalidItems}
                  className="w-full bg-emerald-palm hover:bg-emerald-700"
                >
                  Remove Invalid Items ({invalidItems.length})
                </Button>
                
                <Button 
                  onClick={clearAndStartFresh}
                  variant="outline"
                  className="w-full"
                >
                  Clear Cart & Start Fresh
                </Button>
                
                {validItems.length > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    You have {validItems.length} valid item{validItems.length !== 1 ? 's' : ''} that will remain in your cart
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}