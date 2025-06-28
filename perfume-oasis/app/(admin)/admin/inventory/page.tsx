"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  Edit,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

interface InventoryItem {
  id: string
  sku: string
  name: string
  brand: { name: string } | null
  category: { name: string } | null
  stock_quantity: number
  low_stock_threshold: number
  price: number
  cost: number
  track_inventory: boolean
  is_active: boolean
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "low" | "out">("all")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchInventory()
  }, [filterStatus])

  const fetchInventory = async () => {
    const supabase = createClient()
    
    let query = supabase
      .from('products')
      .select(`
        id,
        sku,
        name,
        brand:brands(name),
        category:categories(name),
        stock_quantity,
        low_stock_threshold,
        price,
        cost,
        track_inventory,
        is_active
      `)
      .eq('track_inventory', true)
      .order('stock_quantity', { ascending: true })

    const { data, error } = await query

    if (!error && data) {
      // Transform the data to match the expected type
      const transformedData = data.map(item => ({
        ...item,
        brand: Array.isArray(item.brand) ? item.brand[0] : item.brand,
        category: Array.isArray(item.category) ? item.category[0] : item.category
      }))
      
      let filteredData = transformedData
      
      if (filterStatus === "low") {
        filteredData = transformedData.filter(item => 
          item.stock_quantity > 0 && 
          item.stock_quantity <= item.low_stock_threshold
        )
      } else if (filterStatus === "out") {
        filteredData = transformedData.filter(item => item.stock_quantity === 0)
      }
      
      setInventory(filteredData)
    }
    
    setLoading(false)
  }

  const handleUpdateStock = async (id: string) => {
    const newQuantity = editQuantity[id]
    if (!newQuantity || isNaN(parseInt(newQuantity))) {
      toast.error('Please enter a valid quantity')
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: parseInt(newQuantity) })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update stock')
    } else {
      toast.success('Stock updated successfully')
      setEditingItem(null)
      fetchInventory()
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: TrendingDown }
    } else if (quantity <= threshold) {
      return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800', icon: AlertTriangle }
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: TrendingUp }
    }
  }

  const getInventoryValue = () => {
    return inventory.reduce((total, item) => total + (item.stock_quantity * item.cost), 0)
  }

  const getRetailValue = () => {
    return inventory.reduce((total, item) => total + (item.stock_quantity * item.price), 0)
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-emerald-palm">
            Inventory Management
          </h1>
          <p className="text-gray-600">Track and manage stock levels</p>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-semibold text-emerald-palm">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-semibold text-amber-600">
            {inventory.filter(i => i.stock_quantity > 0 && i.stock_quantity <= i.low_stock_threshold).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-semibold text-red-600">
            {inventory.filter(i => i.stock_quantity === 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Inventory Value</p>
          <p className="text-2xl font-semibold text-emerald-palm">{formatCurrency(getInventoryValue())}</p>
          <p className="text-xs text-gray-500">Retail: {formatCurrency(getRetailValue())}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All Items
            </Button>
            <Button
              variant={filterStatus === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("low")}
            >
              Low Stock
            </Button>
            <Button
              variant={filterStatus === "out" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("out")}
            >
              Out of Stock
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-palm mx-auto"></div>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No inventory items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-center">Threshold</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.stock_quantity, item.low_stock_threshold)
                  const StatusIcon = stockStatus.icon
                  const isEditing = editingItem === item.id
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.brand?.name || 'No brand'} • {item.category?.name || 'Uncategorised'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editQuantity[item.id] || item.stock_quantity}
                            onChange={(e) => setEditQuantity({
                              ...editQuantity,
                              [item.id]: e.target.value
                            })}
                            className="w-20 px-2 py-1 border rounded text-center"
                            min="0"
                          />
                        ) : (
                          <span className="font-medium">{item.stock_quantity}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.low_stock_threshold}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <div>
                          <p className="font-medium">{formatCurrency(item.stock_quantity * item.cost)}</p>
                          <p className="text-xs text-gray-500">
                            @ {formatCurrency(item.cost)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStock(item.id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingItem(null)
                                  setEditQuantity({})
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingItem(item.id)
                                setEditQuantity({
                                  [item.id]: item.stock_quantity.toString()
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}