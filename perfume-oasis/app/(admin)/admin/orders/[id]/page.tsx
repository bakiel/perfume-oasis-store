"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Download,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import toast from "react-hot-toast"
import PaymentVerificationModal from "@/components/admin/payment-verification-modal"

interface OrderItem {
  id: string
  product_name: string
  product_sku: string
  product_image: string
  price: number
  quantity: number
  subtotal: number
}

interface Order {
  id: string
  order_number: string
  customer_id: string
  customer_email: string
  customer_name: string
  customer_phone: string
  shipping_address: any
  billing_address: any
  subtotal: number
  shipping_fee: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  payment_method: string
  payment_status: string
  payment_reference: string
  paid_at: string
  status: string
  fulfillment_status: string
  tracking_number: string
  shipped_at: string
  delivered_at: string
  customer_notes: string
  admin_notes: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
  payment_confirmations: any[]
}

const statusOptions = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'bg-amber-100 text-amber-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'ready_to_ship', label: 'Ready to Ship', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
]

const paymentStatusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        payment_confirmations(*)
      `)
      .eq('id', params.id)
      .single()

    if (error || !data) {
      toast.error('Order not found')
      router.push('/admin/orders')
      return
    }

    setOrder(data)
    setTrackingNumber(data.tracking_number || "")
    setAdminNotes(data.admin_notes || "")
    setLoading(false)
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return
    
    setUpdating(true)
    const supabase = createClient()
    
    const updates: any = { status: newStatus }
    
    // Update fulfillment status based on order status
    if (newStatus === 'shipped') {
      updates.fulfillment_status = 'fulfilled'
      updates.shipped_at = new Date().toISOString()
    } else if (newStatus === 'delivered') {
      updates.delivered_at = new Date().toISOString()
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to update order status')
    } else {
      toast.success('Order status updated')
      fetchOrder()
    }
    
    setUpdating(false)
  }

  const updatePaymentStatus = async (newStatus: string) => {
    if (!order) return
    
    setUpdating(true)
    const supabase = createClient()
    
    const updates: any = { payment_status: newStatus }
    
    if (newStatus === 'paid') {
      updates.paid_at = new Date().toISOString()
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to update payment status')
    } else {
      toast.success('Payment status updated')
      fetchOrder()
    }
    
    setUpdating(false)
  }

  const saveTrackingNumber = async () => {
    if (!order) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber })
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to save tracking number')
    } else {
      toast.success('Tracking number saved')
    }
  }

  const saveAdminNotes = async () => {
    if (!order) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ admin_notes: adminNotes })
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to save notes')
    } else {
      toast.success('Notes saved')
    }
  }

  const resendInvoice = async () => {
    // TODO: Implement invoice resending
    toast.success('Invoice sent to customer')
  }

  if (loading || !order) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-palm mx-auto"></div>
      </div>
    )
  }

  const currentStatus = statusOptions.find(s => s.value === order.status) || statusOptions[0]
  const currentPaymentStatus = paymentStatusOptions.find(s => s.value === order.payment_status) || paymentStatusOptions[0]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-display text-emerald-palm">
              Order {order.order_number}
            </h1>
            <p className="text-gray-600">
              Created {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={resendInvoice}>
            <Mail className="h-4 w-4 mr-2" />
            Send Invoice
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Order Status</h3>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${currentStatus.color} font-medium text-sm`}
                disabled={updating}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Payment Status</h3>
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={order.payment_status}
                onChange={(e) => updatePaymentStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${currentPaymentStatus.color} font-medium text-sm`}
                disabled={updating}
              >
                {paymentStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {item.product_image ? (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400 m-auto mt-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping_fee)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax (15% VAT)</span>
                <span>{formatCurrency(order.tax_amount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-emerald-palm">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Shipping Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tracking Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                />
                <Button size="sm" onClick={saveTrackingNumber}>
                  Save
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.province}</p>
                  <p>{order.shipping_address.postal_code}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Billing Address</h4>
                <div className="text-sm text-gray-600">
                  {order.billing_address ? (
                    <>
                      <p>{order.billing_address.street}</p>
                      <p>{order.billing_address.city}, {order.billing_address.province}</p>
                      <p>{order.billing_address.postal_code}</p>
                    </>
                  ) : (
                    <p>Same as shipping address</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this order..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
            />
            <Button size="sm" onClick={saveAdminNotes} className="mt-2">
              Save Notes
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${order.customer_email}`} className="text-sm text-emerald-palm hover:underline">
                  {order.customer_email}
                </a>
              </div>
              {order.customer_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{order.customer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Method</p>
                <p className="font-medium">Bank Transfer</p>
              </div>
              {order.payment_reference && (
                <div>
                  <p className="text-sm text-gray-600">Reference</p>
                  <p className="font-medium">{order.payment_reference}</p>
                </div>
              )}
              {order.paid_at && (
                <div>
                  <p className="text-sm text-gray-600">Paid At</p>
                  <p className="font-medium">
                    {format(new Date(order.paid_at), 'dd MMM yyyy, HH:mm')}
                  </p>
                </div>
              )}
              
              {order.payment_confirmations.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Payment Confirmations</p>
                  {order.payment_confirmations.map((confirmation) => (
                    <div key={confirmation.id} className="text-sm bg-gray-50 p-2 rounded">
                      <p>{formatCurrency(confirmation.amount)}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(confirmation.payment_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => setShowPaymentModal(true)}
              >
                Verify Payment
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Order Timeline</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-emerald-palm rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                  </p>
                </div>
              </div>
              
              {order.paid_at && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(order.paid_at), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </div>
              )}
              
              {order.shipped_at && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order Shipped</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(order.shipped_at), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </div>
              )}
              
              {order.delivered_at && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order Delivered</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(order.delivered_at), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          {order.customer_notes && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Customer Notes</h3>
              <p className="text-sm text-gray-600">{order.customer_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Verification Modal */}
      {showPaymentModal && (
        <PaymentVerificationModal
          orderId={order.id}
          orderTotal={order.total_amount}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false)
            fetchOrder()
          }}
        />
      )}
    </div>
  )
}