'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Package, Truck, CheckCircle, Clock, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState<any>(null)

  useEffect(() => {
    // Check if order number is passed in query params
    const orderParam = searchParams.get('order')
    if (orderParam) {
      setOrderNumber(orderParam)
      // Auto-track if order number is provided
      handleTrackWithOrderNumber(orderParam)
    }
  }, [searchParams])

  const handleTrackWithOrderNumber = async (orderNum: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/track?orderNumber=${orderNum}`)
      if (!response.ok) {
        throw new Error('Order not found')
      }
      
      const data = await response.json()
      setTrackingInfo(data)
      
      // If we have a courier tracking number, also open Courier Guy
      if (data.trackingNumber) {
        window.open(`https://www.courierguy.co.za/tracking?ref=${data.trackingNumber}`, '_blank')
      }
    } catch (error) {
      toast.error('Unable to find tracking information')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingNumber && !orderNumber) {
      toast.error('Please enter either a tracking number or order number')
      return
    }

    setLoading(true)
    
    try {
      // If tracking number is provided, redirect to Courier Guy
      if (trackingNumber) {
        window.open(`https://www.courierguy.co.za/tracking?ref=${trackingNumber}`, '_blank')
        return
      }

      // If order number is provided, fetch from our API
      if (orderNumber) {
        await handleTrackWithOrderNumber(orderNumber)
      }
    } catch (error) {
      toast.error('Unable to find tracking information')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-600" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-emerald-600" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Received'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Courier Guy Tracking Number
              </label>
              <input
                id="trackingNumber"
                type="text"
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value)
                  setOrderNumber('') // Clear order number
                }}
                placeholder="e.g., CG123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your Courier Guy tracking number from your shipping confirmation email
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value)
                  setTrackingNumber('') // Clear tracking number
                }}
                placeholder="e.g., PO1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your order number from your order confirmation email
              </p>
            </div>
            
            <Button
              type="submit"
              disabled={loading || (!trackingNumber && !orderNumber)}
              className="w-full"
            >
              {loading ? (
                'Tracking...'
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Track Order
                </>
              )}
            </Button>
          </form>
        </div>

        {trackingInfo && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{trackingInfo.orderNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(trackingInfo.status)}
                  <span className="font-medium">{getStatusText(trackingInfo.status)}</span>
                </div>
              </div>
              
              {trackingInfo.trackingNumber && (
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-medium">{trackingInfo.trackingNumber}</p>
                </div>
              )}
              
              {trackingInfo.estimatedDelivery && (
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">{trackingInfo.estimatedDelivery}</p>
                </div>
              )}
            </div>
            
            {trackingInfo.trackingNumber && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  For detailed tracking information, click the button below to track your package on Courier Guy's website:
                </p>
                <Button
                  onClick={() => window.open(`https://www.courierguy.co.za/tracking?ref=${trackingInfo.trackingNumber}`, '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Track on Courier Guy
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-12 bg-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">
            Shipping Information
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• All orders are shipped via Courier Guy</p>
            <p>• Standard delivery: 2-5 business days (major centers)</p>
            <p>• Outlying areas: 3-7 business days</p>
            <p>• Tracking number sent via email once shipped</p>
            <p>• Flat rate: R150 (FREE shipping on orders over R1,000)</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:orders@perfumeoasis.co.za" className="text-emerald-600 hover:text-emerald-700">
              orders@perfumeoasis.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}