"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Upload, 
  X,
  Plus,
  Save,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

interface FormData {
  name: string
  sku: string
  brand_id: string
  category_id: string
  description: string
  short_description: string
  concentration: string
  size: string
  gender: string
  top_notes: string[]
  middle_notes: string[]
  base_notes: string[]
  price: string
  compare_at_price: string
  cost: string
  stock_quantity: string
  track_inventory: boolean
  allow_backorder: boolean
  low_stock_threshold: string
  main_image_url: string
  meta_title: string
  meta_description: string
  is_active: boolean
  is_featured: boolean
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [brands, setBrands] = useState<{id: string, name: string}[]>([])
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    sku: "",
    brand_id: "",
    category_id: "",
    description: "",
    short_description: "",
    concentration: "",
    size: "",
    gender: "Unisex",
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    price: "",
    compare_at_price: "",
    cost: "",
    stock_quantity: "0",
    track_inventory: true,
    allow_backorder: false,
    low_stock_threshold: "5",
    main_image_url: "",
    meta_title: "",
    meta_description: "",
    is_active: true,
    is_featured: false
  })

  // Note input states
  const [topNote, setTopNote] = useState("")
  const [middleNote, setMiddleNote] = useState("")
  const [baseNote, setBaseNote] = useState("")

  useEffect(() => {
    loadProduct()
    loadBrandsAndCategories()
  }, [params.id])

  const loadProduct = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      toast.error('Product not found')
      router.push('/admin/products')
      return
    }

    setFormData({
      name: data.name || "",
      sku: data.sku || "",
      brand_id: data.brand_id || "",
      category_id: data.category_id || "",
      description: data.description || "",
      short_description: data.short_description || "",
      concentration: data.concentration || "",
      size: data.size || "",
      gender: data.gender || "Unisex",
      top_notes: data.top_notes || [],
      middle_notes: data.middle_notes || [],
      base_notes: data.base_notes || [],
      price: data.price?.toString() || "",
      compare_at_price: data.compare_at_price?.toString() || "",
      cost: data.cost?.toString() || "",
      stock_quantity: data.stock_quantity?.toString() || "0",
      track_inventory: data.track_inventory ?? true,
      allow_backorder: data.allow_backorder ?? false,
      low_stock_threshold: data.low_stock_threshold?.toString() || "5",
      main_image_url: data.main_image_url || "",
      meta_title: data.meta_title || "",
      meta_description: data.meta_description || "",
      is_active: data.is_active ?? true,
      is_featured: data.is_featured ?? false
    })
    
    setLoading(false)
  }

  const loadBrandsAndCategories = async () => {
    const supabase = createClient()
    
    const [brandsResult, categoriesResult] = await Promise.all([
      supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
      supabase.from('categories').select('id, name').eq('is_active', true).order('name')
    ])

    if (brandsResult.data) setBrands(brandsResult.data)
    if (categoriesResult.data) setCategories(categoriesResult.data)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.sku || !formData.price) {
      toast.error('Please fill in required fields')
      return
    }

    setSaving(true)
    const supabase = createClient()

    const productData = {
      ...formData,
      slug: generateSlug(formData.name),
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      stock_quantity: parseInt(formData.stock_quantity),
      low_stock_threshold: parseInt(formData.low_stock_threshold),
      brand_id: formData.brand_id || null,
      category_id: formData.category_id || null
    }

    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', params.id)

    if (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
      setSaving(false)
      return
    }

    toast.success('Product updated successfully')
    router.push('/admin/products')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)

    if (error) {
      toast.error('Failed to delete product')
    } else {
      toast.success('Product deleted successfully')
      router.push('/admin/products')
    }
  }

  const addNote = (type: 'top' | 'middle' | 'base') => {
    const noteValue = type === 'top' ? topNote : type === 'middle' ? middleNote : baseNote
    if (!noteValue.trim()) return

    const noteKey = `${type}_notes` as keyof FormData
    const currentNotes = formData[noteKey] as string[]
    
    setFormData({
      ...formData,
      [noteKey]: [...currentNotes, noteValue.trim()]
    })

    // Clear input
    if (type === 'top') setTopNote("")
    else if (type === 'middle') setMiddleNote("")
    else setBaseNote("")
  }

  const removeNote = (type: 'top' | 'middle' | 'base', index: number) => {
    const noteKey = `${type}_notes` as keyof FormData
    const currentNotes = formData[noteKey] as string[]
    
    setFormData({
      ...formData,
      [noteKey]: currentNotes.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-palm mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
              Edit Product
            </h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Product
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              >
                <option value="">Select a brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData({...formData, short_description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              placeholder="Brief product description"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Full Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              placeholder="Detailed product description"
            />
          </div>
        </div>

        {/* Fragrance Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Fragrance Details</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Concentration</label>
              <select
                value={formData.concentration}
                onChange={(e) => setFormData({...formData, concentration: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              >
                <option value="">Select concentration</option>
                <option value="Parfum">Parfum</option>
                <option value="EDP">Eau de Parfum (EDP)</option>
                <option value="EDT">Eau de Toilette (EDT)</option>
                <option value="EDC">Eau de Cologne (EDC)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                placeholder="e.g., 100ml"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          {/* Fragrance Notes */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Top Notes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topNote}
                  onChange={(e) => setTopNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNote('top'))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                  placeholder="Add a top note"
                />
                <Button type="button" onClick={() => addNote('top')} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.top_notes.map((note, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-palm/10 text-emerald-palm rounded-full text-sm">
                    {note}
                    <button type="button" onClick={() => removeNote('top', index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Middle Notes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={middleNote}
                  onChange={(e) => setMiddleNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNote('middle'))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                  placeholder="Add a middle note"
                />
                <Button type="button" onClick={() => addNote('middle')} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.middle_notes.map((note, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-royal-gold/10 text-royal-gold rounded-full text-sm">
                    {note}
                    <button type="button" onClick={() => removeNote('middle', index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Base Notes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={baseNote}
                  onChange={(e) => setBaseNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNote('base'))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                  placeholder="Add a base note"
                />
                <Button type="button" onClick={() => addNote('base')} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.base_notes.map((note, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {note}
                    <button type="button" onClick={() => removeNote('base', index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (ZAR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Compare at Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.compare_at_price}
                onChange={(e) => setFormData({...formData, compare_at_price: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                placeholder="Original price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cost</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                placeholder="Your cost"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
              <input
                type="number"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({...formData, low_stock_threshold: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.track_inventory}
                onChange={(e) => setFormData({...formData, track_inventory: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">Track inventory for this product</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allow_backorder}
                onChange={(e) => setFormData({...formData, allow_backorder: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">Allow customers to purchase when out of stock</span>
            </label>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Product Image</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Main Image URL</label>
            <input
              type="url"
              value={formData.main_image_url}
              onChange={(e) => setFormData({...formData, main_image_url: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              placeholder="https://example.com/image.jpg"
            />
            {formData.main_image_url && (
              <div className="mt-4">
                <img 
                  src={formData.main_image_url} 
                  alt="Product preview" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">SEO</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                placeholder="Leave empty to use product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                placeholder="Leave empty to use product description"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">Product is active (visible to customers)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">Feature this product</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}