"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false)
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-soft-sand flex items-center justify-center">
        <div className="animate-pulse text-emerald-palm">Loading cart...</div>
      </div>
    )
  }

  const total = getTotal()
  const deliveryFee = total > 500 ? 0 : 60

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
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-xl font-display text-emerald-palm">
            Shopping Cart ({items.length})
          </h1>
        </div>
      </header>

      {/* Cart Items */}
      <div className="px-4 py-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase">
                    {item.brand}
                  </p>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.size}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-emerald-palm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span className={deliveryFee === 0 ? "text-green-600" : ""}>
              {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
            </span>
          </div>
          {deliveryFee > 0 && (
            <p className="text-xs text-gray-500">
              Free delivery on orders over R500
            </p>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span className="text-emerald-palm">
              {formatCurrency(total + deliveryFee)}
            </span>
          </div>
        </div>
        
        <Link href="/checkout" className="w-full">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  )
}