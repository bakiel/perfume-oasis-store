"use client"

import { useEffect, useState } from 'react'
import { useCartStore } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'

export default function DebugCartPage() {
  const { items, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Cart</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Cart Items ({items.length})</h2>
          
          {items.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border p-4 rounded">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                  <p className="text-sm text-gray-600">ID: {item.id}</p>
                  <p className="text-sm text-gray-600">Price: R{item.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">Image: {item.image}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Raw Cart Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(items, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <Button onClick={clearCart} variant="destructive">
              Clear Cart
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button onClick={() => window.location.href = '/products'}>
              Go to Products
            </Button>
            <Button onClick={() => window.location.href = '/checkout'}>
              Go to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}