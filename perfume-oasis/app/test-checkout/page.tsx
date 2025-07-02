'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function TestCheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const testCheckout = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Sample checkout data
      const checkoutData = {
        customer: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '0123456789',
          street: '123 Test Street',
          suburb: 'Test Suburb',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2000'
        },
        items: [
          {
            id: 'd7cd6ef8-6fb1-427f-b40a-77f50756f562', // Real product ID from database
            name: 'Barakkat Rouge 540',
            brand: 'Barakkat',
            price: 680.00,
            quantity: 1
          }
        ],
        subtotal: 680.00,
        delivery: 150,
        total: 830.00
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      })

      const data = await response.json()
      setResult({
        status: response.status,
        data: data
      })

      if (response.ok) {
        console.log('Checkout successful:', data)
      } else {
        console.error('Checkout failed:', data)
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      setResult({
        status: 'error',
        data: { error: error.message || 'Unknown error' }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Checkout Flow</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>First, make sure you're logged in</li>
            <li>Click the "Test Checkout" button to simulate a purchase</li>
            <li>Check the console for detailed logs</li>
            <li>If successful, you'll see the order details below</li>
          </ol>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={testCheckout}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Processing...' : 'Test Checkout'}
          </Button>

          <Button
            onClick={() => router.push('/auth/login')}
            variant="outline"
          >
            Go to Login
          </Button>

          <Button
            onClick={() => router.push('/products')}
            variant="outline"
          >
            Go to Products
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg ${result.status === 200 ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className="text-lg font-semibold mb-2">
              Result (Status: {result.status})
            </h3>
            <pre className="whitespace-pre-wrap overflow-auto text-sm">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
