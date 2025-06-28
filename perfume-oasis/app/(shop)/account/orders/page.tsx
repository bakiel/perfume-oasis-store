import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Eye, FileDown, ArrowLeft } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(name, slug, main_image_url)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    
  return (
    <div className="min-h-screen bg-soft-sand">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display text-emerald-palm">My Orders</h1>
              <p className="text-gray-600 text-sm">Track and manage your orders</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      Order #{order.order_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {format(new Date(order.created_at), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <span className="text-gray-600">
                      Total: <span className="font-medium text-gray-900">R{order.total.toFixed(2)}</span>
                    </span>
                    <span className="text-gray-600">
                      Items: <span className="font-medium text-gray-900">{order.order_items.length}</span>
                    </span>
                  </div>
                </div>
                
                {/* Order Items Preview */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex -space-x-2 overflow-hidden">
                    {order.order_items.slice(0, 4).map((item: any, idx: number) => (
                      <div
                        key={item.id}
                        className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                      >
                        {item.product?.main_image_url && (
                          <img
                            src={item.product.main_image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {order.order_items.length > 4 && (
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          +{order.order_items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  {order.invoice_pdf_url && (
                    <a 
                      href={order.invoice_pdf_url}
                      download={`invoice-${order.order_number}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              When you place your first order, it will appear here
            </p>
            <Link href="/products">
              <Button>
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}