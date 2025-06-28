"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"
import { ChevronLeft, CreditCard, CheckCircle, MapPin, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const checkoutSchema = z.object({
  // Personal Details
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  
  // Delivery Address
  street: z.string().min(5, "Street address is required"),
  suburb: z.string().min(2, "Suburb is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string().min(4, "Postal code is required"),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { items, getTotal, clearCart } = useCartStore()
  
  // All hooks must be called before any conditional returns
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  })
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent SSR issues and show loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F6F3EF] flex items-center justify-center">
        <div className="animate-pulse text-[#0E5C4A]">Loading checkout...</div>
      </div>
    )
  }

  const total = getTotal()
  const deliveryFee = total > 500 ? 0 : 60

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleContinue = async () => {
    let fieldsToValidate: (keyof CheckoutForm)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone']
    } else if (currentStep === 2) {
      fieldsToValidate = ['street', 'suburb', 'city', 'province', 'postalCode']
    }
    
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: data,
          items,
          total: total + deliveryFee,
        }),
      })

      if (response.ok) {
        const { orderId } = await response.json()
        clearCart()
        router.push(`/order-confirmation/${orderId}`)
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, name: "Details", icon: User },
    { number: 2, name: "Delivery", icon: MapPin },
    { number: 3, name: "Review", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-[#F6F3EF]">
      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              <span>Back to cart</span>
            </Link>
            <h1 className="text-2xl font-display text-[#0E5C4A]">Secure Checkout</h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
        <div className="px-4 py-4 flex items-center gap-4">
          <Link href="/cart">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-display text-[#0E5C4A]">Checkout</h1>
          <div className="ml-auto text-sm text-gray-500">
            Step {currentStep} of 3
          </div>
        </div>
        
        {/* Mobile Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-[#0E5C4A] transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            {/* Desktop Progress Steps */}
            <div className="hidden lg:flex items-center justify-center mb-12">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    currentStep >= step.number ? 'text-[#0E5C4A]' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.number 
                        ? 'bg-[#0E5C4A] border-[#0E5C4A] text-white' 
                        : 'border-gray-300'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-[#0E5C4A]' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl lg:text-2xl font-display text-[#0E5C4A]">Your Details</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        {...register("firstName")}
                        placeholder="John"
                        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        {...register("lastName")}
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+27 12 345 6789"
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl lg:text-2xl font-display text-[#0E5C4A]">Delivery Address</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      {...register("street")}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suburb
                    </label>
                    <input
                      {...register("suburb")}
                      placeholder="Sandton"
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                    />
                    {errors.suburb && (
                      <p className="text-red-500 text-sm mt-1">{errors.suburb.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        {...register("city")}
                        placeholder="Johannesburg"
                        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        {...register("postalCode")}
                        placeholder="2000"
                        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province
                    </label>
                    <select
                      {...register("province")}
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#0E5C4A] focus:ring-2 focus:ring-[#0E5C4A]/20 focus:outline-none transition-all"
                    >
                      <option value="">Select Province</option>
                      <option value="gauteng">Gauteng</option>
                      <option value="western-cape">Western Cape</option>
                      <option value="kwazulu-natal">KwaZulu-Natal</option>
                      <option value="eastern-cape">Eastern Cape</option>
                      <option value="free-state">Free State</option>
                      <option value="limpopo">Limpopo</option>
                      <option value="mpumalanga">Mpumalanga</option>
                      <option value="north-west">North West</option>
                      <option value="northern-cape">Northern Cape</option>
                    </select>
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
                    )}
                  </div>
                  
                  <div className="bg-[#0E5C4A]/10 p-4 rounded-lg">
                    <p className="text-sm text-[#0E5C4A] font-medium">
                      🚚 Estimated Delivery: 2-3 business days
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      We deliver nationwide across South Africa
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Payment */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl lg:text-2xl font-display text-[#0E5C4A]">Review & Pay</h2>
                  
                  {/* Delivery Details Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                    <h3 className="font-medium text-gray-900 mb-3">Delivery Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Name:</span>{' '}
                        <span className="font-medium">{getValues('firstName')} {getValues('lastName')}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Email:</span>{' '}
                        <span className="font-medium">{getValues('email')}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Phone:</span>{' '}
                        <span className="font-medium">{getValues('phone')}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Address:</span>{' '}
                        <span className="font-medium">
                          {getValues('street')}, {getValues('suburb')}, {getValues('city')}, {getValues('postalCode')}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="h-6 w-6 text-[#0E5C4A]" />
                      <h3 className="font-medium text-gray-900">Payment Method</h3>
                    </div>
                    <div className="bg-[#0E5C4A]/10 p-4 rounded-lg">
                      <p className="font-medium text-[#0E5C4A] mb-2">Bank Transfer</p>
                      <p className="text-sm text-gray-700">
                        After placing your order, you'll receive an invoice via email with our bank details. 
                        Please use your order number as the payment reference.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Form Actions */}
              <div className="hidden lg:flex justify-between items-center mt-8 pt-8 border-t">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    size="lg"
                  >
                    Back
                  </Button>
                )}
                <div className={currentStep === 1 ? 'ml-auto' : ''}>
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleContinue}
                      size="lg"
                      className="bg-[#0E5C4A] hover:bg-[#0A4A3B]"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="bg-[#0E5C4A] hover:bg-[#0A4A3B] min-w-[200px]"
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-display text-[#0E5C4A] mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Pricing Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                    {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Free delivery on orders over R500
                  </p>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span className="text-[#0E5C4A]">
                    {formatCurrency(total + deliveryFee)}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4 safe-area-inset-bottom lg:hidden">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleContinue}
              className="flex-1 bg-[#0E5C4A] hover:bg-[#0A4A3B]"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 bg-[#0E5C4A] hover:bg-[#0A4A3B]"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}