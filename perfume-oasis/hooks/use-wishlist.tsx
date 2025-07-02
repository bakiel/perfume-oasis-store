import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items
        const exists = currentItems.find((i) => i.id === item.id)
        
        if (exists) {
          toast.error('Already in wishlist')
          return
        }
        
        set({ items: [...currentItems, item] })
        toast.success('Added to wishlist')
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
        toast.success('Removed from wishlist')
      },
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)