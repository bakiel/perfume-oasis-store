'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

interface Promotion {
  id: string
  name: string
  description: string | null
  type: 'percentage' | 'fixed_amount' | 'bogo' | 'free_shipping'
  value: number
  minimum_purchase: number
  code: string | null
  auto_apply: boolean
  is_active: boolean
  start_date: string
  end_date: string | null
  usage_limit: number | null
  usage_count: number
  product_ids: string[]
  category_ids: string[]
  display_on_homepage: boolean
  priority: number
  created_at: string
  updated_at: string
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed_amount' | 'bogo' | 'free_shipping',
    value: '',
    minimum_purchase: '0',
    code: '',
    auto_apply: false,
    is_active: true,
    display_on_homepage: true,
    priority: '0',
    usage_limit: '',
    start_date: '',
    end_date: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load promotions')
    } else {
      setPromotions(data || [])
    }
    setLoading(false)
  }

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setFormData({
      name: promotion.name,
      description: promotion.description || '',
      type: promotion.type,
      value: promotion.value.toString(),
      minimum_purchase: promotion.minimum_purchase.toString(),
      code: promotion.code || '',
      auto_apply: promotion.auto_apply,
      is_active: promotion.is_active,
      display_on_homepage: promotion.display_on_homepage,
      priority: promotion.priority.toString(),
      usage_limit: promotion.usage_limit?.toString() || '',
      start_date: promotion.start_date ? new Date(promotion.start_date).toISOString().split('T')[0] : '',
      end_date: promotion.end_date ? new Date(promotion.end_date).toISOString().split('T')[0] : ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const promotionData = {
      name: formData.name,
      description: formData.description || null,
      type: formData.type,
      value: parseFloat(formData.value),
      minimum_purchase: parseFloat(formData.minimum_purchase),
      code: formData.code || null,
      auto_apply: formData.auto_apply,
      is_active: formData.is_active,
      display_on_homepage: formData.display_on_homepage,
      priority: parseInt(formData.priority),
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null
    }

    if (editingPromotion) {
      const { error } = await supabase
        .from('promotions')
        .update(promotionData)
        .eq('id', editingPromotion.id)

      if (error) {
        toast.error('Failed to update promotion')
      } else {
        toast.success('Promotion updated successfully')
        fetchPromotions()
        setIsDialogOpen(false)
        resetForm()
      }
    } else {
      const { error } = await supabase
        .from('promotions')
        .insert(promotionData)

      if (error) {
        toast.error('Failed to create promotion')
      } else {
        toast.success('Promotion created successfully')
        fetchPromotions()
        setIsDialogOpen(false)
        resetForm()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error('Failed to delete promotion')
      } else {
        toast.success('Promotion deleted successfully')
        fetchPromotions()
      }
    }
  }

  const resetForm = () => {
    setEditingPromotion(null)
    setFormData({
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minimum_purchase: '0',
      code: '',
      auto_apply: false,
      is_active: true,
      display_on_homepage: true,
      priority: '0',
      usage_limit: '',
      start_date: '',
      end_date: ''
    })
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Promotions</h1>
        <Button 
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
        >
          Add Promotion
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type & Value</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Homepage</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.priority}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{promotion.name}</p>
                    {promotion.description && (
                      <p className="text-sm text-gray-500">{promotion.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {promotion.type === 'percentage' && `${promotion.value}% off`}
                      {promotion.type === 'fixed_amount' && `R${promotion.value} off`}
                      {promotion.type === 'bogo' && 'Buy One Get One'}
                      {promotion.type === 'free_shipping' && 'Free Shipping'}
                    </p>
                    {promotion.minimum_purchase > 0 && (
                      <p className="text-sm text-gray-500">Min: R{promotion.minimum_purchase}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {promotion.code ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {promotion.code}
                    </code>
                  ) : (
                    <span className="text-gray-500">Auto-apply</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    promotion.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promotion.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  {promotion.display_on_homepage ? 'Yes' : 'No'}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{promotion.start_date && format(new Date(promotion.start_date), 'MMM dd')}</p>
                    {promotion.end_date && (
                      <p className="text-gray-500">to {format(new Date(promotion.end_date), 'MMM dd')}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{promotion.usage_count} used</p>
                    {promotion.usage_limit && (
                      <p className="text-gray-500">of {promotion.usage_limit}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(promotion)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? 'Edit Promotion' : 'Create Promotion'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label htmlFor="name">Promotion Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Summer Sale 2024"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the promotion"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Promotion Type</Label>
                <select
                  id="type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed_amount">Fixed Amount Off</option>
                  <option value="bogo">Buy One Get One</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="value">
                  {formData.type === 'percentage' ? 'Percentage (%)' : 
                   formData.type === 'fixed_amount' ? 'Amount (R)' : 'Value'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step={formData.type === 'percentage' ? "1" : "0.01"}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="minimum_purchase">Minimum Purchase (R)</Label>
                <Input
                  id="minimum_purchase"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimum_purchase}
                  onChange={(e) => setFormData({ ...formData, minimum_purchase: e.target.value })}
                  placeholder="0 for no minimum"
                />
              </div>
              
              <div>
                <Label htmlFor="code">Promo Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Leave empty for auto-apply"
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  placeholder="Higher number = higher priority"
                />
              </div>
              
              <div>
                <Label htmlFor="usage_limit">Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  min="0"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  placeholder="Leave empty for no end date"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto_apply"
                  checked={formData.auto_apply}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, auto_apply: checked as boolean })
                  }
                />
                <Label htmlFor="auto_apply">Auto Apply (no code needed)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_active: checked as boolean })
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="display_on_homepage"
                  checked={formData.display_on_homepage}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, display_on_homepage: checked as boolean })
                  }
                />
                <Label htmlFor="display_on_homepage">Display on Homepage</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPromotion ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}