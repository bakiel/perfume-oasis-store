'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Download, TrendingUp, Package, AlertCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

interface DailyReport {
  date: string
  generated_at: string
  statistics: {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    ordersByStatus: Record<string, number>
    ordersByPaymentStatus: Record<string, number>
    topProducts: Array<{
      name: string
      quantity: number
      revenue: number
    }>
    hourlyBreakdown: Array<{
      hour: number
      orders: number
      revenue: number
    }>
  }
  orders: Array<{
    order_number: string
    time: string
    total: number
    status: string
    payment_status: string
    items: number
  }>
  inventory_alerts: Array<{
    id: string
    name: string
    sku: string
    inventory_count: number
  }>
  summary: {
    date_formatted: string
    total_orders: number
    total_revenue_formatted: string
    average_order_formatted: string
    peak_hour: number
  }
}

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [report, setReport] = useState<DailyReport | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [selectedDate])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/reports/daily?date=${format(selectedDate, 'yyyy-MM-dd')}`)
      if (!response.ok) throw new Error('Failed to fetch report')
      const data = await response.json()
      setReport(data)
    } catch (error) {
      toast.error('Failed to load report')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!report) return
    
    const csvContent = [
      ['Daily Sales Report - ' + report.summary.date_formatted],
      [],
      ['Summary'],
      ['Total Orders', report.summary.total_orders],
      ['Total Revenue', report.summary.total_revenue_formatted],
      ['Average Order Value', report.summary.average_order_formatted],
      [],
      ['Orders'],
      ['Order Number', 'Time', 'Total', 'Status', 'Payment Status', 'Items'],
      ...report.orders.map(order => [
        order.order_number,
        order.time,
        `R ${order.total.toFixed(2)}`,
        order.status,
        order.payment_status,
        order.items
      ]),
      [],
      ['Top Products'],
      ['Product', 'Quantity Sold', 'Revenue'],
      ...report.statistics.topProducts.map(product => [
        product.name,
        product.quantity,
        `R ${product.revenue.toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-report-${report.date}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Daily Sales Report</h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          />
          <Button onClick={downloadReport} disabled={!report}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.total_orders}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.total_revenue_formatted}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.average_order_formatted}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.peak_hour}:00</div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Order Status</h4>
                  {Object.entries(report.statistics.ordersByStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between py-1">
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Status</h4>
                  {Object.entries(report.statistics.ordersByPaymentStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between py-1">
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report.statistics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R {product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          {report.inventory_alerts && report.inventory_alerts.length > 0 && (
            <Card className="mb-8 border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {report.inventory_alerts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">
                          {product.inventory_count} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}