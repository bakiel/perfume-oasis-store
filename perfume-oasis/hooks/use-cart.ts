import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AppliedPromotion } from '@/lib/promotions/promotion-service-client'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  quantity: number
  size: string
  product_id?: string
  category_id?: string
}

interface CartStore {
  items: CartItem[]
  promoCode: string | null
  appliedPromotions: AppliedPromotion[]
  discount: number
  freeShipping: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getItemCount: () => number
  setPromoCode: (code: string | null) => void
  setPromotions: (promotions: AppliedPromotion[], discount: number, freeShipping: boolean) => void
  clearPromotions: () => void
  hydrated: boolean
  setHydrated: (state: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      appliedPromotions: [],
      discount: 0,
      freeShipping: false,
      hydrated: false,
      
      setHydrated: (state) => {
        set({ hydrated: state })
      },
      
      setPromoCode: (code) => {
        set({ promoCode: code })
      },
      
      setPromotions: (promotions, discount, freeShipping) => {
        set({ 
          appliedPromotions: promotions, 
          discount, 
          freeShipping 
        })
      },
      
      clearPromotions: () => {
        set({ 
          promoCode: null, 
          appliedPromotions: [], 
          discount: 0, 
          freeShipping: false 
        })
      },
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          
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
      
      clearCart: () => set({ 
        items: [], 
        promoCode: null, 
        appliedPromotions: [], 
        discount: 0, 
        freeShipping: false 
      }),
      
      getSubtotal: () => {
        const items = get().items
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().discount
        return Math.max(0, subtotal - discount)
      },
      
      getItemCount: () => {
        const items = get().items
        return items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'perfume-oasis-cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
