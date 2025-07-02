import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-soft-sand lg:grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Logo for mobile/tablet */}
          <Link href="/" className="flex items-center justify-center mb-8 lg:hidden">
            <h1 className="text-2xl md:text-3xl font-display text-emerald-palm">
              Perfume Oasis
            </h1>
          </Link>
          {children}
        </div>
      </div>
      
      {/* Right side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex bg-emerald-palm text-white">
        <div className="flex flex-col justify-center p-12 xl:p-16 w-full">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-4xl xl:text-5xl font-display">
              Perfume Oasis
            </h1>
          </Link>
          
          <div className="space-y-6">
            <h2 className="text-2xl xl:text-3xl font-light">
              Discover Your Signature Scent
            </h2>
            <p className="text-lg xl:text-xl opacity-90 leading-relaxed">
              Join thousands of fragrance enthusiasts who have found their perfect match. 
              From timeless classics to modern masterpieces.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl xl:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm xl:text-base opacity-80">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl xl:text-4xl font-bold mb-2">100%</div>
              <div className="text-sm xl:text-base opacity-80">Authentic Luxury</div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="mt-16 relative h-64 opacity-20">
            <Image
              src="/images/bottle-silhouette.png"
              alt="Perfume bottle"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}