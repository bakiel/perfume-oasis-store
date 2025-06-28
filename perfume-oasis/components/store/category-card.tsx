import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    description?: string
    image_url?: string
  }
}

const categoryImages: Record<string, string> = {
  'womens-fragrances': '/images/category-defining visuals/cat_women_floral_bottle.jpg',
  'womens': '/images/category-defining visuals/cat_women_floral_bottle.jpg',
  'mens-fragrances': '/images/category-defining visuals/cat_men_atomiser_bottle.jpg',
  'mens': '/images/category-defining visuals/cat_men_atomiser_bottle.jpg',
  'unisex-fragrances': '/images/category-defining visuals/cat_unisex_duo_bottles.jpg',
  'unisex': '/images/category-defining visuals/cat_unisex_duo_bottles.jpg'
}

export function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.image_url || categoryImages[category.slug] || categoryImages['unisex-fragrances']
  
  return (
    <Link href={`/products?category=${category.slug}`} className="group">
      <div className="relative overflow-hidden rounded-2xl h-80 aspect-square">
        <Image
          src={imageUrl}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h3 className="text-2xl font-display mb-2">{category.name}</h3>
          <p className="text-white/80 mb-4">{category.description}</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Shop Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}