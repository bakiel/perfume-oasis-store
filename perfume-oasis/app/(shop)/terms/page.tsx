import { FileText, ShoppingBag, Truck, RefreshCw, AlertTriangle, Scale, Globe, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-display text-emerald-palm">Terms of Service</h1>
          <p className="text-gray-600 mt-1">Effective Date: June 2025</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-palm" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-gray-600">
            <p>
              These Terms of Service ("Terms") govern your use of the Perfume Oasis website and services operated by Torrencial (Pty) Ltd (Company Registration: 2025/213013/07). By accessing or using our website, you agree to be bound by these Terms.
            </p>
            <p className="mt-2">
              If you do not agree to these Terms, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Products and Orders */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-palm" />
              Products and Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium mb-2">Product Information</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>All products are 100% authentic and sourced from authorized distributors</li>
                <li>Product images are for illustration purposes and may vary slightly</li>
                <li>We reserve the right to limit quantities purchased per customer</li>
                <li>Prices are in South African Rand (ZAR) and include VAT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Order Acceptance</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Order confirmation does not constitute acceptance</li>
                <li>We reserve the right to refuse or cancel orders</li>
                <li>Payment must be received before order processing</li>
                <li>You must be 18 years or older to place an order</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-emerald-palm" />
              Shipping and Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <ul className="list-disc list-inside space-y-1">
              <li>Shipping fee: R150 flat rate via Courier Guy</li>
              <li>Free shipping on orders over R1,000</li>
              <li>Delivery times: 2-3 business days for major cities, 3-7 days for remote areas</li>
              <li>Signature required upon delivery</li>
              <li>Risk of loss passes to you upon delivery</li>
              <li>We are not responsible for delays caused by courier services</li>
            </ul>
          </CardContent>
        </Card>

        {/* Returns and Refunds */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-emerald-palm" />
              Returns and Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>We want you to be completely satisfied with your purchase. Our return policy:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>14-day return period from date of delivery</li>
              <li>Products must be unopened, unused, and in original packaging</li>
              <li>Customer is responsible for return shipping costs</li>
              <li>Refunds processed within 7-10 business days after receipt</li>
              <li>Special orders are non-refundable</li>
              <li>No returns on sale items unless defective</li>
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Uses */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-emerald-palm" />
              Prohibited Uses
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Use our services for any unlawful purpose</li>
              <li>Resell products purchased from us without authorization</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Submit false or misleading information</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-palm" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              To the maximum extent permitted by law, Torrencial (Pty) Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
            </p>
            <p className="mt-2">
              Our total liability shall not exceed the amount paid by you for the products purchased.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-palm" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              All content on this website, including text, graphics, logos, and images, is the property of Torrencial (Pty) Ltd or used with permission. You may not reproduce, distribute, or create derivative works without our express written consent.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of South Africa. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of South Africa.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified Terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="bg-emerald-palm/10 rounded-lg p-6 text-center">
          <Phone className="h-8 w-8 text-emerald-palm mx-auto mb-3" />
          <h3 className="font-display text-lg text-emerald-palm mb-2">
            Questions About Our Terms?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Torrencial (Pty) Ltd</strong></p>
            <p>Trading as Perfume Oasis</p>
            <p>Email: givenmoja12@gmail.com</p>
            <p>Phone: +27 82 480 1311</p>
            <p>Address: Moloto Street No 30, Bela Bela, Limpopo, 0480</p>
            <p>Company Registration: 2025/213013/07</p>
          </div>
        </div>
      </div>
    </div>
  )
}