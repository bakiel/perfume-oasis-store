"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  CreditCard, 
  Building2, 
  FileText, 
  Mail, 
  Clock, 
  CheckCircle,
  Copy,
  ExternalLink,
  Package,
  MessageSquare,
  Phone,
  ChevronRight,
  AlertCircle,
  Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function PaymentGuidePage() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const bankDetails = {
    bank: "Nedbank",
    accountName: "Torrencial",
    accountNumber: "1313614866",
    branchCode: "198765",
    accountType: "Business Cheque Account"
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied to clipboard!`)
    setTimeout(() => setCopiedField(null), 3000)
  }

  const steps = [
    {
      number: "1",
      title: "Make Payment",
      description: "Transfer the exact amount to our bank account",
      icon: Building2,
      color: "bg-blue-100 text-blue-600"
    },
    {
      number: "2",
      title: "Send Proof",
      description: "Email your proof of payment with order number",
      icon: Mail,
      color: "bg-purple-100 text-purple-600"
    },
    {
      number: "3",
      title: "Verification",
      description: "We verify your payment within 24 hours",
      icon: Clock,
      color: "bg-amber-100 text-amber-600"
    },
    {
      number: "4",
      title: "Order Processing",
      description: "Your order is prepared and shipped",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    }
  ]

  return (
    <div className="min-h-screen bg-[#F6F3EF]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0E5C4A] to-[#0A4A3B] text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <CreditCard className="h-8 w-8" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-display mb-4">
              EFT Payment Guide
            </h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
              Complete your order with a simple bank transfer. 
              Safe, secure, and no transaction fees.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/track-order">
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <a href="mailto:orders@perfumeoasis.co.za">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </a>
            <a href="tel:+27824801311">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Us
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* Banking Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#0E5C4A] to-[#0A4A3B] p-6 text-white">
            <h2 className="text-2xl font-display flex items-center gap-3">
              <Building2 className="h-6 w-6" />
              Banking Details
            </h2>
            <p className="mt-2 text-white/90">
              Use these details to make your payment
            </p>
          </div>
          
          <div className="p-6 lg:p-8">
            <div className="grid gap-4">
              {/* Bank Name */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Bank</p>
                  <p className="text-lg font-semibold">{bankDetails.bank}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.bank, "Bank name")}
                  className="text-[#0E5C4A]"
                >
                  {copiedField === "Bank name" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Account Name */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="text-lg font-semibold">{bankDetails.accountName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.accountName, "Account name")}
                  className="text-[#0E5C4A]"
                >
                  {copiedField === "Account name" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="text-lg font-semibold font-mono">{bankDetails.accountNumber}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.accountNumber, "Account number")}
                  className="text-[#0E5C4A]"
                >
                  {copiedField === "Account number" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Branch Code */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Branch Code</p>
                  <p className="text-lg font-semibold font-mono">{bankDetails.branchCode}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.branchCode, "Branch code")}
                  className="text-[#0E5C4A]"
                >
                  {copiedField === "Branch code" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Account Type */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-lg font-semibold">{bankDetails.accountType}</p>
              </div>
            </div>

            {/* Important Reference Note */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Important: Payment Reference</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Always use your <span className="font-semibold">Order Number</span> as the payment reference. 
                    This helps us identify your payment quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Process Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-display text-[#0E5C4A] mb-6">
            How to Complete Your Payment
          </h2>
          
          <div className="grid gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-4">
                <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Step {step.number}: {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {/* Step-specific content */}
                  {step.number === "1" && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        • Use internet banking, mobile app, or visit a branch<br />
                        • Transfer the exact amount shown on your invoice<br />
                        • Use your order number as the reference
                      </p>
                    </div>
                  )}
                  
                  {step.number === "2" && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-3">
                        Send your proof of payment to:
                      </p>
                      <a 
                        href="mailto:orders@perfumeoasis.co.za"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        orders@perfumeoasis.co.za
                      </a>
                      <p className="text-sm text-gray-600 mt-3">
                        Include: • Screenshot of payment • Your order number • Your name
                      </p>
                    </div>
                  )}
                  
                  {step.number === "3" && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600">
                        • We check payments every few hours during business days<br />
                        • You'll receive confirmation via email and SMS<br />
                        • Track your order status anytime
                      </p>
                      <Link href="/track-order">
                        <Button variant="outline" size="sm">
                          Track Your Order
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {step.number === "4" && (
                    <div className="mt-3 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        • Order packed with care<br />
                        • Shipped via trusted courier<br />
                        • Tracking number provided<br />
                        • Delivery in 3-7 working days
                      </p>
                    </div>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block w-px bg-gray-200 ml-6 my-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-display text-[#0E5C4A] mb-6">
            Quick Links & Support
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/track-order" className="group">
              <div className="p-4 border rounded-lg hover:border-[#0E5C4A] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-[#0E5C4A]" />
                    <div>
                      <p className="font-semibold">Track Your Order</p>
                      <p className="text-sm text-gray-600">Check order status</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0E5C4A]" />
                </div>
              </div>
            </Link>

            <Link href="/account/orders" className="group">
              <div className="p-4 border rounded-lg hover:border-[#0E5C4A] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#0E5C4A]" />
                    <div>
                      <p className="font-semibold">Order History</p>
                      <p className="text-sm text-gray-600">View all orders</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0E5C4A]" />
                </div>
              </div>
            </Link>

            <a href="https://wa.me/27824801311" target="_blank" rel="noopener noreferrer" className="group">
              <div className="p-4 border rounded-lg hover:border-[#0E5C4A] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-[#0E5C4A]" />
                    <div>
                      <p className="font-semibold">WhatsApp Support</p>
                      <p className="text-sm text-gray-600">Chat with us</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#0E5C4A]" />
                </div>
              </div>
            </a>

            <a href="tel:+27824801311" className="group">
              <div className="p-4 border rounded-lg hover:border-[#0E5C4A] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#0E5C4A]" />
                    <div>
                      <p className="font-semibold">Call Us</p>
                      <p className="text-sm text-gray-600">+27 82 480 1311</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0E5C4A]" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-display text-[#0E5C4A] mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">How long does payment verification take?</h3>
              <p className="text-gray-600">
                We verify payments within 24 hours during business days. Most payments are verified within a few hours.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">What proof of payment should I send?</h3>
              <p className="text-gray-600">
                A screenshot from your banking app or internet banking showing the payment details, amount, and reference number.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Can I pay with credit card or PayPal?</h3>
              <p className="text-gray-600">
                Currently, we only accept EFT payments. This helps us keep prices low by avoiding transaction fees.
              </p>
            </div>
            
            <div className="pb-4">
              <h3 className="font-semibold mb-2">What if I forgot to use my order number as reference?</h3>
              <p className="text-gray-600">
                No problem! Just include your order number in the email when you send proof of payment, and we'll match it to your order.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Banking Apps */}
        <div className="bg-gradient-to-r from-[#0E5C4A] to-[#0A4A3B] rounded-2xl p-6 lg:p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-display mb-2">Banking Apps</h3>
              <p className="text-white/90 mb-4">
                Make payments easily using your bank's mobile app:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['FNB', 'Standard Bank', 'ABSA', 'Nedbank', 'Capitec', 'Discovery', 'TymeBank'].map((bank) => (
                  <div key={bank} className="bg-white/10 rounded-lg px-3 py-2 text-sm text-center">
                    {bank}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Link href="/account/orders">
            <Button size="lg" className="bg-[#0E5C4A] hover:bg-[#0A4A3B]">
              View My Orders
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}