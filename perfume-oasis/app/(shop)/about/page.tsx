import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Award,
  Users,
  Globe,
  Heart
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display text-emerald-palm">About Us</h1>
              <p className="text-gray-600 text-sm">Our story and mission</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-64 md:h-96">
        <Image
          src="/images/banners/PO-horizontal-banner-luxury-gradient.jpg"
          alt="Perfume Oasis Story"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display mb-4">
              Refresh Your Senses
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Bringing authentic luxury fragrances to South Africa since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Our Story */}
        <section className="mb-12">
          <h3 className="text-2xl font-display text-emerald-palm mb-6 text-center">
            Our Story
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Perfume Oasis was born from a passion for exceptional fragrances and a vision to make 
              authentic luxury perfumes accessible to South African fragrance enthusiasts. What started 
              as a small boutique in Sandton has grown into South Africa's trusted destination for 
              genuine designer and niche fragrances.
            </p>
            <p>
              We believe that fragrance is personal – it's an expression of who you are, a memory 
              captured in a bottle, and a daily luxury that everyone deserves. That's why we've 
              curated a collection that spans from timeless classics to contemporary masterpieces, 
              ensuring there's a perfect scent for every individual and occasion.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h3 className="text-2xl font-display text-emerald-palm mb-8 text-center">
            Our Values
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-emerald-palm" />
              </div>
              <h4 className="font-medium text-lg mb-2">Authenticity Guaranteed</h4>
              <p className="text-gray-600">
                We source directly from authorized distributors, ensuring every fragrance 
                is 100% authentic. Your trust is our most valuable asset.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-palm" />
              </div>
              <h4 className="font-medium text-lg mb-2">Customer First</h4>
              <p className="text-gray-600">
                From personalized recommendations to after-sales support, we're committed 
                to making your fragrance journey exceptional.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-emerald-palm" />
              </div>
              <h4 className="font-medium text-lg mb-2">Global Selection</h4>
              <p className="text-gray-600">
                We bring the world's finest fragrances to your doorstep, from Parisian 
                haute parfumerie to Middle Eastern oud masterpieces.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-palm/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-emerald-palm" />
              </div>
              <h4 className="font-medium text-lg mb-2">Passion for Perfume</h4>
              <p className="text-gray-600">
                Our team consists of fragrance enthusiasts who live and breathe perfume, 
                ready to share their knowledge and help you find your signature scent.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-lg overflow-hidden min-h-[400px]">
          <Image
            src="/images/backgrounds/forest-cta-2.jpg"
            alt="Enchanted forest background"
            fill
            className="object-cover"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-emerald-900/70 backdrop-blur-sm" />
          <div className="relative z-10 p-8 text-center">
            <h3 className="text-2xl font-display text-white mb-4">
              Ready to Find Your Signature Scent?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Explore our carefully curated collection of authentic luxury fragrances. 
              Whether you're looking for a daily signature or a special occasion scent, 
              we're here to help you discover the perfect fragrance.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-semibold">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}