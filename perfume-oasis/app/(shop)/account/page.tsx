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
        <div className="container mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display text-emerald-palm">My Account</h1>
          <p className="text-gray-600 mt-1 md:text-lg">Welcome back!</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-4xl">
        {/* User Info */}
        <div className="bg-white rounded-lg p-6 md:p-8 mb-6 md:mb-8 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-emerald-palm/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-emerald-palm" />
            </div>
            <div>
              <p className="font-medium text-lg md:text-xl lg:text-2xl">{user.email}</p>
              <p className="text-sm md:text-base text-gray-500">Member since {new Date(user.created_at).getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 md:space-y-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-lg p-4 md:p-5 lg:p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-emerald-palm/10 rounded-full flex items-center justify-center">
                    <item.icon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-emerald-palm" />
                  </div>
                  <div>
                    <p className="font-medium text-base md:text-lg lg:text-xl">{item.label}</p>
                    <p className="text-sm md:text-base text-gray-500">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="mt-6 md:mt-8 lg:mt-10">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full h-11 md:h-12 text-sm md:text-base"
            size="lg"
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  )
}