import { Truck, Clock, Package, MapPin, Shield, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-display text-emerald-palm">Shipping Information</h1>
          <p className="text-gray-600 mt-1">Fast, reliable delivery across South Africa</p>
        </div>
      </header>

      {/* Shipping Banner */}
      <div className="bg-emerald-palm text-white py-4 px-4">
        <div className="container mx-auto text-center">
          <p className="text-lg font-medium">
            🚚 Flat Rate Shipping: R150 via Courier Guy | FREE Shipping on Orders Over R1,000!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Shipping Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-palm" />
                Standard Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-bold text-lg">R150</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">2-3 Business Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Courier:</span>
                  <span className="font-medium">Courier Guy</span>
                </div>
                <p className="text-sm text-gray-500 pt-2">
                  Reliable door-to-door delivery service across South Africa
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-royal-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-royal-gold">
                <Package className="h-5 w-5" />
                Free Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Minimum Order:</span>
                  <span className="font-bold text-lg">R1,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">2-3 Business Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Savings:</span>
                  <span className="font-medium text-emerald-palm">Save R150!</span>
                </div>
                <p className="text-sm text-emerald-palm font-medium pt-2">
                  Automatically applied at checkout when you reach R1,000
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-palm" />
              Delivery Timeframes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Major Cities (2-3 Business Days)</h4>
                <p className="text-sm text-gray-600">
                  Johannesburg, Cape Town, Durban, Pretoria, Port Elizabeth, Bloemfontein, East London
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Regional Areas (3-5 Business Days)</h4>
                <p className="text-sm text-gray-600">
                  Polokwane, Nelspruit, Kimberley, George, Rustenburg, Pietermaritzburg
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Remote Areas (5-7 Business Days)</h4>
                <p className="text-sm text-gray-600">
                  Rural areas may experience slightly longer delivery times
                </p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Orders placed after 2:00 PM will be processed the next business day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Areas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-palm" />
              Coverage Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Gauteng</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Johannesburg</li>
                  <li>• Pretoria</li>
                  <li>• Sandton</li>
                  <li>• Midrand</li>
                  <li>• Centurion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Western Cape</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Cape Town</li>
                  <li>• Stellenbosch</li>
                  <li>• Paarl</li>
                  <li>• George</li>
                  <li>• Somerset West</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">KwaZulu-Natal</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Durban</li>
                  <li>• Pietermaritzburg</li>
                  <li>• Richards Bay</li>
                  <li>• Newcastle</li>
                  <li>• Ballito</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We deliver nationwide! Contact us for delivery to areas not listed above.
            </p>
          </CardContent>
        </Card>

        {/* Shipping Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-palm" />
              Shipping Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Order Processing</h4>
                <p className="text-gray-600">
                  Orders are processed within 24 hours on business days. You'll receive a tracking number via email once your order ships.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Signature on Delivery</h4>
                <p className="text-gray-600">
                  All orders require a signature upon delivery. Please ensure someone is available to receive the package.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Insurance</h4>
                <p className="text-gray-600">
                  All shipments are fully insured against loss or damage during transit.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tracking</h4>
                <p className="text-gray-600">
                  Track your order in real-time using the Courier Guy tracking system. Tracking details will be sent to your email.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Delivery Attempts</h4>
                <p className="text-gray-600">
                  Courier Guy will make 2 delivery attempts. After the second failed attempt, the package will be returned to us.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="mt-8 bg-emerald-palm/10 rounded-lg p-6 text-center">
          <Info className="h-8 w-8 text-emerald-palm mx-auto mb-3" />
          <h3 className="font-display text-lg text-emerald-palm mb-2">
            Questions about shipping?
          </h3>
          <p className="text-gray-600 mb-4">
            Our customer service team is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="tel:+27824801311" className="text-emerald-palm font-medium">
              📞 +27 82 480 1311
            </a>
            <span className="hidden sm:block text-gray-400">|</span>
            <a href="mailto:info@perfumeoasis.co.za" className="text-emerald-palm font-medium">
              ✉️ info@perfumeoasis.co.za
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}