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
  title: string
  subtitle: string | null
  description: string | null
  discount_percentage: number | null
  discount_amount: number | null
  promo_code: string | null
  banner_image_url: string | null
  link_url: string | null
  position: number
  is_active: boolean
  show_on_homepage: boolean
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    promo_code: '',
    banner_image_url: '',
    link_url: '',
    position: '0',
    is_active: true,
    show_on_homepage: true,
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
      .order('position', { ascending: true })

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
      title: promotion.title,
      subtitle: promotion.subtitle || '',
      description: promotion.description || '',
      discount_percentage: promotion.discount_percentage?.toString() || '',
      discount_amount: promotion.discount_amount?.toString() || '',
      promo_code: promotion.promo_code || '',
      banner_image_url: promotion.banner_image_url || '',
      link_url: promotion.link_url || '',
      position: promotion.position.toString(),
      is_active: promotion.is_active,
      show_on_homepage: promotion.show_on_homepage,
      start_date: promotion.start_date ? new Date(promotion.start_date).toISOString().split('T')[0] : '',
      end_date: promotion.end_date ? new Date(promotion.end_date).toISOString().split('T')[0] : ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const promotionData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      description: formData.description || null,
      discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
      discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
      promo_code: formData.promo_code || null,
      banner_image_url: formData.banner_image_url || null,
      link_url: formData.link_url || null,
      position: parseInt(formData.position),
      is_active: formData.is_active,
      show_on_homepage: formData.show_on_homepage,
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
      title: '',
      subtitle: '',
      description: '',
      discount_percentage: '',
      discount_amount: '',
      promo_code: '',
      banner_image_url: '',
      link_url: '',
      position: '0',
      is_active: true,
      show_on_homepage: true,
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
              <TableHead>Position</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Homepage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.position}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{promotion.title}</p>
                    {promotion.subtitle && (
                      <p className="text-sm text-gray-500">{promotion.subtitle}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {promotion.discount_percentage && `${promotion.discount_percentage}%`}
                  {promotion.discount_amount && `R ${promotion.discount_amount}`}
                  {promotion.promo_code && (
                    <p className="text-sm text-gray-500">{promotion.promo_code}</p>
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
                  {promotion.show_on_homepage ? 'Yes' : 'No'}
                </TableCell>
                <TableCell>
                  {promotion.start_date && format(new Date(promotion.start_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {promotion.end_date && format(new Date(promotion.end_date), 'MMM dd, yyyy')}
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="discount_percentage">Discount Percentage</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="discount_amount">Discount Amount (R)</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="promo_code">Promo Code</Label>
                <Input
                  id="promo_code"
                  value={formData.promo_code}
                  onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  min="0"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="banner_image_url">Banner Image URL</Label>
                <Input
                  id="banner_image_url"
                  value={formData.banner_image_url}
                  onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
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
                  id="show_on_homepage"
                  checked={formData.show_on_homepage}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, show_on_homepage: checked as boolean })
                  }
                />
                <Label htmlFor="show_on_homepage">Show on Homepage</Label>
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