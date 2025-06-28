"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { User, Package, Heart, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
    
    if (!user) {
      router.push('/login')
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-sand flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/images/logos/Perfume Oasis Icon.png"
            alt="Loading"
            width={60}
            height={60}
            className="mx-auto mb-4 animate-pulse"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      href: "/account/details",
      description: "Manage your profile"
    },
    {
      icon: Package,
      label: "My Orders",
      href: "/account/orders",
      description: "Track your orders"
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/account/wishlist",
      description: "Your favourite items"
    },
  ]

  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-display text-emerald-palm">My Account</h1>
          <p className="text-gray-600 mt-1">Welcome back!</p>
        </div>
      </header>

      {/* User Info */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-palm/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-emerald-palm" />
            </div>
            <div>
              <p className="font-medium text-lg">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user.created_at).getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-palm/10 rounded-full flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-emerald-palm" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}