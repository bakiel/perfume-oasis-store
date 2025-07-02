import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, CreditCard, Truck, FileDown, MapPin } from "lucide-react"

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Get order details with items
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(
          name, 
          slug, 
          main_image_url,
          size,
          brand:brands(name)
        )
      )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()
    
  if (!order) {
    redirect('/account/orders')
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="min-h-screen bg-soft-sand">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/account/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display text-emerald-palm">Order #{order.order_number}</h1>
              <p className="text-gray-600 text-sm">Placed on {format(new Date(order.created_at), 'dd MMM yyyy')}</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Order Status</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            {order.tracking_number && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-emerald-palm" />
                  <div>
                    <p className="text-sm font-medium">Tracking Number</p>
                    <p className="text-sm text-gray-600">{order.tracking_number}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    {item.product?.main_image_url && (
                      <Image
                        src={item.product.main_image_url}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name || 'Product'}</h4>
                    <p className="text-sm text-gray-600">
                      {item.product?.brand?.name || 'Brand'} • {item.product?.size || 'Standard Size'}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span>Qty: {item.quantity}</span>
                      <span>R{(item.price || 0).toFixed(2)} each</span>
                      <span className="font-medium">R{(item.total || item.price * item.quantity || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-emerald-palm" />
              <h3 className="font-medium text-lg">Delivery Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Name:</span>{' '}
                <span className="font-medium">{order.customer_name}</span>
              </p>
              <p>
                <span className="text-gray-600">Email:</span>{' '}
                <span className="font-medium">{order.customer_email}</span>
              </p>
              <p>
                <span className="text-gray-600">Phone:</span>{' '}
                <span className="font-medium">{order.customer_phone}</span>
              </p>
              <div>
                <span className="text-gray-600">Address:</span>{' '}
                <div className="font-medium mt-1">
                  {(() => {
                    const address = typeof order.delivery_address === 'string' 
                      ? JSON.parse(order.delivery_address) 
                      : order.delivery_address;
                    return (
                      <>
                        {address?.street || 'N/A'}<br />
                        {address?.suburb || ''}{address?.suburb && address?.city ? ', ' : ''}{address?.city || ''}<br />
                        {address?.province || ''}{address?.province && address?.postalCode ? ', ' : ''}{address?.postalCode || ''}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-emerald-palm" />
              <h3 className="font-medium text-lg">Payment Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">R{(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">
                  {(order.delivery_fee || 0) === 0 ? 'FREE' : `R${(order.delivery_fee || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between py-2 pt-4 border-t font-medium text-lg">
                <span>Total</span>
                <span className="text-emerald-palm">R{(order.total || order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Payment Method: <span className="font-medium">Bank Transfer</span>
              </p>
              <p className="text-sm text-gray-600">
                Payment Status: <span className="font-medium">{order.payment_status || 'Pending'}</span>
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            {order.invoice_pdf_url && (
              <a 
                href={order.invoice_pdf_url}
                download={`invoice-${order.order_number}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </a>
            )}
            {(order.status === 'shipped' || order.tracking_number) && (
              <Link href={`/track-order?order=${order.order_number}`}>
                <Button variant="outline">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </Link>
            )}
            <Link href="/contact">
              <Button variant="outline">
                Need Help?
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}