import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if user is logged in
  if (!user) {
    redirect('/login')
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/unauthorized')
  }

  // Return children with admin-specific wrapper to ensure complete isolation
  return (
    <div className="admin-layout-wrapper">
      {children}
    </div>
  )
}