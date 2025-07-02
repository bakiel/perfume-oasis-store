"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { promotionService } from "@/lib/promotions/promotion-service-client"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [promoInput, setPromoInput] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotal, 
    getSubtotal,
    promoCode,
    appliedPromotions,
    discount,
    freeShipping,
    setPromoCode,
    setPromotions,
    clearPromotions
  } = useCartStore()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  useEffect(() => {
    // Apply auto-apply promotions only after mount
    if (isMounted && items.length > 0) {
      applyAutoPromotions()
    }
  }, [isMounted])
  
  useEffect(() => {
    // Re-apply promotions when cart items change
    if (items.length > 0) {
      applyPromotions(promoCode)
    } else {
      clearPromotions()
    }
  }, [items])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-soft-sand flex items-center justify-center">
        <div className="animate-pulse text-emerald-palm">Loading cart...</div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const total = getTotal()
  const deliveryFee = (freeShipping || total > 1000) ? 0 : 150
  
  const applyAutoPromotions = async () => {
    if (items.length === 0) return
    
    try {
      // Map cart items to ensure product_id is set
      const mappedItems = items.map(item => ({
        id: item.id,
        product_id: item.product_id || item.id, // Use id as fallback
        quantity: item.quantity,
        price: item.price,
        product: item.category_id ? { category_id: item.category_id } : undefined
      }))
      
      const result = await promotionService.applyPromotionsToCart(
        mappedItems,
        subtotal,
        undefined
      )
      
      if (result.appliedPromotions.length > 0) {
        setPromotions(result.appliedPromotions, result.totalDiscount, result.freeShipping)
      }
    } catch (error) {
      console.error('Error applying auto promotions:', error)
    }
  }
  
  const applyPromotions = async (code: string | null) => {
    if (items.length === 0) return
    
    try {
      // Map cart items to ensure product_id is set
      const mappedItems = items.map(item => ({
        id: item.id,
        product_id: item.product_id || item.id, // Use id as fallback
        quantity: item.quantity,
        price: item.price,
        product: item.category_id ? { category_id: item.category_id } : undefined
      }))
      
      const result = await promotionService.applyPromotionsToCart(
        mappedItems,
        subtotal,
        code || undefined
      )
      
      setPromotions(result.appliedPromotions, result.totalDiscount, result.freeShipping)
    } catch (error) {
      console.error('Error applying promotions:', error)
    }
  }
  
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    
    setIsApplyingPromo(true)
    try {
      // Map cart items to ensure product_id is set
      const mappedItems = items.map(item => ({
        id: item.id,
        product_id: item.product_id || item.id, // Use id as fallback
        quantity: item.quantity,
        price: item.price,
        product: item.category_id ? { category_id: item.category_id } : undefined
      }))
      
      const result = await promotionService.applyPromotionsToCart(
        mappedItems,
        subtotal,
        promoInput
      )
      
      setPromoCode(promoInput)
      setPromotions(result.appliedPromotions, result.totalDiscount, result.freeShipping)
      toast.success('Promo code applied successfully!')
      setPromoInput('')
    } catch (error: any) {
      toast.error(error.message || 'Invalid promo code')
    } finally {
      setIsApplyingPromo(false)
    }
  }
  
  const handleRemovePromo = () => {
    setPromoCode(null)
    applyAutoPromotions() // Re-apply only auto promotions
    toast.success('Promo code removed')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-soft-sand flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-palm/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-12 w-12 text-emerald-palm" />
          </div>
          <h1 className="text-2xl font-display text-emerald-palm mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-6">
            Discover our collection of luxury fragrances
          </p>
          <Link href="/products">
            <Button><span>Start Shopping</span></Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-display text-emerald-palm">
            Shopping Cart ({items.length})
          </h1>
        </div>
      </header>

      {/* Main Content - Two column layout on desktop */}
      <div className="container mx-auto px-4 py-4 md:py-8 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Cart Items - Takes 2 columns on desktop */}
        <div className="lg:col-span-2">
          <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-lg p-4 md:p-6 mb-3 md:mb-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4 md:gap-6">
                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="md:flex md:justify-between md:items-start">
                    <div className="flex-1">
                      <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">
                        {item.brand}
                      </p>
                      <h3 className="font-medium text-sm md:text-base lg:text-lg">{item.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">{item.size}</p>
                    </div>
                    
                    {/* Price on desktop - moved to top right */}
                    <div className="hidden md:block text-right ml-4">
                      <p className="font-bold text-lg lg:text-xl text-emerald-palm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 md:mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                      <span className="font-medium w-8 md:w-12 text-center text-sm md:text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Price on mobile */}
                      <p className="font-bold text-emerald-palm md:hidden">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* Summary - Fixed sidebar on desktop, sticky on mobile */}
        <div className="mt-6 lg:mt-0">
          <div className="sticky bottom-0 lg:bottom-auto lg:top-24 bg-white border lg:border rounded-t-2xl lg:rounded-lg px-4 py-4 md:p-6 space-y-4 shadow-lg lg:shadow-md">
            <h2 className="text-lg md:text-xl font-display text-emerald-palm hidden lg:block">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              {/* Promo Code Input */}
              {!promoCode && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyPromo}
                      disabled={!promoInput.trim() || isApplyingPromo}
                    >
                      {isApplyingPromo ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Applied Promotions */}
              {appliedPromotions.length > 0 && (
                <div className="space-y-2 bg-green-50 p-3 rounded-lg">
                  {appliedPromotions.map((promo) => (
                    <div key={promo.promotion_id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-green-800">{promo.name}</span>
                        {promo.code && (
                          <span className="text-xs text-green-600">({promo.code})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-800">
                          -{formatCurrency(promo.discount_amount)}
                        </span>
                        {promo.code && (
                          <button
                            onClick={handleRemovePromo}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {freeShipping && !appliedPromotions.find(p => p.type === 'free_shipping') && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-green-800">Free Shipping</span>
                      </div>
                      <span className="font-medium text-green-800">Applied</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                  {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs md:text-sm text-gray-500 bg-amber-50 px-3 py-2 rounded">
                  Free delivery on orders over R1,000
                </p>
              )}
              <div className="flex justify-between font-bold text-lg md:text-xl pt-3 border-t">
                <span>Total</span>
                <span className="text-emerald-palm">
                  {formatCurrency(total + deliveryFee)}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => window.location.href = '/checkout'}
              >
                <span>Proceed to Checkout</span>
              </Button>
              
              <Link href="/products" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  <span>Continue Shopping</span>
                </Button>
              </Link>
            </div>
            
            {/* Trust badges - hidden on mobile */}
            <div className="hidden md:block pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h1a1 1 0 011 1v6.05A2.5 2.5 0 0113.5 19a2.5 2.5 0 01-2.45-3H8.95a2.5 2.5 0 01-4.9 0H3a3 3 0 01-3-3V5a3 3 0 013-3h7a3 3 0 013 3v2h1a3 3 0 013 3v4a1 1 0 01-1 1h-2z" />
                </svg>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}