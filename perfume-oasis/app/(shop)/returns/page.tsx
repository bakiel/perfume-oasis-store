import { RefreshCw, Package, Clock, CheckCircle, XCircle, AlertCircle, Mail, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-display text-emerald-palm">Returns & Exchanges</h1>
          <p className="text-gray-600 mt-1">We want you to love your purchase</p>
        </div>
      </header>

      {/* 14-Day Return Promise */}
      <div className="bg-emerald-palm text-white py-6 px-4">
        <div className="container mx-auto text-center">
          <RefreshCw className="h-8 w-8 mx-auto mb-2" />
          <h2 className="text-xl font-display mb-2">14-Day Return Promise</h2>
          <p className="text-sm opacity-90">
            Not satisfied? Return unopened products within 14 days for a full refund
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Return Eligibility */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-palm" />
              Eligible for Return
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-gray-600">Products that qualify for return:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Unopened and unused products in original packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Products with original cellophane wrap intact</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Items returned within 14 days of delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Products with proof of purchase (order number or receipt)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Defective or damaged products (reported within 48 hours)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Non-Returnable Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Non-Returnable Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-gray-600">The following items cannot be returned:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Opened or used products</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Products without original packaging or missing accessories</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Special order items (custom requests)</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Sale items (unless defective)</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Gift sets if any item in the set has been used</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-palm" />
              How to Return
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-emerald-palm font-bold">1</span>
                </div>
                <h4 className="font-medium mb-1">Contact Us</h4>
                <p className="text-gray-600 text-xs">Email us with your order number and reason for return</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-emerald-palm font-bold">2</span>
                </div>
                <h4 className="font-medium mb-1">Get RMA Number</h4>
                <p className="text-gray-600 text-xs">We'll provide a Return Merchandise Authorization number</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-emerald-palm font-bold">3</span>
                </div>
                <h4 className="font-medium mb-1">Ship Item Back</h4>
                <p className="text-gray-600 text-xs">Pack securely and ship to our return address</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-emerald-palm font-bold">4</span>
                </div>
                <h4 className="font-medium mb-1">Receive Refund</h4>
                <p className="text-gray-600 text-xs">Refund processed within 7-10 business days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-palm" />
              Refund Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <ul className="space-y-2">
              <li>• Refunds are issued to the original payment method</li>
              <li>• Processing time: 7-10 business days after receipt of return</li>
              <li>• Original shipping costs are non-refundable</li>
              <li>• Return shipping costs are the customer's responsibility</li>
              <li>• For defective items, we cover return shipping costs</li>
            </ul>
          </CardContent>
        </Card>

        {/* Exchanges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-emerald-palm" />
              Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              We offer exchanges for the same product in a different size only. For different products, please return your item for a refund and place a new order. Exchange shipping costs apply unless the item is defective.
            </p>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-amber-800">
                <strong>Damaged During Shipping:</strong> If your order arrives damaged, please contact us within 48 hours with photos of the damage. We will arrange for a replacement or full refund at no cost to you.
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800">
                <strong>Wrong Item Received:</strong> If you receive an incorrect item, contact us immediately. We will arrange for the correct item to be sent and cover all shipping costs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-palm" />
              Return Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Return window opens</span>
              <span className="font-medium">Day of delivery</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Return window closes</span>
              <span className="font-medium">14 days after delivery</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Return shipment deadline</span>
              <span className="font-medium">7 days after RMA issued</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Refund processing</span>
              <span className="font-medium">7-10 business days</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="bg-emerald-palm/10 rounded-lg p-6 text-center">
          <Mail className="h-8 w-8 text-emerald-palm mx-auto mb-3" />
          <h3 className="font-display text-lg text-emerald-palm mb-2">
            Need to Return Something?
          </h3>
          <p className="text-gray-600 mb-4">
            Contact our customer service team to start your return
          </p>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Returns Department</p>
            <p>Email: givenmoja12@gmail.com</p>
            <p>Phone: +27 82 480 1311</p>
            <p className="text-xs text-gray-500 mt-3">
              Please include your order number in all correspondence
            </p>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg text-left">
            <p className="font-medium text-sm mb-1">Return Address:</p>
            <p className="text-sm text-gray-600">
              Torrencial (Pty) Ltd<br />
              Perfume Oasis Returns<br />
              Moloto Street No 30<br />
              Bela Bela, Limpopo<br />
              South Africa, 0480
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}