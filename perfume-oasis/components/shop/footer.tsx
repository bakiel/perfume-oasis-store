"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  CreditCard,
  Truck,
  Shield,
  HeadphonesIcon
} from "lucide-react"
import toast from "react-hot-toast"

function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for subscribing to our newsletter!")
      setEmail("")
      setLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-royal-gold text-white rounded-lg hover:bg-royal-gold/90 transition-colors font-medium disabled:opacity-50"
      >
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="bg-emerald-palm text-white">
      {/* Features Section */}
      <div className="bg-emerald-palm/90 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Free Shipping</span>
              <span className="text-xs opacity-80">Orders over R1,000</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">100% Authentic</span>
              <span className="text-xs opacity-80">Guaranteed genuine</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Secure Payment</span>
              <span className="text-xs opacity-80">Safe transactions</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <HeadphonesIcon className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">24/7 Support</span>
              <span className="text-xs opacity-80">Here to help</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/images/logos/Perfume Oasis Icon.png"
                alt="Perfume Oasis"
                width={50}
                height={50}
                className="h-[50px] w-[50px]"
              />
              <div>
                <h2 className="text-2xl font-display text-white">Perfume Oasis</h2>
                <p className="text-sm text-white/80 italic">Refresh your senses.</p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Your premier destination for authentic luxury fragrances in South Africa. 
              We bring you the world's finest perfumes with guaranteed authenticity and exceptional service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:opacity-80 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:opacity-80 transition-opacity">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="hover:opacity-80 transition-opacity">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-80 transition-opacity">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/special-order" className="hover:opacity-80 transition-opacity">
                  Special Orders
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:opacity-80 transition-opacity">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:opacity-80 transition-opacity">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>+27 82 480 1311</p>
                  <p className="text-xs opacity-80">Mon-Fri 9am-5pm</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:givenmoja12@gmail.com" className="hover:opacity-80 transition-opacity">
                  givenmoja12@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Moloto Street No 30</p>
                  <p>Bela Bela, Limpopo</p>
                  <p>South Africa, 0480</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-display text-lg mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-sm opacity-90 mb-4">
              Get exclusive offers and be the first to know about new arrivals
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-80">
          <p>&copy; 2025 Torrencial (Pty) Ltd. All rights reserved. | Company Registration: 2025/213013/07</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}