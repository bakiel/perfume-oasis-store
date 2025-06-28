"use client"

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
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (disabled) return
    
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: product.size,
    })
    
    toast.success(`${product.name} added to cart`)
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
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}