import Link from 'next/link'
import Image from 'next/image'
import { 
  Facebook, 
  Instagram, 
  Twitter,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react'

export function StoreFooter() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    shop: [
      { name: "Women's Fragrances", href: '/products?gender=women' },
      { name: "Men's Fragrances", href: '/products?gender=men' },
      { name: "Unisex Fragrances", href: '/products?gender=unisex' },
      { name: 'New Arrivals', href: '/new-arrivals' },
      { name: 'Sale', href: '/sale' }
    ],
    customer: [
      { name: 'My Account', href: '/account' },
      { name: 'Order Tracking', href: '/account/orders' },
      { name: 'Wishlist', href: '/wishlist' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Shipping Policy', href: '/shipping-policy' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' }
    ]
  }
  
  const features = [
    { icon: Truck, text: 'Free Shipping over R1,000' },
    { icon: Shield, text: '100% Authentic' },
    { icon: RefreshCw, text: '30-Day Returns' },
    { icon: CreditCard, text: 'Secure Payment' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-royal-gold flex-shrink-0" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/perfume-oasis-icon-favicon.png"
                alt="Perfume Oasis"
                width={40}
                height={40}
              />
              <span className="font-display text-xl">Perfume Oasis</span>
            </div>
            <p className="text-sm text-gray-400">
              Your destination for authentic luxury fragrances in South Africa. 
              Discover your signature scent from our curated collection.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-royal-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-royal-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-royal-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  123 Fragrance Avenue<br />
                  Johannesburg, Gauteng 2000<br />
                  South Africa
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+27111234567" className="hover:text-white transition-colors">
                  +27 11 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@perfumeoasis.co.za" className="hover:text-white transition-colors">
                  info@perfumeoasis.co.za
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Perfume Oasis. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}