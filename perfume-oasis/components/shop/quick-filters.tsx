'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

interface QuickFiltersProps {
  categoryCounts: {
    women: number
    men: number
    unisex: number
  }
}

export function QuickFilters({ categoryCounts }: QuickFiltersProps) {
  const router = useRouter()

  return (
    <section className="bg-white py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <span className="text-sm text-gray-600">Shop by:</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-emerald-palm hover:text-white hover:border-emerald-palm"
            onClick={() => router.push('/products?gender=women')}
          >
            <span>Women ({categoryCounts.women})</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-emerald-palm hover:text-white hover:border-emerald-palm"
            onClick={() => router.push('/products?gender=men')}
          >
            <span>Men ({categoryCounts.men})</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-emerald-palm hover:text-white hover:border-emerald-palm"
            onClick={() => router.push('/products?gender=unisex')}
          >
            <span>Unisex ({categoryCounts.unisex})</span>
          </Button>
          <div className="hidden md:block w-px h-6 bg-gray-300 mx-2" />
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-emerald-palm hover:text-white hover:border-emerald-palm"
            onClick={() => router.push('/new-arrivals')}
          >
            <span>New Arrivals</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => router.push('/sale')}
          >
            <span>Sale</span>
          </Button>
        </div>
      </div>
    </section>
  )
}