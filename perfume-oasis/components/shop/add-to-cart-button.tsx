"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/hooks/use-cart"
import { ShoppingBag } from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    brand: string
    price: number
    image: string
    size: string
  }
  disabled?: boolean
  className?: string
  variant?: "default" | "icon"
  size?: "default" | "sm" | "lg" | "icon"
}

export function AddToCartButton({ 
  product, 
  disabled = false,
  className,
  variant = "default",
  size = "default"
}: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = () => {
    if (disabled) return
    
    console.log('AddToCartButton - Adding to cart:', product)
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size: product.size,
      })
      
      toast.success(`${product.name} added to cart`)
      console.log('Item added successfully')
    } catch (error) {
      console.error('AddToCartButton - Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    }
  }

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return (
      <Button
        disabled
        size={variant === "icon" ? "icon" : size}
        variant={variant === "icon" ? "ghost" : "default"}
        className={cn(variant === "icon" ? "h-8 w-8" : "gap-2", className)}
      >
        <ShoppingBag className="h-4 w-4" />
        {variant !== "icon" && <span>Add to Cart</span>}
      </Button>
    )
  }

  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant="ghost"
        onClick={handleAddToCart}
        disabled={disabled}
        className={cn("h-8 w-8", className)}
      >
        <ShoppingBag className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
      size={size}
      className={cn("gap-2", className)}
    >
      <ShoppingBag className="h-4 w-4" />
      <span>{disabled ? "Out of Stock" : "Add to Cart"}</span>
    </Button>
  )
}