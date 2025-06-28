import { HeroSection } from '@/components/ui/HeroSection';
import { SpecialsBanner } from '@/components/ui/SpecialsBanner';
import { PromoBanner } from '@/components/ui/PromoBanner';
import { InstagramFeed } from '@/components/ui/InstagramFeed';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { createClient } from '@/lib/supabase/server';
import HomeClient from './home-client';

async function getHomePageData() {
  const supabase = await createClient();
  
  // Get product counts by gender
  const { data: genderCounts } = await supabase
    .from('products')
    .select('gender')
    .eq('is_active', true);
  
  const counts = {
    women: 0,
    men: 0,
    unisex: 0
  };
  
  genderCounts?.forEach(product => {
    const gender = product.gender?.toLowerCase();
    if (gender === 'women' || gender === 'female') counts.women++;
    else if (gender === 'men' || gender === 'male') counts.men++;
    else if (gender === 'unisex') counts.unisex++;
  });
  
  // Get featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      main_image_url,
      brand:brands(name)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(4);
  
  // If no featured products, get the latest 4
  let products = featuredProducts;
  if (!products || products.length === 0) {
    const { data: latestProducts } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        main_image_url,
        brand:brands(name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4);
    
    products = latestProducts;
  }
  
  // Transform products data
  const transformedProducts = products?.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.main_image_url || '/images/products/product-placeholder-1.jpg',
    brand: Array.isArray(product.brand) 
      ? (product.brand[0] as any)?.name || 'Unknown Brand'
      : (product.brand as any)?.name || 'Unknown Brand'
  })) || [];
  
  return {
    categoryCounts: counts,
    featuredProducts: transformedProducts
  };
}

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">
          Welcome to Perfume Oasis
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Luxury fragrances in South Africa
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-emerald-900 mb-2">Women's Fragrances</h2>
            <p className="text-gray-600">Explore our collection</p>
          </div>
          
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-emerald-900 mb-2">Men's Fragrances</h2>
            <p className="text-gray-600">Discover masculine scents</p>
          </div>
          
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-emerald-900 mb-2">Unisex Collection</h2>
            <p className="text-gray-600">For everyone</p>
          </div>
        </div>
      </div>
    </div>
  );
}