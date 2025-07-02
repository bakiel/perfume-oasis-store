'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export function AdminQuickAccess() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const adminEmails = ['admin@perfumeoasis.co.za']
        const userIsAdmin = adminEmails.includes(user.email || '') || 
                          user.user_metadata?.is_admin === true ||
                          user.user_metadata?.role === 'admin'
        setIsAdmin(userIsAdmin)
      }
    }
    checkAdminStatus()
  }, [])
  
  // Show the admin button only if user is admin or if clicked 3 times
  const handleMultiClick = () => {
    if (clickCount >= 2) {
      setIsVisible(true)
    }
    setClickCount(prev => prev + 1)
  }
  
  const [clickCount, setClickCount] = useState(0)
  
  if (!isVisible && !isAdmin) {
    return (
      <div 
        className="fixed bottom-4 left-4 w-4 h-4 cursor-pointer z-50"
        onClick={handleMultiClick}
        title="Admin access"
      />
    )
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Link
        href="/login"
        className="flex items-center gap-2 bg-emerald-palm text-white px-4 py-2 rounded-full shadow-lg hover:bg-emerald-palm/90 transition-all"
      >
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Admin Access</span>
      </Link>
    </div>
  )
}
