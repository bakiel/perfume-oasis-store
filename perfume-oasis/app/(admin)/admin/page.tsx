"use client"

import { useState, useEffect } from "react"
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import Link from "next/link"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  pendingOrders: number
  lowStockProducts: number
  monthlyRevenue: number
  monthlyGrowth: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    recentOrders: [],
    topProducts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    const supabase = createClient()
    
    // Get date ranges
    const now = new Date()
    const startOfThisMonth = startOfMonth(now)
    const endOfThisMonth = endOfMonth(now)
    const startOfLastMonth = startOfMonth(subMonths(now, 1))
    const endOfLastMonth = endOfMonth(subMonths(now, 1))

    // Fetch all stats in parallel
    const [
      ordersResult,
      customersResult,
      productsResult,
      lowStockResult,
      thisMonthRevenueResult,
      lastMonthRevenueResult,
      recentOrdersResult,
      topProductsResult
    ] = await Promise.all([
      // Total orders and revenue
      supabase
        .from('orders')
        .select('total_amount, status, payment_status, created_at')
        .eq('payment_status', 'paid'),
      
      // Total customers
      supabase
        .from('customers')
        .select('id', { count: 'exact' }),
      
      // Total active products
      supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('is_active', true),
      
      // Low stock products
      supabase
        .from('products')
        .select('id')
        .eq('track_inventory', true)
        .lte('stock_quantity', 10),
      
      // This month's revenue
      supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', startOfThisMonth.toISOString())
        .lte('created_at', endOfThisMonth.toISOString()),
      
      // Last month's revenue
      supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString()),
      
      // Recent orders
      supabase
        .from('orders')
        .select('id, order_number, customer_name, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Top products - simplified query
      supabase
        .from('products')
        .select('id, name, main_image_url, stock_quantity, price')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true })
        .limit(5)
    ])

    // Calculate stats
    let newStats = { ...stats }
    
    if (ordersResult.data) {
      const paidOrders = ordersResult.data
      newStats.totalRevenue = paidOrders.reduce((sum, order) => sum + order.total_amount, 0)
      newStats.totalOrders = paidOrders.length
      newStats.pendingOrders = ordersResult.data.filter(o => o.status === 'pending_payment').length
    }

    if (customersResult.count !== null) {
      newStats.totalCustomers = customersResult.count
    }

    if (productsResult.count !== null) {
      newStats.totalProducts = productsResult.count
    }

    if (lowStockResult.data) {
      newStats.lowStockProducts = lowStockResult.data.length
    }

    if (thisMonthRevenueResult.data) {
      newStats.monthlyRevenue = thisMonthRevenueResult.data.reduce((sum, order) => sum + order.total_amount, 0)
    }

    if (lastMonthRevenueResult.data && thisMonthRevenueResult.data) {
      const lastMonthRevenue = lastMonthRevenueResult.data.reduce((sum, order) => sum + order.total_amount, 0)
      if (lastMonthRevenue > 0) {
        newStats.monthlyGrowth = ((newStats.monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      }
    }

    if (recentOrdersResult.data) {
      newStats.recentOrders = recentOrdersResult.data
    }

    if (topProductsResult.data) {
      newStats.topProducts = topProductsResult.data.map(product => ({
        product_name: product.name,
        image_url: product.main_image_url,
        quantity: product.stock_quantity,
        revenue: product.price * (20 - product.stock_quantity) // Simulated sales
      }))
    }

    setStats(newStats)
    setLoading(false)
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-palm',
      bgColor: 'bg-emerald-palm/10',
      trend: stats.monthlyGrowth,
      subtitle: 'All time'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      subtitle: `${stats.pendingOrders} pending`
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      subtitle: 'Registered users'
    },
    {
      title: 'Active Products',
      value: stats.totalProducts.toString(),
      icon: ShoppingBag,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      subtitle: `${stats.lowStockProducts} low stock`
    }
  ]

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-palm mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display text-emerald-palm mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                {card.trend !== undefined && card.trend !== 0 && (
                  <div className={`flex items-center gap-1 text-sm ${
                    card.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.trend > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(card.trend).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <p className="text-2xl font-semibold mt-1">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-500">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(order.created_at), 'dd MMM')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
            <Link href="/admin/inventory">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {stats.topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">All products well stocked</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400 m-auto mt-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.product_name}</p>
                    <p className="text-xs text-gray-500">{product.quantity} in stock</p>
                  </div>
                  <div className="text-right">
                    {product.quantity <= 5 ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <span className="text-sm text-gray-500">Low</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/products/new">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              View Orders
            </Button>
          </Link>
          <Link href="/admin/inventory">
            <Button variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Check Stock
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Customers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}