import { createClient } from '@/lib/supabase/client'

export interface Promotion {
  id: string
  name: string
  description?: string
  type: 'percentage' | 'fixed_amount' | 'bogo' | 'free_shipping'
  value: number
  minimum_purchase?: number
  code?: string
  auto_apply: boolean
  is_active: boolean
  start_date?: string
  end_date?: string
  usage_limit?: number
  usage_count: number
  product_ids?: string[]
  category_ids?: string[]
  customer_ids?: string[]
  display_on_homepage: boolean
  priority: number
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product?: {
    category_id?: string
  }
}

export interface AppliedPromotion {
  promotion_id: string
  name: string
  type: string
  discount_amount: number
  code?: string
}

export class PromotionService {
  private supabase: any

  constructor() {
    // Only initialize Supabase client in the browser
    if (typeof window !== 'undefined') {
      this.supabase = createClient()
    }
  }

  /**
   * Get all active promotions that can be auto-applied
   */
  async getActiveAutoApplyPromotions(): Promise<Promotion[]> {
    if (!this.supabase) return []
    
    try {
      const { data, error } = await this.supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .eq('auto_apply', true)
        .order('priority', { ascending: false })

      if (error) {
        console.error('Error fetching auto-apply promotions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getActiveAutoApplyPromotions:', error)
      return []
    }
  }

  /**
   * Get promotion by code
   */
  async getPromotionByCode(code: string): Promise<Promotion | null> {
    if (!this.supabase) return null
    
    try {
      const { data, error } = await this.supabase
        .from('promotions')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching promotion by code:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getPromotionByCode:', error)
      return null
    }
  }

  /**
   * Validate if a promotion can be applied
   */
  async validatePromotion(
    promotion: Promotion,
    cartItems: CartItem[],
    subtotal: number,
    customerId?: string
  ): Promise<{ valid: boolean; message?: string }> {
    // Check minimum purchase requirement
    if (promotion.minimum_purchase && subtotal < promotion.minimum_purchase) {
      return {
        valid: false,
        message: `Minimum purchase of ${promotion.minimum_purchase} required`
      }
    }

    // Check date validity
    const now = new Date()
    if (promotion.start_date && new Date(promotion.start_date) > now) {
      return {
        valid: false,
        message: 'Promotion has not started yet'
      }
    }
    if (promotion.end_date && new Date(promotion.end_date) < now) {
      return {
        valid: false,
        message: 'Promotion has expired'
      }
    }

    // Check usage limit
    if (promotion.usage_limit && promotion.usage_count >= promotion.usage_limit) {
      return {
        valid: false,
        message: 'Promotion usage limit reached'
      }
    }

    // Check customer restriction
    if (promotion.customer_ids && promotion.customer_ids.length > 0) {
      if (!customerId || !promotion.customer_ids.includes(customerId)) {
        return {
          valid: false,
          message: 'This promotion is not available for your account'
        }
      }
    }

    // Check product restrictions
    if (promotion.product_ids && promotion.product_ids.length > 0) {
      const hasEligibleProduct = cartItems.some(item => 
        promotion.product_ids!.includes(item.product_id)
      )
      if (!hasEligibleProduct) {
        return {
          valid: false,
          message: 'No eligible products in cart for this promotion'
        }
      }
    }

    // Check category restrictions
    if (promotion.category_ids && promotion.category_ids.length > 0) {
      const hasEligibleCategory = cartItems.some(item => 
        item.product?.category_id && 
        promotion.category_ids!.includes(item.product.category_id)
      )
      if (!hasEligibleCategory) {
        return {
          valid: false,
          message: 'No products from eligible categories in cart'
        }
      }
    }

    return { valid: true }
  }

  /**
   * Apply promotions to cart and calculate discounts
   */
  async applyPromotionsToCart(
    cartItems: CartItem[],
    subtotal: number,
    promoCode?: string,
    customerId?: string
  ): Promise<{
    appliedPromotions: AppliedPromotion[]
    totalDiscount: number
    freeShipping: boolean
  }> {
    if (!this.supabase) {
      return {
        appliedPromotions: [],
        totalDiscount: 0,
        freeShipping: false
      }
    }

    try {
      const appliedPromotions: AppliedPromotion[] = []
      let totalDiscount = 0
      let freeShipping = false

      // Get all active auto-apply promotions
      const autoApplyPromotions = await this.getActiveAutoApplyPromotions()

      // If a promo code is provided, get that promotion too
      let codePromotion: Promotion | null = null
      if (promoCode) {
        codePromotion = await this.getPromotionByCode(promoCode)
      }

      // Combine all promotions and sort by priority
      const allPromotions = [...autoApplyPromotions]
      if (codePromotion) {
        allPromotions.push(codePromotion)
      }
      allPromotions.sort((a, b) => b.priority - a.priority)

      // Apply each promotion
      for (const promotion of allPromotions) {
        const validation = await this.validatePromotion(
          promotion,
          cartItems,
          subtotal,
          customerId
        )

        if (!validation.valid) {
          if (promotion.code === promoCode) {
            throw new Error(validation.message || 'Invalid promotion')
          }
          continue
        }

        // Calculate discount based on promotion type
        let discountAmount = 0

        switch (promotion.type) {
          case 'percentage':
            discountAmount = (subtotal * promotion.value) / 100
            break

          case 'fixed_amount':
            discountAmount = Math.min(promotion.value, subtotal)
            break

          case 'bogo':
            // Buy One Get One - calculate based on eligible items
            discountAmount = this.calculateBogoDiscount(cartItems, promotion)
            break

          case 'free_shipping':
            freeShipping = true
            break
        }

        if (discountAmount > 0 || promotion.type === 'free_shipping') {
          appliedPromotions.push({
            promotion_id: promotion.id,
            name: promotion.name,
            type: promotion.type,
            discount_amount: discountAmount,
            code: promotion.code
          })
          totalDiscount += discountAmount
        }
      }

      return {
        appliedPromotions,
        totalDiscount,
        freeShipping
      }
    } catch (error) {
      console.error('Error applying promotions:', error)
      throw error
    }
  }

  /**
   * Calculate BOGO discount
   */
  private calculateBogoDiscount(cartItems: CartItem[], promotion: Promotion): number {
    let discount = 0

    // Filter eligible items
    const eligibleItems = cartItems.filter(item => {
      if (promotion.product_ids && promotion.product_ids.length > 0) {
        return promotion.product_ids.includes(item.product_id)
      }
      if (promotion.category_ids && promotion.category_ids.length > 0) {
        return item.product?.category_id && 
               promotion.category_ids.includes(item.product.category_id)
      }
      return true
    })

    // Sort by price descending to give the best discount
    eligibleItems.sort((a, b) => b.price - a.price)

    // Calculate pairs and apply discount
    let totalQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0)
    let pairsToDiscount = Math.floor(totalQuantity / 2)

    for (const item of eligibleItems) {
      if (pairsToDiscount <= 0) break

      const discountQuantity = Math.min(item.quantity, pairsToDiscount)
      discount += item.price * discountQuantity * (promotion.value / 100)
      pairsToDiscount -= discountQuantity
    }

    return discount
  }

  /**
   * Increment usage count for a promotion
   */
  async incrementPromotionUsage(promotionId: string): Promise<void> {
    if (!this.supabase) return
    
    try {
      const { error } = await this.supabase.rpc('increment_promotion_usage', {
        promotion_id: promotionId
      })

      if (error) {
        console.error('Error incrementing promotion usage:', error)
      }
    } catch (error) {
      console.error('Error in incrementPromotionUsage:', error)
    }
  }
}

// Export singleton instance
export const promotionService = new PromotionService()