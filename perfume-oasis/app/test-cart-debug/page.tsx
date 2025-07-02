"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/hooks/use-cart"

export default function TestCartDebug() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cart = useCartStore()

  useEffect(() => {
    setMounted(true)
    try {
      // Test basic cart functionality
      console.log("Cart items:", cart.items)
      console.log("Cart total:", cart.getTotal())
    } catch (err: any) {
      setError(err.message || "Unknown error")
      console.error("Cart error:", err)
    }
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cart Debug Test</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Cart State:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({
              items: cart.items,
              promoCode: cart.promoCode,
              discount: cart.discount,
              freeShipping: cart.freeShipping,
              subtotal: cart.getSubtotal(),
              total: cart.getTotal()
            }, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="font-semibold">Environment Check:</h2>
          <ul className="list-disc pl-5">
            <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}</li>
            <li>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}</li>
            <li>Window object: {typeof window !== 'undefined' ? "✓ Available" : "✗ Not available"}</li>
          </ul>
        </div>
        
        <button
          onClick={() => {
            try {
              cart.addItem({
                id: "test-1",
                name: "Test Product",
                brand: "Test Brand",
                price: 100,
                image: "/images/products/placeholder.jpg",
                size: "100ml"
              })
              console.log("Item added successfully")
            } catch (err: any) {
              setError(err.message || "Error adding item")
              console.error("Add item error:", err)
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Test Item
        </button>
      </div>
    </div>
  )
}