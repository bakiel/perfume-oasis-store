"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  MapPin,
  Filter,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  total_orders: number
  total_spent: number
  accepts_marketing: boolean
  created_at: string
  default_shipping_address: any
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMarketing, setFilterMarketing] = useState<"all" | "yes" | "no">("all")

  useEffect(() => {
    fetchCustomers()
  }, [filterMarketing])

  const fetchCustomers = async () => {
    const supabase = createClient()
    
    // Get customers data
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterMarketing !== "all") {
      query = query.eq('accepts_marketing', filterMarketing === "yes")
    }

    const { data: customersData, error } = await query

    if (!error && customersData) {
      // For now, use a placeholder email format
      // In production, you'd fetch this from auth.users via a server component
      const formattedCustomers = customersData.map(customer => ({
        ...customer,
        email: `customer${customer.id.slice(0, 8)}@example.com`
      }))
      
      setCustomers(formattedCustomers)
    }
    
    setLoading(false)
  }

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.toLowerCase()
    const search = searchQuery.toLowerCase()
    return (
      fullName.includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      (customer.phone && customer.phone.includes(search))
    )
  })

  const getCustomerName = (customer: Customer) => {
    if (customer.first_name || customer.last_name) {
      return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }
    return 'Anonymous Customer'
  }

  const getInitials = (customer: Customer) => {
    const name = getCustomerName(customer)
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getTotalStats = () => {
    return {
      totalCustomers: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
      avgOrderValue: customers.length > 0 
        ? customers.reduce((sum, c) => sum + (c.total_spent / Math.max(c.total_orders, 1)), 0) / customers.length
        : 0,
      marketingSubscribers: customers.filter(c => c.accepts_marketing).length
    }
  }

  const stats = getTotalStats()

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-emerald-palm">
            Customers
          </h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-semibold text-emerald-palm">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-semibold text-emerald-palm">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Avg Order Value</p>
          <p className="text-2xl font-semibold text-emerald-palm">{formatCurrency(stats.avgOrderValue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Email Subscribers</p>
          <p className="text-2xl font-semibold text-emerald-palm">{stats.marketingSubscribers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterMarketing === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMarketing("all")}
            >
              All Customers
            </Button>
            <Button
              variant={filterMarketing === "yes" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMarketing("yes")}
            >
              Subscribers
            </Button>
            <Button
              variant={filterMarketing === "no" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMarketing("no")}
            >
              Non-subscribers
            </Button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-palm mx-auto"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-center">Orders</th>
                  <th className="px-4 py-3 text-right">Total Spent</th>
                  <th className="px-4 py-3 text-center">Marketing</th>
                  <th className="px-4 py-3 text-center">Joined</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-palm/10 rounded-full flex items-center justify-center">
                          <span className="text-emerald-palm font-semibold text-sm">
                            {getInitials(customer)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{getCustomerName(customer)}</p>
                          {customer.default_shipping_address && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {customer.default_shipping_address.city}, {customer.default_shipping_address.province}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <a href={`mailto:${customer.email}`} className="text-emerald-palm hover:underline">
                            {customer.email}
                          </a>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{customer.total_orders}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(customer.total_spent)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.accepts_marketing
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.accepts_marketing ? 'Subscribed' : 'Not subscribed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {format(new Date(customer.created_at), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}