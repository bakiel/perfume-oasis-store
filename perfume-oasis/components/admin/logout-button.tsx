"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Clear local storage first
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      toast.success('Logged out successfully')
      
      // Force a hard refresh to clear all state
      window.location.href = '/login'
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4 mr-2 shrink-0" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}