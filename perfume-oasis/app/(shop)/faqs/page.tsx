import { ChevronDown } from 'lucide-react'

export default function FAQsPage() {
  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          q: "How much does shipping cost?",
          a: "We charge a flat rate of R150 for shipping anywhere in South Africa. Orders over R1,000 qualify for FREE shipping!"
        },
        {
          q: "How long does delivery take?",
          a: "We use Courier Guy for all deliveries. Orders typically arrive within 2-5 business days for major centers and 3-7 business days for outlying areas."
        },
        {
          q: "Can I track my order?",
          a: "Yes! Once your order is shipped, you'll receive a tracking number via email. You can also track your order in your account dashboard."
        },
        {
          q: "Do you ship internationally?",
          a: "Currently, we only ship within South Africa. We're working on expanding our shipping to neighboring countries soon!"
        }
      ]
    },
    {
      category: "Products & Authenticity",
      questions: [
        {
          q: "Are your perfumes authentic?",
          a: "Absolutely! We guarantee 100% authentic products. All our fragrances are sourced directly from authorized distributors and come with original packaging."
        },
        {
          q: "Why are your prices lower than retail stores?",
          a: "As an online-only retailer, we have lower overhead costs than traditional stores. We pass these savings directly to our customers while maintaining product authenticity."
        },
        {
          q: "Do you sell testers?",
          a: "Yes, we occasionally have tester bottles available at discounted prices. Testers are 100% authentic and contain the same fragrance as retail bottles, just without the fancy packaging."
        },
        {
          q: "How should I store my perfumes?",
          a: "Store perfumes in a cool, dry place away from direct sunlight. Avoid bathroom storage due to humidity. A bedroom dresser or closet shelf is ideal."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 14-day return policy for unopened, unused products in their original packaging. Unfortunately, we cannot accept returns on opened fragrances for hygiene reasons."
        },
        {
          q: "How do I return an item?",
          a: "Contact us at returns@perfumeoasis.co.za with your order number. We'll provide you with return instructions and a return shipping address."
        },
        {
          q: "When will I receive my refund?",
          a: "Once we receive and inspect your return, we'll process your refund within 5-7 business days. The refund will be credited to your original payment method."
        },
        {
          q: "What if I received a damaged item?",
          a: "Please contact us immediately at support@perfumeoasis.co.za with photos of the damage. We'll arrange for a replacement or full refund at no cost to you."
        }
      ]
    },
    {
      category: "Payment & Security",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We currently accept bank transfers (EFT). After placing your order, you'll receive our banking details to complete the payment."
        },
        {
          q: "Is my personal information secure?",
          a: "Yes! We use industry-standard encryption to protect your personal information. We never store payment details and comply with POPIA regulations."
        },
        {
          q: "How do I pay via EFT?",
          a: "After checkout, you'll receive an email with our bank details and your order number. Use your order number as the payment reference and email proof of payment to orders@perfumeoasis.co.za."
        },
        {
          q: "When will my order be processed?",
          a: "Orders are processed within 24 hours of receiving payment confirmation. You'll receive a shipping notification once your order is on its way."
        }
      ]
    },
    {
      category: "Account & General",
      questions: [
        {
          q: "Do I need an account to place an order?",
          a: "No, we offer guest checkout. However, creating an account allows you to track orders, save addresses, and view your order history."
        },
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page. Enter your email address and we'll send you a link to reset your password."
        },
        {
          q: "Can I change or cancel my order?",
          a: "Please contact us immediately at orders@perfumeoasis.co.za. We can modify or cancel orders that haven't been shipped yet."
        },
        {
          q: "Do you have a physical store?",
          a: "We're an online-only retailer, which allows us to offer better prices. All orders are shipped from our Johannesburg warehouse."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-emerald-900 mb-4">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex justify-between items-start cursor-pointer list-none">
                        <span className="font-medium text-gray-900 pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <p className="mt-3 text-gray-600 pr-8">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-700 mb-4">
            We're here to help! Contact our customer support team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@perfumeoasis.co.za"
              className="inline-flex items-center justify-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white transition-colors"
            >
              Email Support
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}