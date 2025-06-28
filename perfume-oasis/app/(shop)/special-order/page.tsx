"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  Send,
  ArrowLeft,
  Info,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function SpecialOrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fragranceName: "",
    brand: "",
    size: "",
    quantity: "1",
    notes: "",
    budget: ""
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success("Your special order request has been submitted!")
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-soft-sand flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-emerald-palm mx-auto mb-4" />
            <h2 className="text-2xl font-display text-emerald-palm mb-2">
              Request Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              We'll contact you within 24-48 hours about your special order.
            </p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display text-emerald-palm">Special Order Request</h1>
              <p className="text-gray-600 text-sm">Can't find what you're looking for? Let us help!</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-palm" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-palm/10 text-emerald-palm rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <p>Submit your fragrance request with as much detail as possible</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-palm/10 text-emerald-palm rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <p>We'll search our suppliers and international sources</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-palm/10 text-emerald-palm rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <p>Receive a quote within 24-48 hours</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-palm/10 text-emerald-palm rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <p>Approve the order and we'll handle the rest</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-emerald-palm" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Special orders typically take 2-4 weeks for delivery</p>
                <p>• Minimum order value: R500</p>
                <p>• All fragrances are 100% authentic</p>
                <p>• Special orders are non-refundable</p>
                <p>• We can source discontinued fragrances (subject to availability)</p>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll do our best to find your desired fragrance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                        placeholder="+27 82 123 4567"
                      />
                    </div>
                  </div>

                  {/* Fragrance Details */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Fragrance Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="fragranceName">Fragrance Name *</Label>
                      <Input
                        id="fragranceName"
                        value={formData.fragranceName}
                        onChange={(e) => handleChange("fragranceName", e.target.value)}
                        required
                        placeholder="e.g., Baccarat Rouge 540"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand *</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => handleChange("brand", e.target.value)}
                          required
                          placeholder="e.g., Maison Francis Kurkdjian"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Size Preference</Label>
                        <Select value={formData.size} onValueChange={(value) => handleChange("size", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30ml">30ml</SelectItem>
                            <SelectItem value="50ml">50ml</SelectItem>
                            <SelectItem value="75ml">75ml</SelectItem>
                            <SelectItem value="100ml">100ml</SelectItem>
                            <SelectItem value="125ml">125ml</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Select value={formData.quantity} onValueChange={(value) => handleChange("quantity", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="more">More than 5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={formData.budget} onValueChange={(value) => handleChange("budget", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="500-1000">R500 - R1,000</SelectItem>
                            <SelectItem value="1000-2000">R1,000 - R2,000</SelectItem>
                            <SelectItem value="2000-3000">R2,000 - R3,000</SelectItem>
                            <SelectItem value="3000+">R3,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Any specific requests, concentration preferences, or additional information..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Special Order Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}