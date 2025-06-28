import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { ProductImageGallery } from "@/components/shop/product-image-gallery"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { ProductCard } from "@/components/shop/product-card"
import {
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Heart,
  Share2
} from "lucide-react"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()
  
  // Fetch product details
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(name, country),
      category:categories(name, slug)
    `)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()
  
  if (!product) {
    notFound()
  }
  
  // Fetch product images
  const { data: productImages } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', product.id)
    .order('sort_order')
  
  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      main_image_url,
      size,
      brand:brands(name)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4)
  
  const images = productImages?.map(img => ({
    url: img.image_url,
    alt: img.alt_text || product.name
  })) || []
  
  if (product.main_image_url && !images.some(img => img.url === product.main_image_url)) {
    images.unshift({
      url: product.main_image_url,
      alt: product.name
    })
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price)
  }
  
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">
              Products
            </Link>
            {(Array.isArray(product.category) ? product.category[0] : product.category) && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  href={`/products?category=${Array.isArray(product.category) ? product.category[0]?.slug : product.category?.slug}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {Array.isArray(product.category) ? product.category[0]?.name : product.category?.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        
        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery images={images} />
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Link 
                  href={`/products?brand=${Array.isArray(product.brand) ? product.brand[0]?.name : product.brand?.name}`}
                  className="text-sm text-royal-gold hover:text-royal-gold/80"
                >
                  {Array.isArray(product.brand) ? product.brand[0]?.name : product.brand?.name}
                </Link>
                {(Array.isArray(product.brand) ? product.brand[0]?.country : product.brand?.country) && (
                  <span className="text-sm text-gray-500">
                    • {Array.isArray(product.brand) ? product.brand[0]?.country : product.brand?.country}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-display text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-semibold text-emerald-palm">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                    <Badge variant="destructive">
                      Save {Math.round((1 - product.price / product.compare_at_price) * 100)}%
                    </Badge>
                  </>
                )}
              </div>
              
              {/* Product Attributes */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.size && (
                  <div>
                    <span className="text-sm text-gray-500">Size</span>
                    <p className="font-medium">{product.size}</p>
                  </div>
                )}
                {product.concentration && (
                  <div>
                    <span className="text-sm text-gray-500">Concentration</span>
                    <p className="font-medium">{product.concentration}</p>
                  </div>
                )}
                {product.gender && (
                  <div>
                    <span className="text-sm text-gray-500">Gender</span>
                    <p className="font-medium">{product.gender}</p>
                  </div>
                )}
                {product.launch_year && (
                  <div>
                    <span className="text-sm text-gray-500">Launch Year</span>
                    <p className="font-medium">{product.launch_year}</p>
                  </div>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-4 w-4 text-gray-400" />
                {product.stock_quantity > 0 ? (
                  <span className="text-sm text-green-600">
                    In Stock ({product.stock_quantity} available)
                  </span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    brand: Array.isArray(product.brand) ? product.brand[0]?.name || '' : product.brand?.name || '',
                    price: product.price,
                    image: product.main_image_url,
                    size: product.size
                  }}
                  disabled={product.stock_quantity === 0}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Benefits */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-emerald-palm" />
                  <div>
                    <p className="font-medium text-sm">100% Authentic</p>
                    <p className="text-xs text-gray-500">Guaranteed genuine product</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-emerald-palm" />
                  <div>
                    <p className="font-medium text-sm">Fast Delivery</p>
                    <p className="text-xs text-gray-500">2-3 business days nationwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="notes">Fragrance Notes</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description || product.short_description}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-6">
            <div className="space-y-6">
              {product.top_notes && product.top_notes.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Top Notes</h3>
                  <p className="text-gray-700">{product.top_notes.join(', ')}</p>
                </div>
              )}
              {product.middle_notes && product.middle_notes.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Heart Notes</h3>
                  <p className="text-gray-700">{product.middle_notes.join(', ')}</p>
                </div>
              )}
              {product.base_notes && product.base_notes.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Base Notes</h3>
                  <p className="text-gray-700">{product.base_notes.join(', ')}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">SKU</dt>
                <dd className="font-medium">{product.sku}</dd>
              </div>
              {(Array.isArray(product.brand) ? product.brand[0]?.name : product.brand?.name) && (
                <div>
                  <dt className="text-sm text-gray-500">Brand</dt>
                  <dd className="font-medium">{Array.isArray(product.brand) ? product.brand[0]?.name : product.brand?.name}</dd>
                </div>
              )}
              {(Array.isArray(product.category) ? product.category[0]?.name : product.category?.name) && (
                <div>
                  <dt className="text-sm text-gray-500">Category</dt>
                  <dd className="font-medium">{Array.isArray(product.category) ? product.category[0]?.name : product.category?.name}</dd>
                </div>
              )}
              {product.size && (
                <div>
                  <dt className="text-sm text-gray-500">Size</dt>
                  <dd className="font-medium">{product.size}</dd>
                </div>
              )}
              {product.concentration && (
                <div>
                  <dt className="text-sm text-gray-500">Concentration</dt>
                  <dd className="font-medium">{product.concentration}</dd>
                </div>
              )}
              {product.gender && (
                <div>
                  <dt className="text-sm text-gray-500">Gender</dt>
                  <dd className="font-medium">{product.gender}</dd>
                </div>
              )}
            </dl>
          </TabsContent>
        </Tabs>
        
        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-display text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    brand: Array.isArray(product.brand) ? product.brand[0]?.name || '' : '',
                    price: product.price,
                    image: product.main_image_url,
                    size: product.size
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}