"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/hooks/use-cart"
import { useState, useEffect } from "react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/products", icon: Search, label: "Shop" },
  { href: "/cart", icon: ShoppingBag, label: "Cart" },
  { href: "/account", icon: User, label: "Account" },
]

export function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((state) => state.items.length)
  const [showAdminButton, setShowAdminButton] = useState(false)

  useEffect(() => {
    // Show admin button in development mode
    setShowAdminButton(process.env.NODE_ENV === 'development')
  }, [])

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom lg:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 tap-target relative",
                  "transition-colors duration-200",
                  isActive 
                    ? "text-emerald-palm" 
                    : "text-gray-500 hover:text-emerald-palm/70"
                )}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.label === "Cart" && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-royal-gold text-white text-xs flex items-center justify-center font-medium">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      
      {/* Admin Quick Access (Development Only) */}
      {showAdminButton && (
        <Link
          href="/admin"
          className="fixed bottom-20 right-4 z-50 bg-emerald-palm text-white rounded-full p-3 shadow-lg hover:bg-emerald-palm/90 transition-colors lg:hidden"
        >
          <Settings className="h-5 w-5" />
        </Link>
      )}
    </>
  )
}