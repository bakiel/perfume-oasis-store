'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/hooks/use-cart'

interface CartCountProps {
  className?: string
}

export function CartCount({ className }: CartCountProps) {
  const [mounted, setMounted] = useState(false)
  const { getItemCount } = useCartStore()
  const count = getItemCount()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted || count === 0) return null
  
  return (
    <span className={className}>
      {count}
    </span>
  )
}
