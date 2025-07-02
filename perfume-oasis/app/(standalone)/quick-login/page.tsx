"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function QuickLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const quickLogin = async () => {
    setLoading(true)
    
    try {
      // Try to sign in first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@perfumeoasis.co.za',
        password: 'test123456'
      })
      
      if (error) {
        // If sign in fails, create the account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'test@perfumeoasis.co.za',
          password: 'test123456',
          options: {
            data: {
              first_name: 'Test',
              last_name: 'User'
            }
          }
        })
        
        if (signUpError) {
          toast.error('Failed to create test account: ' + signUpError.message)
          return
        }
        
        // Try to sign in again
        const { error: signInError2 } = await supabase.auth.signInWithPassword({
          email: 'test@perfumeoasis.co.za',
          password: 'test123456'
        })
        
        if (signInError2) {
          toast.error('Account created but sign in failed')
          return
        }
      }
      
      toast.success('Signed in successfully!')
      router.push('/checkout')
      
    } catch (error) {
      console.error('Quick login error:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#F6F3EF] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-emerald-palm mb-4">Quick Test Login</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to quickly sign in with a test account and proceed to checkout.
        </p>
        
        <Button 
          onClick={quickLogin}
          disabled={loading}
          className="w-full bg-emerald-palm hover:bg-emerald-palm/90"
        >
          <span>{loading ? 'Signing in...' : 'Quick Login & Go to Checkout'}</span>
        </Button>
        
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">
            <strong>Test Credentials:</strong><br />
            Email: test@perfumeoasis.co.za<br />
            Password: test123456
          </p>
        </div>
      </div>
    </div>
  )
}