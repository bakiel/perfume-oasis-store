"use client"

import { useEffect } from 'react'
import { useCartStore } from '@/hooks/use-cart'

export function CartCleaner() {
  const { items, removeItem } = useCartStore()
  
  useEffect(() => {
    // Check for Ocean Breeze on mount
    const oceanBreezeItems = items.filter(item => 
      item.name.toLowerCase().includes('ocean breeze') ||
      item.name === 'Ocean Breeze'
    )
    
    if (oceanBreezeItems.length > 0) {
      console.log('Removing Ocean Breeze items:', oceanBreezeItems)
      oceanBreezeItems.forEach(item => {
        removeItem(item.id)
      })
    }
  }, []) // Run once on mount
  
  return null // This component doesn't render anything
}