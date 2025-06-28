import { Suspense } from "react"
import { ProductsClient } from "./products-client"
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { 
    search?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    gender?: string
    sort?: string
  }
}) {
  const supabase = await createClient()
  
  // Build query
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      main_image_url,
      size,
      gender,
      concentration,
      brand_id,
      category_id,
      brand:brands(id, name),
      category:categories(id, name, slug)
    `)
    .eq('is_active', true)
  
  // Apply search filter
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%`)
  }
  
  // Get category ID if filtering by category
  if (searchParams.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single()
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id)
    }
  }
  
  // Get brand IDs if filtering by brands (support multiple brands)
  if (searchParams.brand) {
    const brandNames = searchParams.brand.split(',')
    const { data: brandData } = await supabase
      .from('brands')
      .select('id')
      .in('name', brandNames)
    
    if (brandData && brandData.length > 0) {
      const brandIds = brandData.map(b => b.id)
      query = query.in('brand_id', brandIds)
    }
  }
  
  if (searchParams.gender) {
    query = query.ilike('gender', searchParams.gender)
  }
  
  if (searchParams.minPrice) {
    query = query.gte('price', parseFloat(searchParams.minPrice))
  }
  
  if (searchParams.maxPrice) {
    query = query.lte('price', parseFloat(searchParams.maxPrice))
  }
  
  // Apply sorting
  switch (searchParams.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  }
  
  const { data: products } = await query
  
  // Transform the products data to match the expected format
  const transformedProducts = products?.map(product => ({
    ...product,
    brand: Array.isArray(product.brand) ? product.brand[0] : product.brand,
    category: Array.isArray(product.category) ? product.category[0] : product.category
  })) || []
  
  // Fetch categories and brands for filters with counts
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order')
  
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name')
    .eq('is_active', true)
    .order('name')
  
  // Get product counts for categories
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true)
      
      return { ...category, count: count || 0 }
    })
  )
  
  // Filter out categories with no products
  const activeCategories = categoriesWithCounts.filter(cat => cat.count > 0)
  
  // Get product counts for brands
  const brandsWithCounts = await Promise.all(
    (brands || []).map(async (brand) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brand.id)
        .eq('is_active', true)
      
      return { name: brand.name, count: count || 0 }
    })
  )
  
  // Filter out brands with no products
  const activeBrands = brandsWithCounts.filter(brand => brand.count > 0)
  
  // Get gender counts
  const genderCounts = {
    women: 0,
    men: 0,
    unisex: 0
  }
  
  const { data: genderData } = await supabase
    .from('products')
    .select('gender')
    .eq('is_active', true)
    .not('gender', 'is', null)
  
  genderData?.forEach(product => {
    const gender = product.gender?.toLowerCase()
    if (gender === 'women' || gender === 'female') genderCounts.women++
    else if (gender === 'men' || gender === 'male') genderCounts.men++
    else if (gender === 'unisex') genderCounts.unisex++
  })
  
  return (
    <div className="min-h-screen bg-[#F6F3EF]">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsClient
          initialProducts={transformedProducts}
          categories={activeCategories}
          brands={activeBrands}
          searchParams={searchParams}
          genderCounts={genderCounts}
        />
      </Suspense>
    </div>
  )
}

function ProductsLoading() {
  return (
    <div className="px-4 py-6">
      <div className="h-12 bg-gray-200 rounded-lg mb-4 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg h-80 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}