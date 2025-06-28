"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Heart,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'

export function StoreHeader() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const cartItems = useCartStore(state => state.getTotalItems())
  const toggleCart = useCartStore(state => state.toggleCart)
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }
  
  const categories = [
    { name: "Women's Fragrances", href: '/products?gender=women' },
    { name: "Men's Fragrances", href: '/products?gender=men' },
    { name: "Unisex Fragrances", href: '/products?gender=unisex' },
    { name: "All Products", href: '/products' }
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-emerald-palm to-emerald-palm/90 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-light">Free shipping on orders over R1,000 | Authentic fragrances guaranteed</p>
        </div>
      </div>
      
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logos/Perfume Oasis Icon.png"
                alt="Perfume Oasis"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-display text-xl text-emerald-palm hidden sm:block">
                Perfume Oasis
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <Link href="/products" className="flex items-center gap-1 py-2 hover:text-emerald-palm transition-colors">
                  Shop
                  <ChevronDown className="h-4 w-4" />
                </Link>
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-4 py-2 hover:bg-gray-50 hover:text-emerald-palm"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/brands" className="hover:text-emerald-palm transition-colors">
                Brands
              </Link>
              <Link href="/new-arrivals" className="hover:text-emerald-palm transition-colors">
                New Arrivals
              </Link>
              <Link href="/sale" className="hover:text-emerald-palm transition-colors text-red-500">
                Sale
              </Link>
            </nav>
            
            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link href="/wishlist" className="hidden sm:inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/account">
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-palm text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className={cn(
          "absolute top-full left-0 right-0 bg-white border-b transition-all duration-300 z-30",
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}>
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                placeholder="Search for fragrances, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                autoFocus
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden absolute top-full left-0 right-0 bg-white border-b transition-all duration-300",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}>
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/products"
              className="block py-2 hover:text-emerald-palm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <div className="pl-4 space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block py-2 hover:text-emerald-palm text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link
              href="/brands"
              className="block py-2 hover:text-emerald-palm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>
            <Link
              href="/new-arrivals"
              className="block py-2 hover:text-emerald-palm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/sale"
              className="block py-2 text-red-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sale
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}