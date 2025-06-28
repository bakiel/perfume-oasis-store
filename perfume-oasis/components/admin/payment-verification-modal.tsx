"use client"

import { useState } from "react"
import { X, Calendar, DollarSign, Building2, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

interface PaymentVerificationModalProps {
  orderId: string
  orderTotal: number
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentVerificationModal({
  orderId,
  orderTotal,
  onClose,
  onSuccess
}: PaymentVerificationModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reference_number: "",
    amount: orderTotal.toString(),
    payment_date: new Date().toISOString().split('T')[0],
    bank_name: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.reference_number || !formData.amount || !formData.payment_date) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Create payment confirmation record
    const { error: confirmError } = await supabase
      .from('payment_confirmations')
      .insert([{
        order_id: orderId,
        reference_number: formData.reference_number,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        bank_name: formData.bank_name,
        notes: formData.notes,
        confirmed_at: new Date().toISOString()
      }])

    if (confirmError) {
      toast.error('Failed to save payment confirmation')
      setLoading(false)
      return
    }

    // Update order payment status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_reference: formData.reference_number,
        paid_at: new Date().toISOString(),
        status: 'processing' // Move to processing after payment
      })
      .eq('id', orderId)

    if (orderError) {
      toast.error('Failed to update order status')
      setLoading(false)
      return
    }

    toast.success('Payment verified successfully')
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Verify Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Reference Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.reference_number}
                onChange={(e) => setFormData({...formData, reference_number: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                placeholder="Enter bank reference number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Amount Received (ZAR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                required
              />
            </div>
            {parseFloat(formData.amount) !== orderTotal && (
              <p className="text-sm text-amber-600 mt-1">
                Amount differs from order total ({formatCurrency(orderTotal)})
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={formData.bank_name}
                onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              >
                <option value="">Select bank</option>
                <option value="FNB">FNB</option>
                <option value="Standard Bank">Standard Bank</option>
                <option value="ABSA">ABSA</option>
                <option value="Nedbank">Nedbank</option>
                <option value="Capitec">Capitec</option>
                <option value="Discovery Bank">Discovery Bank</option>
                <option value="TymeBank">TymeBank</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              placeholder="Any additional notes about this payment"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              Upload proof of payment (optional)
            </p>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Verify Payment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}