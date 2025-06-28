"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, Mail, Package, CreditCard, Download } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "react-hot-toast"

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string }
}) {
  // For now, we'll use the orderId to create display data
  // In production, this would fetch from the database
  const orderData = {
    orderNumber: params.orderId.startsWith('temp_') 
      ? `PO${Date.now()}` 
      : params.orderId,
    email: "customer@example.com",
    total: 1250.00,
    items: 3,
    estimatedDelivery: "2-3 business days",
  }

  const downloadInvoice = async () => {
    try {
      const response = await fetch(`/api/orders/invoice?orderId=${params.orderId}`)
      if (!response.ok) throw new Error('Failed to download invoice')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${orderData.orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Success Banner */}
      <div className="bg-emerald-palm text-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-display mb-2">
            Order Confirmed!
          </h1>
          <p className="text-white/90">
            Thank you for your purchase
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-bold text-emerald-palm">
              #{orderData.orderNumber}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-emerald-palm mt-0.5" />
              <div>
                <p className="font-medium">Confirmation Email Sent</p>
                <p className="text-sm text-gray-600">
                  We've sent your order details and invoice PDF to {orderData.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Package className="h-5 w-5 text-emerald-palm mt-0.5" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-sm text-gray-600">
                  {orderData.estimatedDelivery}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CreditCard className="h-5 w-5 text-emerald-palm mt-0.5" />
              <div>
                <p className="font-medium">Payment Instructions</p>
                <p className="text-sm text-gray-600">
                  Bank transfer details have been emailed to you
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-display text-emerald-palm mb-4">
            What Happens Next?
          </h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-palm/10 text-emerald-palm rounded-full flex items-center justify-center font-medium">
                1
              </span>
              <div>
                <p className="font-medium">Make Payment</p>
                <p className="text-gray-600">
                  Complete the bank transfer using the details in your email
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-palm/10 text-emerald-palm rounded-full flex items-center justify-center font-medium">
                2
              </span>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-gray-600">
                  We'll process your order once payment is confirmed
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-palm/10 text-emerald-palm rounded-full flex items-center justify-center font-medium">
                3
              </span>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-gray-600">
                  Your fragrances will be delivered within 2-3 business days
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Bank Details Card */}
        <div className="bg-[#0E5C4A] text-white rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5" />
            <h3 className="font-display text-lg">Bank Transfer Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/80">Bank:</span>
              <span className="font-medium">First National Bank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Account Name:</span>
              <span className="font-medium">Perfume Oasis (Pty) Ltd</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Account Number:</span>
              <span className="font-medium">62891234567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Branch Code:</span>
              <span className="font-medium">250655</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Reference:</span>
              <span className="font-medium">#{orderData.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Amount:</span>
              <span className="font-medium text-lg">{formatCurrency(orderData.total)}</span>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-4">
            Please use your order number as the payment reference
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={downloadInvoice}
            className="w-full bg-emerald-palm hover:bg-emerald-palm/90" 
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Invoice
          </Button>
          <Link href="/account/orders" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              View Order Details
            </Button>
          </Link>
          <Link href="/products" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Need help? Contact us at</p>
          <a href="tel:+27111234567" className="text-emerald-palm font-medium">
            +27 11 123 4567
          </a>
          <span className="mx-2">·</span>
          <a href="mailto:orders@perfumeoasis.co.za" className="text-emerald-palm font-medium">
            orders@perfumeoasis.co.za
          </a>
        </div>
      </div>
    </div>
  )
}