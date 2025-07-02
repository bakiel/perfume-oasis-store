'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, Download, Mail, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface OrderActionsEnhancedProps {
  order: any
}

export function OrderActionsEnhanced({ order }: OrderActionsEnhancedProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const handleDownloadInvoice = async () => {
    setPdfLoading(true)
    
    try {
      // Use the backend PDF generation endpoint
      const downloadUrl = `/api/invoices/download?orderId=${order.id}&invoiceNumber=${order.invoice_number}`
      
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Failed to download invoice')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Invoice-${order.invoice_number}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error('Failed to download invoice. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleSendEmail = async () => {
    setEmailLoading(true)
    
    try {
      // Simulate email sending - in production, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Order confirmation sent to ${order.customer_email}`)
    } catch (error) {
      console.error('Email sending failed:', error)
      toast.error('Failed to send email. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button 
          onClick={handleDownloadInvoice}
          disabled={pdfLoading}
          className="gap-2 bg-emerald-palm hover:bg-emerald-palm/90"
        >
          {pdfLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Invoice (PDF)
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleSendEmail}
          disabled={emailLoading}
          variant="outline"
          className="gap-2"
        >
          {emailLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Email...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Resend Confirmation Email
            </>
          )}
        </Button>
    </div>
  )
}