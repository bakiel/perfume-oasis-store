"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock } from "lucide-react"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Welcome back!")
        router.push("/account")
        router.refresh()
      }
    } catch (error) {
      toast.error("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card className="border-0 shadow-xl md:shadow-2xl">
      <CardHeader className="space-y-1 p-6 md:p-8">
        <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-display text-emerald-palm">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 md:space-y-6 p-6 md:p-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 md:pl-12 h-11 md:h-12 text-sm md:text-base"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 md:pl-12 h-11 md:h-12 text-sm md:text-base"
                required
              />
            </div>
          </div>
          <div className="text-sm">
            <Link 
              href="/forgot-password" 
              className="text-emerald-palm hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 p-6 md:p-8">
          <Button 
            type="submit" 
            className="w-full h-11 md:h-12 text-sm md:text-base"
            size="lg"
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </Button>
          <p className="text-xs md:text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link 
              href="/register" 
              className="text-emerald-palm hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}