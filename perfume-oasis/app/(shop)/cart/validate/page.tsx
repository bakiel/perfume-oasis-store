"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCartStore } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"

export default function ValidateCartPage() {
  const router = useRouter()
  const { items, removeItem } = useCartStore()
  const [validating, setValidating] = useState(true)
  const [invalidItems, setInvalidItems] = useState<string[]>([])
  const [priceChanges, setPriceChanges] = useState<{id: string, name: string, oldPrice: number, newPrice: number}[]>([])
  
  useEffect(() => {
    validateCart()
  }, [])
  
  const validateCart = async () => {
    setValidating(true)
    const invalid: string[] = []
    const changes: typeof priceChanges = []
    
    const supabase = createClient()
    
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity')
        .eq('id', item.id)
        .single()
      
      if (!product) {
        invalid.push(item.id)
      } else if (parseFloat(product.price) !== item.price) {
        changes.push({
          id: item.id,
          name: item.name,
          oldPrice: item.price,
          newPrice: parseFloat(product.price)
        })
      }
    }
    
    setInvalidItems(invalid)
    setPriceChanges(changes)
    setValidating(false)
  }
  
  const removeInvalidItems = () => {
    invalidItems.forEach(id => removeItem(id))
    router.push('/cart')
  }
  
  const acceptPriceChanges = () => {
    router.push('/cart')
  }
  
  if (validating) {
    return (
      <div className="min-h-screen bg-soft-sand flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-palm mx-auto mb-4" />
          <p className="text-gray-600">Validating your cart...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-soft-sand py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl font-display text-emerald-palm mb-6">Cart Validation</h1>
        
        {invalidItems.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <p className="font-semibold mb-2">Some items are no longer available:</p>
              <ul className="list-disc list-inside mb-4">
                {invalidItems.map(id => {
                  const item = items.find(i => i.id === id)
                  return item ? <li key={id}>{item.name}</li> : null
                })}
              </ul>
              <Button 
                onClick={removeInvalidItems}
                variant="destructive"
                size="sm"
              >
                Remove Unavailable Items
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {priceChanges.length > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <p className="font-semibold mb-2">Price changes detected:</p>
              <ul className="list-disc list-inside mb-4">
                {priceChanges.map(change => (
                  <li key={change.id}>
                    {change.name}: R{change.oldPrice} → R{change.newPrice}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={acceptPriceChanges}
                variant="outline"
                size="sm"
              >
                Continue with Updated Prices
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {invalidItems.length === 0 && priceChanges.length === 0 && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your cart is valid! All items are available at their current prices.
              <div className="mt-4">
                <Button 
                  onClick={() => router.push('/cart')}
                  className="bg-emerald-palm hover:bg-emerald-700"
                >
                  Return to Cart
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}