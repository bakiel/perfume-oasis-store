'use client'

import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { toast } from "react-hot-toast"

interface OrderActionsProps {
  orderId: string
  orderNumber: string
  invoiceNumber?: string
}

export function OrderActions({ orderId, orderNumber, invoiceNumber }: OrderActionsProps) {
  const downloadInvoice = async () => {
    try {
      // Use the new invoice download endpoint
      const downloadUrl = `/api/invoices/download?orderId=${orderId}&invoiceNumber=${invoiceNumber || orderNumber}`
      
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Failed to download invoice')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-${invoiceNumber || orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      console.error('Invoice download error:', error)
      toast.error('Failed to download invoice')
    }
  }

  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button 
        onClick={downloadInvoice}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Download Invoice
      </Button>
    </div>
  )
}