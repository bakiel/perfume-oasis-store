"use client"

import { useCartStore } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function TestCartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, addItem, getItemCount, getTotal } = useCartStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div>Loading...</div>

  const testProduct = {
    id: "test-123",
    name: "Test Perfume",
    brand: "Test Brand",
    price: 500,
    image: "/placeholder.jpg",
    size: "100ml"
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cart Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <p>Items in cart: {getItemCount()}</p>
          <p>Total: R{getTotal()}</p>
        </div>
        
        <Button 
          onClick={() => {
            console.log("Adding item:", testProduct)
            addItem(testProduct)
            console.log("Cart items after add:", items)
          }}
        >
          Add Test Item
        </Button>
        
        <div>
          <h2 className="font-semibold">Cart Contents:</h2>
          <pre>{JSON.stringify(items, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}