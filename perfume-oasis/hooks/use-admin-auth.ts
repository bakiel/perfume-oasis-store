'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

export function useAdminAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          // Check if user is admin
          const adminEmails = ['admin@perfumeoasis.co.za']
          const userIsAdmin = adminEmails.includes(user.email || '') || 
                            user.user_metadata?.is_admin === true ||
                            user.user_metadata?.role === 'admin'
          
          setIsAdmin(userIsAdmin)
          
          // If on login page and user is admin, redirect to admin
          if (window.location.pathname === '/login' && userIsAdmin) {
            router.push('/admin')
          }
        } else {
          setUser(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      
      if (currentUser) {
        const adminEmails = ['admin@perfumeoasis.co.za']
        const userIsAdmin = adminEmails.includes(currentUser.email || '') || 
                          currentUser.user_metadata?.is_admin === true ||
                          currentUser.user_metadata?.role === 'admin'
        
        setIsAdmin(userIsAdmin)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return { user, loading, isAdmin }
}
