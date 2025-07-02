import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  quantity: number
  size: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStoreSimple = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    console.log('Adding item to cart:', item)
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id)
      
      if (existingItem) {
        console.log('Item exists, incrementing quantity')
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      
      console.log('New item, adding to cart')
      return {
        items: [...state.items, { ...item, quantity: 1 }],
      }
    })
  },
  
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }
    
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }))
  },
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    const items = get().items
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  
  getItemCount: () => {
    const items = get().items
    return items.reduce((count, item) => count + item.quantity, 0)
  },
}))