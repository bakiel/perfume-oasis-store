import { Shield, Lock, Eye, UserCheck, Mail, Server, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-soft-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-display text-emerald-palm">Privacy Policy</h1>
          <p className="text-gray-600 mt-1">Last updated: June 2025</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-palm" />
              Your Privacy Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-gray-600">
            <p>
              At Perfume Oasis (operated by Torrencial (Pty) Ltd), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-palm" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Personal Information</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Name and surname</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment provider)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Automatically Collected Information</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-palm" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your questions and provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and customer experience</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-palm" />
              Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Service Providers:</strong> Companies that help us operate our business (e.g., Courier Guy for shipping)</li>
              <li><strong>Payment Processors:</strong> Secure payment gateway providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-palm" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>SSL encryption for all data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by authorized personnel only</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-palm" />
              Your Rights (POPIA Compliance)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>Under the Protection of Personal Information Act (POPIA), you have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request restriction of processing</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at givenmoja12@gmail.com
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-palm" />
              Cookies and Tracking Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie preferences through your browser settings. Essential cookies required for the website to function cannot be disabled.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-emerald-palm" />
              Changes to This Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="bg-emerald-palm/10 rounded-lg p-6 text-center">
          <h3 className="font-display text-lg text-emerald-palm mb-2">
            Questions About Our Privacy Policy?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have any questions or concerns about our privacy practices, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Torrencial (Pty) Ltd</strong></p>
            <p>Email: givenmoja12@gmail.com</p>
            <p>Phone: +27 82 480 1311</p>
            <p>Address: Moloto Street No 30, Bela Bela, Limpopo, 0480</p>
          </div>
        </div>
      </div>
    </div>
  )
}