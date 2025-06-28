"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductFiltersProps {
  brands: any[]
  categories: any[]
  currentFilters: Record<string, string | undefined>
}

export function ProductFilters({ brands, categories, currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    brand: false,
    gender: true,
    concentration: false,
    price: false
  })
  
  const genders = ['Women', 'Men', 'Unisex']
  const concentrations = ['Parfum', 'Eau de Parfum', 'Eau de Toilette', 'Eau de Cologne']
  const priceRanges = [
    { label: 'Under R500', min: '0', max: '500' },
    { label: 'R500 - R1,000', min: '500', max: '1000' },
    { label: 'R1,000 - R2,000', min: '1000', max: '2000' },
    { label: 'R2,000 - R5,000', min: '2000', max: '5000' },
    { label: 'Over R5,000', min: '5000', max: '' }
  ]
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }
  
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    params.delete('page') // Reset to page 1
    router.push(`/products?${params.toString()}`)
  }
  
  const clearFilters = () => {
    router.push('/products')
  }
  
  const hasActiveFilters = Object.values(currentFilters).some(v => v)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
      
      {/* Categories */}
      <div className="border-b pb-4">
        <button
          className="flex items-center justify-between w-full py-2 text-left"
          onClick={() => toggleSection('category')}
        >
          <span className="font-medium">Category</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            openSections.category && "rotate-180"
          )} />
        </button>
        
        {openSections.category && (
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={currentFilters.category === category.slug}
                  onChange={() => updateFilter('category', 
                    currentFilters.category === category.slug ? null : category.slug
                  )}
                  className="text-emerald-palm focus:ring-emerald-palm"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Gender */}
      <div className="border-b pb-4">
        <button
          className="flex items-center justify-between w-full py-2 text-left"
          onClick={() => toggleSection('gender')}
        >
          <span className="font-medium">Gender</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            openSections.gender && "rotate-180"
          )} />
        </button>
        
        {openSections.gender && (
          <div className="mt-3 space-y-2">
            {genders.map((gender) => (
              <label key={gender} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={currentFilters.gender === gender}
                  onChange={() => updateFilter('gender',
                    currentFilters.gender === gender ? null : gender
                  )}
                  className="text-emerald-palm focus:ring-emerald-palm"
                />
                <span className="text-sm">{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Brands */}
      <div className="border-b pb-4">
        <button
          className="flex items-center justify-between w-full py-2 text-left"
          onClick={() => toggleSection('brand')}
        >
          <span className="font-medium">Brand</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            openSections.brand && "rotate-180"
          )} />
        </button>
        
        {openSections.brand && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.brand === brand.slug}
                  onChange={() => updateFilter('brand',
                    currentFilters.brand === brand.slug ? null : brand.slug
                  )}
                  className="text-emerald-palm focus:ring-emerald-palm rounded"
                />
                <span className="text-sm">{brand.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Concentration */}
      <div className="border-b pb-4">
        <button
          className="flex items-center justify-between w-full py-2 text-left"
          onClick={() => toggleSection('concentration')}
        >
          <span className="font-medium">Concentration</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            openSections.concentration && "rotate-180"
          )} />
        </button>
        
        {openSections.concentration && (
          <div className="mt-3 space-y-2">
            {concentrations.map((concentration) => (
              <label key={concentration} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="concentration"
                  checked={currentFilters.concentration === concentration}
                  onChange={() => updateFilter('concentration',
                    currentFilters.concentration === concentration ? null : concentration
                  )}
                  className="text-emerald-palm focus:ring-emerald-palm"
                />
                <span className="text-sm">{concentration}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Range */}
      <div className="border-b pb-4">
        <button
          className="flex items-center justify-between w-full py-2 text-left"
          onClick={() => toggleSection('price')}
        >
          <span className="font-medium">Price Range</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            openSections.price && "rotate-180"
          )} />
        </button>
        
        {openSections.price && (
          <div className="mt-3 space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={
                    currentFilters.minPrice === range.min && 
                    currentFilters.maxPrice === range.max
                  }
                  onChange={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    if (currentFilters.minPrice === range.min && currentFilters.maxPrice === range.max) {
                      params.delete('minPrice')
                      params.delete('maxPrice')
                    } else {
                      params.set('minPrice', range.min)
                      if (range.max) {
                        params.set('maxPrice', range.max)
                      } else {
                        params.delete('maxPrice')
                      }
                    }
                    params.delete('page')
                    router.push(`/products?${params.toString()}`)
                  }}
                  className="text-emerald-palm focus:ring-emerald-palm"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}