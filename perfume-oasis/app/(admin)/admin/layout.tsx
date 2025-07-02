"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  Tag,
  Layers,
  PackageCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/admin/logout-button"

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Orders', href: '/admin/orders', icon: Package },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Inventory', href: '/admin/inventory', icon: PackageCheck },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin wrapper with proper flex layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out lg:static lg:transform-none lg:block`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-palm rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-display text-xl text-emerald-palm">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-palm text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-palm/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-emerald-palm font-semibold">A</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@perfumeoasis.co.za</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 shadow-sm lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-1 justify-center">
              <span className="font-display text-xl text-emerald-palm">
                Perfume Oasis Admin
              </span>
            </div>
            {/* Spacer for centering */}
            <div className="w-6" />
          </div>

          {/* Page content with proper scroll container */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}