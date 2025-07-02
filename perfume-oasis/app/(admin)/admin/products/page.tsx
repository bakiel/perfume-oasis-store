"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Filter,
  Download,
  Upload,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

interface Product {
  id: string
  sku: string
  name: string
  brand: { name: string } | null
  category: { name: string } | null
  price: number
  stock_quantity: number
  is_active: boolean
  main_image_url: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [filterStatus])

  const fetchProducts = async () => {
    const supabase = createClient()
    
    let query = supabase
      .from('products')
      .select(`
        *,
        brand:brands(name),
        category:categories(name)
      `)
      .order('created_at', { ascending: false })

    if (filterStatus !== "all") {
      query = query.eq('is_active', filterStatus === "active")
    }

    const { data, error } = await query

    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete product')
    } else {
      toast.success('Product deleted successfully')
      fetchProducts()
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProducts.length} products?`)) return

    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', selectedProducts)

    if (error) {
      toast.error('Failed to delete products')
    } else {
      toast.success('Products deleted successfully')
      setSelectedProducts([])
      fetchProducts()
    }
  }

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update product status')
    } else {
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchProducts()
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-emerald-palm">
            Products
          </h1>
          <p className="text-gray-600 mt-1">Manage your product catalogue</p>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Import</span>
            <span className="sm:hidden">Import</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Link href="/admin/products/new" className="flex-1 sm:flex-none">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className="flex-1 sm:flex-none"
            >
              All ({products.length})
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
              className="flex-1 sm:flex-none"
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("inactive")}
              className="flex-1 sm:flex-none"
            >
              Inactive
            </Button>
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="mt-4 p-3 bg-emerald-palm/10 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedProducts.length} products selected
            </span>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <span>Delete Selected</span>
            </Button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-palm mx-auto"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <Link href="/admin/products/new">
              <Button className="mt-4"><span>Add Your First Product</span></Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(filteredProducts.map(p => p.id))
                          } else {
                            setSelectedProducts([])
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="hidden sm:table-cell px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id])
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {product.main_image_url ? (
                              <Image
                                src={product.main_image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 absolute inset-0 m-auto" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-none">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand?.name || 'No brand'}</p>
                            <p className="text-xs text-gray-500 sm:hidden">{product.category?.name || 'Uncategorised'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap text-sm">
                        {product.category?.name || 'Uncategorised'}
                      </td>
                      <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm font-mono">
                        {product.sku}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock_quantity > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock_quantity > 0 
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleProductStatus(product.id, product.is_active)}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            product.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}