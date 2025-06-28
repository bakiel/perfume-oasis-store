"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Shirt, Flower2, Zap, Gift, Gem } from "lucide-react"

const categories = [
  { 
    id: "mens", 
    name: "Men's", 
    icon: Shirt, 
    color: "bg-slate-50 text-slate-700 hover:bg-slate-100",
    image: "/images/category-defining visuals/cat_men_atomiser_bottle.jpg"
  },
  { 
    id: "womens", 
    name: "Women's", 
    icon: Flower2, 
    color: "bg-rose-50 text-rose-700 hover:bg-rose-100",
    image: "/images/category-defining visuals/cat_women_floral_bottle.jpg"
  },
  { 
    id: "unisex", 
    name: "Unisex", 
    icon: Zap, 
    color: "bg-violet-50 text-violet-700 hover:bg-violet-100",
    image: "/images/category-defining visuals/cat_unisex_duo_bottles.jpg"
  },
  { 
    id: "gift-sets", 
    name: "Gift Sets", 
    icon: Gift, 
    color: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    image: null
  },
  { 
    id: "limited", 
    name: "Limited", 
    icon: Gem, 
    color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    image: null
  },
]

export function CategoryScroll() {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-4 pb-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="flex-shrink-0"
            >
              <div className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                "hover:scale-105 active:scale-95",
                category.image ? "bg-white shadow-sm" : category.color
              )}>
                {category.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                )}
                <span className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  category.image && "text-emerald-palm"
                )}>
                  {category.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}