"use client"

import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils'
import { Dialog, Transition } from '@headlessui/react'

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    removeItem, 
    updateQuantity, 
    getTotalPrice 
  } = useCartStore()
  
  const totalPrice = getTotalPrice()
  const shippingThreshold = 1000
  const remainingForFreeShipping = Math.max(0, shippingThreshold - totalPrice)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b">
                      <Dialog.Title className="text-lg font-medium">
                        Shopping Cart ({items.length})
                      </Dialog.Title>
                      <button
                        type="button"
                        className="p-2 -m-2 hover:bg-gray-100 rounded-full"
                        onClick={toggleCart}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Free Shipping Progress */}
                    {remainingForFreeShipping > 0 && (
                      <div className="px-4 py-3 bg-emerald-palm/5 border-b">
                        <p className="text-sm text-emerald-palm">
                          Add {formatCurrency(remainingForFreeShipping)} more for free shipping!
                        </p>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-palm transition-all"
                            style={{ width: `${(totalPrice / shippingThreshold) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8">
                          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 mb-4">Your cart is empty</p>
                          <Link href="/products" onClick={toggleCart}>
                            <Button>Continue Shopping</Button>
                          </Link>
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {items.map((item) => (
                            <li key={item.id} className="p-4">
                              <div className="flex gap-4">
                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={80}
                                      height={80}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <h4 className="text-sm font-medium line-clamp-2">
                                    {item.name}
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {formatCurrency(item.price)}
                                  </p>
                                  
                                  <div className="mt-2 flex items-center gap-2">
                                    <div className="flex items-center border rounded-lg">
                                      <button
                                        className="p-1 hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="px-3 py-1 text-sm">
                                        {item.quantity}
                                      </span>
                                      <button
                                        className="p-1 hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>
                                    
                                    <button
                                      className="text-sm text-gray-500 hover:text-red-500"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t px-4 py-6 space-y-4">
                        <div className="flex justify-between text-lg font-medium">
                          <p>Subtotal</p>
                          <p>{formatCurrency(totalPrice)}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Shipping and taxes calculated at checkout
                        </p>
                        
                        <div className="space-y-2">
                          <Link href="/checkout" onClick={toggleCart} className="w-full">
                            <Button 
                              className="w-full" 
                              size="lg"
                            >
                              Proceed to Checkout
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="lg"
                            onClick={toggleCart}
                          >
                            Continue Shopping
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}