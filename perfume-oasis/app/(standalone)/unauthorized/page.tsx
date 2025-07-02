import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldX } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ShieldX className="h-20 w-20 text-red-500 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          You don't have permission to access this area. This section is restricted to administrators only.
        </p>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              Return to Store
            </Button>
          </Link>
          
          <Link href="/account">
            <Button variant="outline" className="w-full">
              Go to My Account
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          If you believe you should have access, please contact support at{' '}
          <a href="mailto:info@perfumeoasis.co.za" className="text-emerald-600 hover:underline">
            info@perfumeoasis.co.za
          </a>
        </p>
      </div>
    </div>
  )
}