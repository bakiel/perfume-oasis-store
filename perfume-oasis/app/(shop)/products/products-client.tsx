"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  main_image_url: string
  size: string
  gender: string
  concentration: string
  brand: { name: string }
  category: { name: string; slug: string }
}

interface ProductsClientProps {
  initialProducts: Product[]
  categories: { name: string; slug: string; count?: number }[]
  brands: { name: string; count?: number }[]
  searchParams: any
  genderCounts?: {
    women: number
    men: number
    unisex: number
  }
}

const categoryImages: Record<string, string | null> = {
  'mens': '/images/category-defining visuals/cat_men_atomiser_bottle.jpg',
  'womens': '/images/category-defining visuals/cat_women_floral_bottle.jpg',
  'unisex': '/images/category-defining visuals/cat_unisex_duo_bottles.jpg',
  'gift-sets': null,
  'limited': null
}

export function ProductsClient({ 
  initialProducts, 
  categories, 
  brands,
  searchParams,
  genderCounts 
}: ProductsClientProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  
  // Get selected brands from URL (support multiple brands)
  const selectedBrands = searchParams.brand ? searchParams.brand.split(',') : []
  
  // Price range state
  const [priceRange, setPriceRange] = useState([
    searchParams.minPrice ? parseFloat(searchParams.minPrice) : 0,
    searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : 2000
  ])
  
  const updateURL = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    router.push(`/products?${params.toString()}`)
  }, [router, urlSearchParams])
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchParams.search) {
        updateURL({ search: searchQuery || undefined })
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery, searchParams.search, updateURL])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL({ search: searchQuery || undefined })
  }
  
  const handleSort = (value: string) => {
    updateURL({ sort: value })
  }
  
  const handleCategoryChange = (categorySlug: string) => {
    updateURL({ category: categorySlug === 'all' ? undefined : categorySlug })
  }
  
  const handleBrandToggle = (brandName: string, checked: boolean) => {
    let newBrands = [...selectedBrands]
    
    if (checked) {
      if (!newBrands.includes(brandName)) {
        newBrands.push(brandName)
      }
    } else {
      newBrands = newBrands.filter(b => b !== brandName)
    }
    
    updateURL({ brand: newBrands.length > 0 ? newBrands.join(',') : undefined })
  }
  
  const handleGenderChange = (gender: string) => {
    updateURL({ gender: gender === 'all' ? undefined : gender })
  }
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }
  
  const applyPriceFilter = () => {
    updateURL({
      minPrice: priceRange[0] > 0 ? priceRange[0].toString() : undefined,
      maxPrice: priceRange[1] < 2000 ? priceRange[1].toString() : undefined
    })
  }
  
  const clearFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 2000])
    router.push('/products')
  }
  
  const activeFilterCount = [
    searchParams.category,
    selectedBrands.length > 0,
    searchParams.gender,
    searchParams.minPrice || searchParams.maxPrice
  ].filter(Boolean).length
  
  const hasActiveFilters = activeFilterCount > 0
  
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display text-[#0E5C4A]">
              Shop Fragrances
            </h1>
            <Select value={searchParams.sort || "featured"} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for your favourite fragrance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0E5C4A]/20 focus:bg-white transition-all"
              />
            </div>
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger className="relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <SlidersHorizontal className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#0E5C4A] text-white rounded-full text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Category Filter */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Category</Label>
                    <RadioGroup 
                      value={searchParams.category || 'all'} 
                      onValueChange={handleCategoryChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="cat-all" />
                        <Label htmlFor="cat-all" className="font-normal cursor-pointer">
                          All Categories
                        </Label>
                      </div>
                      {categories.map((category) => {
                        const categoryImage = categoryImages[category.slug]
                        return (
                          <div key={category.slug} className="flex items-center space-x-2">
                            <RadioGroupItem value={category.slug} id={`cat-${category.slug}`} />
                            <Label htmlFor={`cat-${category.slug}`} className="font-normal cursor-pointer flex-1">
                              <span className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2">
                                  {categoryImage && (
                                    <div className="relative w-8 h-8 rounded overflow-hidden">
                                      <Image
                                        src={categoryImage}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                      />
                                    </div>
                                  )}
                                  <span>{category.name}</span>
                                </span>
                                {category.count && <span className="text-xs text-gray-500">({category.count})</span>}
                              </span>
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </div>
                  
                  {/* Brand Filter */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Brand</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map((brand) => (
                        <div key={brand.name} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`brand-${brand.name}`}
                            checked={selectedBrands.includes(brand.name)}
                            onCheckedChange={(checked) => handleBrandToggle(brand.name, checked as boolean)}
                          />
                          <Label 
                            htmlFor={`brand-${brand.name}`} 
                            className="font-normal cursor-pointer text-sm flex-1"
                          >
                            <span className="flex items-center justify-between">
                              <span>{brand.name}</span>
                              {brand.count && <span className="text-xs text-gray-500">({brand.count})</span>}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Gender Filter */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Gender</Label>
                    <RadioGroup 
                      value={searchParams.gender || 'all'} 
                      onValueChange={handleGenderChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="gender-all" />
                        <Label htmlFor="gender-all" className="font-normal cursor-pointer">
                          All
                        </Label>
                      </div>
                      {genderCounts?.women > 0 && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="women" id="gender-women" />
                          <Label htmlFor="gender-women" className="font-normal cursor-pointer">
                            <span className="flex items-center justify-between w-full">
                              <span>Women</span>
                              <span className="text-xs text-gray-500">({genderCounts.women})</span>
                            </span>
                          </Label>
                        </div>
                      )}
                      {genderCounts?.men > 0 && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="men" id="gender-men" />
                          <Label htmlFor="gender-men" className="font-normal cursor-pointer">
                            <span className="flex items-center justify-between w-full">
                              <span>Men</span>
                              <span className="text-xs text-gray-500">({genderCounts.men})</span>
                            </span>
                          </Label>
                        </div>
                      )}
                      {genderCounts?.unisex > 0 && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unisex" id="gender-unisex" />
                          <Label htmlFor="gender-unisex" className="font-normal cursor-pointer">
                            <span className="flex items-center justify-between w-full">
                              <span>Unisex</span>
                              <span className="text-xs text-gray-500">({genderCounts.unisex})</span>
                            </span>
                          </Label>
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Price Range
                    </Label>
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-medium">R{priceRange[0]}</span>
                      <span className="text-gray-500">to</span>
                      <span className="font-medium">R{priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      min={0}
                      max={2000}
                      step={50}
                      className="mb-4"
                    />
                    <Button 
                      onClick={applyPriceFilter} 
                      size="sm" 
                      className="w-full"
                      disabled={
                        priceRange[0] === (searchParams.minPrice ? parseFloat(searchParams.minPrice) : 0) &&
                        priceRange[1] === (searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : 2000)
                      }
                    >
                      Apply Price Filter
                    </Button>
                  </div>
                  
                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </form>
          
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchParams.category && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find(c => c.slug === searchParams.category)?.name}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateURL({ category: undefined })}
                  />
                </Badge>
              )}
              {selectedBrands.map((brandName: string) => (
                <Badge key={brandName} variant="secondary" className="gap-1">
                  {brandName}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleBrandToggle(brandName, false)}
                  />
                </Badge>
              ))}
              {searchParams.gender && (
                <Badge variant="secondary" className="gap-1">
                  {searchParams.gender.charAt(0).toUpperCase() + searchParams.gender.slice(1)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateURL({ gender: undefined })}
                  />
                </Badge>
              )}
              {(searchParams.minPrice || searchParams.maxPrice) && (
                <Badge variant="secondary" className="gap-1">
                  R{searchParams.minPrice || 0} - R{searchParams.maxPrice || 2000}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateURL({ minPrice: undefined, maxPrice: undefined })}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-sm text-gray-600 mb-4">
          {initialProducts.length} products found
        </p>
        
        {initialProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchParams.gender ? 
                `No ${searchParams.gender}'s fragrances found` : 
                'No products found matching your criteria'
              }
            </p>
            {hasActiveFilters && (
              <>
                <p className="text-sm text-gray-400 mb-6">
                  Try adjusting your filters or browse all products
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  brand: product.brand?.name || '',
                  price: product.price,
                  image: product.main_image_url,
                  size: product.size,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}