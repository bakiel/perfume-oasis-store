'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/hooks/use-cart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DiagnosticsPage() {
  const [mounted, setMounted] = useState(false)
  const [renderCount, setRenderCount] = useState(0)
  
  // Get all cart store state
  const cartItems = useCartStore(state => state.items)
  const cartCount = useCartStore(state => state.getItemCount())
  const cartTotal = useCartStore(state => state.getTotal())
  const isHydrated = useCartStore(state => state.hydrated)
  const addItem = useCartStore(state => state.addItem)
  const clearCart = useCartStore(state => state.clearCart)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    setRenderCount(prev => prev + 1)
  })
  
  const addTestItem = () => {
    addItem({
      id: 'test-' + Date.now(),
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      image: '/test.jpg',
      size: '100ml'
    })
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Hydration Diagnostics</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Render Information</CardTitle>
          <CardDescription>Tracking component lifecycle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>Mounted: {mounted ? '✅ Yes' : '❌ No'}</div>
          <div>Render Count: {renderCount}</div>
          <div>Time: {mounted ? new Date().toLocaleTimeString() : 'Not mounted'}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cart Store State</CardTitle>
          <CardDescription>Current Zustand store values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>Hydrated: {isHydrated ? '✅ Yes' : '❌ No'}</div>
          <div>Item Count: {mounted ? cartCount : 'Loading...'}</div>
          <div>Total Value: {mounted ? `R${cartTotal.toFixed(2)}` : 'Loading...'}</div>
          <div>Items in Cart: {mounted ? cartItems.length : 'Loading...'}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cart Items</CardTitle>
          <CardDescription>Current items in the cart</CardDescription>
        </CardHeader>
        <CardContent>
          {mounted ? (
            cartItems.length > 0 ? (
              <ul className="space-y-2">
                {cartItems.map(item => (
                  <li key={item.id} className="text-sm">
                    {item.name} - {item.quantity}x @ R{item.price}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No items in cart</p>
            )
          ) : (
            <p>Loading cart items...</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
          <CardDescription>Test cart functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={addTestItem}>Add Test Item</Button>
            <Button onClick={clearCart} variant="destructive">Clear Cart</Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>Current environment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>Node Env: {process.env.NODE_ENV}</div>
          <div>Browser: {mounted ? (typeof window !== 'undefined' ? '✅ Client' : '❌ Server') : 'Checking...'}</div>
          <div>LocalStorage Available: {mounted ? (typeof localStorage !== 'undefined' ? '✅ Yes' : '❌ No') : 'Checking...'}</div>
        </CardContent>
      </Card>
      
      <Card className="border-yellow-500">
        <CardHeader>
          <CardTitle>Common Hydration Issues</CardTitle>
          <CardDescription>Things to check</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul>
            <li>✅ Using mounted state before rendering dynamic content</li>
            <li>✅ Cart store has hydration flag</li>
            <li>✅ CartCount component handles mounting properly</li>
            <li>✅ No direct Date() calls in render</li>
            <li>✅ LocalStorage only accessed after mount</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
