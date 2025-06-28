'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-emerald-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/images/logos/Perfume Oasis Icon.png"
              alt="Perfume Oasis"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <span className="text-xl font-display text-gold-400 hidden sm:block">
              Perfume Oasis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-gold-400 hover:text-gold-300 font-medium">
              Shop
            </Link>
            <Link href="/brands" className="text-gold-400 hover:text-gold-300 font-medium">
              Brands
            </Link>
            <Link href="/men" className="text-gold-400 hover:text-gold-300 font-medium">
              Men
            </Link>
            <Link href="/women" className="text-gold-400 hover:text-gold-300 font-medium">
              Women
            </Link>
            <Link href="/about" className="text-gold-400 hover:text-gold-300 font-medium">
              About
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gold-400 hover:text-gold-300">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gold-400 hover:text-gold-300">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gold-400 hover:text-gold-300 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gold-400 text-emerald-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                0
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-gold-400 hover:text-gold-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-800 border-t border-emerald-700">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/shop" className="block py-2 text-gold-400 hover:text-gold-300">Shop</Link>
            <Link href="/brands" className="block py-2 text-gold-400 hover:text-gold-300">Brands</Link>
            <Link href="/men" className="block py-2 text-gold-400 hover:text-gold-300">Men</Link>
            <Link href="/women" className="block py-2 text-gold-400 hover:text-gold-300">Women</Link>
            <Link href="/about" className="block py-2 text-gold-400 hover:text-gold-300">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
}