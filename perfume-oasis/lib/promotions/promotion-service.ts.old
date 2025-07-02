import { createClient } from '@/lib/supabase/client'

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined'

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
  private supabase = isBrowser ? createClient() : null

  /**
   * Get all active promotions that can be auto-applied
   */
  async getAutoApplyPromotions(): Promise<Promotion[]> {
    const now = new Date().toISOString()
    
    const { data, error } = await this.supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .eq('auto_apply', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('priority', { ascending: false })

    if (error) {
      console.error('Error fetching auto-apply promotions:', error)
      return []
    }

    return data || []
  }

  /**
   * Validate a promotion code
   */
  async validatePromoCode(code: string, customerId?: string): Promise<Promotion | null> {
    const now = new Date().toISOString()
    
    const { data, error } = await this.supabase
      .from('promotions')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .single()

    if (error || !data) {
      return null
    }

    // Check usage limit
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      return null
    }

    // Check customer restrictions
    if (data.customer_ids && data.customer_ids.length > 0 && customerId) {
      if (!data.customer_ids.includes(customerId)) {
        return null
      }
    }

    return data
  }

  /**
   * Apply promotions to cart
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
    const appliedPromotions: AppliedPromotion[] = []
    let totalDiscount = 0
    let freeShipping = false

    // Get auto-apply promotions
    const autoPromotions = await this.getAutoApplyPromotions()

    // Add promo code promotion if provided
    let promoCodePromotion: Promotion | null = null
    if (promoCode) {
      promoCodePromotion = await this.validatePromoCode(promoCode, customerId)
      if (!promoCodePromotion) {
        throw new Error('Invalid or expired promo code')
      }
    }

    // Combine all applicable promotions
    const allPromotions = promoCodePromotion 
      ? [...autoPromotions, promoCodePromotion]
      : autoPromotions

    // Apply promotions in priority order
    for (const promotion of allPromotions) {
      // Check minimum purchase requirement
      if (promotion.minimum_purchase && subtotal < promotion.minimum_purchase) {
        continue
      }

      // Check product/category restrictions
      if (!this.isPromotionApplicableToCart(promotion, cartItems)) {
        continue
      }

      // Calculate discount based on type
      let discountAmount = 0

      switch (promotion.type) {
        case 'percentage':
          discountAmount = (subtotal - totalDiscount) * (promotion.value / 100)
          break

        case 'fixed_amount':
          discountAmount = Math.min(promotion.value, subtotal - totalDiscount)
          break

        case 'bogo':
          // For BOGO, find the cheapest eligible item and make it free
          discountAmount = this.calculateBogoDiscount(cartItems, promotion)
          break

        case 'free_shipping':
          freeShipping = true
          discountAmount = 0 // No monetary discount, just free shipping
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
  }

  /**
   * Check if promotion is applicable to cart items
   */
  private isPromotionApplicableToCart(promotion: Promotion, cartItems: CartItem[]): boolean {
    // No restrictions
    if ((!promotion.product_ids || promotion.product_ids.length === 0) && 
        (!promotion.category_ids || promotion.category_ids.length === 0)) {
      return true
    }

    // Check product restrictions
    if (promotion.product_ids && promotion.product_ids.length > 0) {
      const hasEligibleProduct = cartItems.some(item => 
        promotion.product_ids!.includes(item.product_id)
      )
      if (hasEligibleProduct) return true
    }

    // Check category restrictions
    if (promotion.category_ids && promotion.category_ids.length > 0) {
      const hasEligibleCategory = cartItems.some(item => 
        item.product?.category_id && 
        promotion.category_ids!.includes(item.product.category_id)
      )
      if (hasEligibleCategory) return true
    }

    return false
  }

  /**
   * Calculate BOGO discount
   */
  private calculateBogoDiscount(cartItems: CartItem[], promotion: Promotion): number {
    // Filter eligible items
    const eligibleItems = cartItems.filter(item => {
      if (promotion.product_ids && promotion.product_ids.length > 0) {
        return promotion.product_ids.includes(item.product_id)
      }
      if (promotion.category_ids && promotion.category_ids.length > 0) {
        return item.product?.category_id && 
               promotion.category_ids.includes(item.product.category_id)
      }
      return true // No restrictions
    })

    if (eligibleItems.length < 2) return 0

    // Sort by price (ascending) to give the cheapest item free
    const sortedItems = [...eligibleItems].sort((a, b) => a.price - b.price)
    
    // For every 2 items, the cheapest is free
    let discount = 0
    let itemCount = 0
    
    for (const item of sortedItems) {
      for (let i = 0; i < item.quantity; i++) {
        itemCount++
        if (itemCount % 2 === 0) {
          // This is the free item
          discount += item.price
        }
      }
    }

    return discount
  }

  /**
   * Increment usage count for a promotion
   */
  async incrementPromotionUsage(promotionId: string): Promise<void> {
    const { error } = await this.supabase.rpc('increment_promotion_usage', {
      promotion_id: promotionId
    })

    if (error) {
      console.error('Error incrementing promotion usage:', error)
    }
  }
}

// Export singleton instance
export const promotionService = new PromotionService()