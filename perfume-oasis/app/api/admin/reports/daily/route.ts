import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format, startOfDay, endOfDay } from 'date-fns'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    // Get date from query params or use today
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const reportDate = dateParam ? new Date(dateParam) : new Date()
    
    const dayStart = startOfDay(reportDate)
    const dayEnd = endOfDay(reportDate)
    
    // Get all orders for the day
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total,
        status,
        payment_status,
        created_at,
        order_items (
          quantity,
          price,
          product_id,
          products!inner (
            name,
            sku
          )
        )
      `)
      .gte('created_at', dayStart.toISOString())
      .lte('created_at', dayEnd.toISOString())
      .order('created_at', { ascending: false })
    
    if (ordersError) {
      throw ordersError
    }
    
    // Calculate daily statistics
    const stats = {
      totalOrders: orders?.length || 0,
      totalRevenue: orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
      averageOrderValue: 0,
      ordersByStatus: {} as Record<string, number>,
      ordersByPaymentStatus: {} as Record<string, number>,
      topProducts: [] as Array<{ name: string, quantity: number, revenue: number }>,
      hourlyBreakdown: Array(24).fill(0).map((_, i) => ({ hour: i, orders: 0, revenue: 0 }))
    }
    
    if (stats.totalOrders > 0) {
      stats.averageOrderValue = stats.totalRevenue / stats.totalOrders
      
      // Count orders by status
      orders?.forEach(order => {
        stats.ordersByStatus[order.status] = (stats.ordersByStatus[order.status] || 0) + 1
        stats.ordersByPaymentStatus[order.payment_status] = (stats.ordersByPaymentStatus[order.payment_status] || 0) + 1
        
        // Hourly breakdown
        const hour = new Date(order.created_at).getHours()
        stats.hourlyBreakdown[hour].orders++
        stats.hourlyBreakdown[hour].revenue += order.total || 0
      })
      
      // Calculate top products
      const productStats: Record<string, { name: string, quantity: number, revenue: number }> = {}
      
      orders?.forEach(order => {
        order.order_items?.forEach(item => {
          const productName = item.products?.name || 'Unknown Product'
          if (!productStats[productName]) {
            productStats[productName] = { name: productName, quantity: 0, revenue: 0 }
          }
          productStats[productName].quantity += item.quantity
          productStats[productName].revenue += item.quantity * item.price
        })
      })
      
      stats.topProducts = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
    }
    
    // Get inventory alerts (low stock)
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('id, name, sku, stock_quantity')
      .eq('is_active', true)
      .lt('stock_quantity', 10)
      .order('stock_quantity', { ascending: true })
    
    // Generate report
    const report = {
      date: format(reportDate, 'yyyy-MM-dd'),
      generated_at: new Date().toISOString(),
      statistics: stats,
      orders: orders?.map(order => ({
        order_number: order.order_number,
        time: format(new Date(order.created_at), 'HH:mm'),
        total: order.total,
        status: order.status,
        payment_status: order.payment_status,
        items: order.order_items?.length || 0
      })),
      inventory_alerts: lowStockProducts,
      summary: {
        date_formatted: format(reportDate, 'MMMM d, yyyy'),
        total_orders: stats.totalOrders,
        total_revenue_formatted: `R ${stats.totalRevenue.toFixed(2)}`,
        average_order_formatted: `R ${stats.averageOrderValue.toFixed(2)}`,
        peak_hour: stats.hourlyBreakdown.reduce((max, hour, index) => 
          hour.orders > (stats.hourlyBreakdown[max]?.orders || 0) ? index : max, 0
        )
      }
    }
    
    return NextResponse.json(report)
    
  } catch (error) {
    console.error('Daily report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}