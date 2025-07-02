'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Package, Truck, CheckCircle, Clock, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function TrackOrderClient() {
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
    } catch (error) {
      toast.error('Order not found. Please check your order number.')
      setTrackingInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleTrackWithTrackingNumber = async (trackingNum: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/track?trackingNumber=${trackingNum}`)
      if (!response.ok) {
        throw new Error('Order not found')
      }
      const data = await response.json()
      setTrackingInfo(data)
    } catch (error) {
      toast.error('Order not found. Please check your tracking number.')
      setTrackingInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber) {
      handleTrackWithTrackingNumber(trackingNumber)
    } else if (orderNumber) {
      handleTrackWithOrderNumber(orderNumber)
    } else {
      toast.error('Please enter either a tracking number or order number')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />
      case 'processing':
        return <Package className="h-5 w-5" />
      case 'shipped':
        return <Truck className="h-5 w-5" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      case 'shipped':
        return 'text-purple-600 bg-purple-50'
      case 'delivered':
        return 'text-green-600 bg-green-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600 mb-8">
            Enter your tracking number or order number to see the status of your order.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., TRK123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  disabled={loading}
                />
              </div>

              <div className="text-center text-gray-500">OR</div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="order"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., PO1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || (!trackingNumber && !orderNumber)}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Tracking...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </span>
                )}
              </Button>
            </form>
          </div>

          {trackingInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">Order #{trackingInfo.orderNumber}</h2>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingInfo.status)}`}>
                    {getStatusIcon(trackingInfo.status)}
                    {trackingInfo.status.charAt(0).toUpperCase() + trackingInfo.status.slice(1)}
                  </span>
                  {trackingInfo.trackingNumber && (
                    <span className="text-sm text-gray-600">
                      Tracking: {trackingInfo.trackingNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Delivery Address</h3>
                  <p className="text-gray-600 text-sm">
                    {trackingInfo.deliveryAddress.street}<br />
                    {trackingInfo.deliveryAddress.suburb}, {trackingInfo.deliveryAddress.city}<br />
                    {trackingInfo.deliveryAddress.province} {trackingInfo.deliveryAddress.postalCode}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-medium text-sm">Order Placed</p>
                        <p className="text-gray-600 text-sm">
                          {new Date(trackingInfo.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {trackingInfo.shippedAt && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-medium text-sm">Shipped</p>
                          <p className="text-gray-600 text-sm">
                            {new Date(trackingInfo.shippedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {trackingInfo.deliveredAt && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-medium text-sm">Delivered</p>
                          <p className="text-gray-600 text-sm">
                            {new Date(trackingInfo.deliveredAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {trackingInfo.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>R{trackingInfo.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}