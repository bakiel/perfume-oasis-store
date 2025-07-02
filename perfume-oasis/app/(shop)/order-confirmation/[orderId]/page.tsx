import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, Mail, Package, CreditCard, Download, ArrowLeft, ExternalLink } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { createClient } from '@/lib/supabase/server'
import { notFound } from "next/navigation"
import { OrderActionsEnhanced } from "./order-actions-enhanced"

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string }
}) {
  const supabase = await createClient()
  
  // Fetch order details
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (
          name,
          main_image_url,
          brand:brands (name)
        )
      )
    `)
    .eq('id', params.orderId)
    .single()
  
  if (error || !order) {
    notFound()
  }
  
  // Parse delivery address
  const deliveryAddress = typeof order.delivery_address === 'string' 
    ? JSON.parse(order.delivery_address) 
    : order.delivery_address

  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Success Banner */}
      <div className="bg-emerald-palm text-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-display mb-2">
            Order Confirmed!
          </h1>
          <p className="text-white/90">
            Thank you for your purchase
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-bold text-emerald-palm">
              #{order.order_number}
            </p>
            {order.invoice_number && (
              <>
                <p className="text-gray-600 mt-2">Invoice Number</p>
                <p className="text-lg font-semibold">
                  #{order.invoice_number}
                </p>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-emerald-palm mt-0.5" />
              <div>
                <p className="font-medium">Confirmation Email Sent</p>
                <p className="text-sm text-gray-600">
                  We've sent your order details and invoice PDF to {order.customer_email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Package className="h-5 w-5 text-emerald-palm mt-0.5" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-sm text-gray-600">
                  3-7 working days to {deliveryAddress?.city}, {deliveryAddress?.province}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CreditCard className="h-5 w-5 text-emerald-palm mt-0.5" />
              <div>
                <p className="font-medium">Payment Status</p>
                <p className="text-sm text-gray-600">
                  {order.payment_status === 'pending' ? 'Awaiting Payment' : 'Payment Received'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {item.product?.main_image_url && (
                    <Image
                      src={item.product.main_image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.product?.brand?.name} • Qty: {item.quantity}
                  </p>
                  <p className="font-medium mt-1">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal || order.total)}</span>
            </div>
            {order.delivery_fee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>{formatCurrency(order.delivery_fee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-emerald-palm">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        {order.payment_status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-amber-900 mb-2">
              Payment Instructions
            </h3>
            <p className="text-amber-800 text-sm mb-3">
              Please complete your payment using the following bank details:
            </p>
            <div className="bg-white rounded p-4 space-y-2 text-sm">
              <div><span className="font-medium">Bank:</span> Nedbank</div>
              <div><span className="font-medium">Account Name:</span> Torrencial</div>
              <div><span className="font-medium">Account Number:</span> 1313614866</div>
              <div><span className="font-medium">Branch Code:</span> 198765</div>
              <div><span className="font-medium">Reference:</span> <span className="font-mono bg-amber-100 px-2 py-1 rounded">{order.order_number}</span></div>
            </div>
            <p className="text-amber-800 text-xs mt-3">
              Important: Use your order number as the payment reference
            </p>
            
            {/* Link to Payment Guide */}
            <div className="mt-4">
              <Link href="/payment-guide">
                <Button variant="outline" className="w-full bg-white hover:bg-amber-100 border-amber-300">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Complete Payment Guide
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Actions */}
        <OrderActionsEnhanced order={order} />

        {/* Continue Shopping */}
        <div className="text-center">
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}