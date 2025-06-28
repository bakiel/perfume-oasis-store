"use client"

import { useState, useEffect } from "react"
import { 
  Save,
  Store,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Percent,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

interface Settings {
  store_name: string
  store_email: string
  store_phone: string
  store_address: {
    street: string
    city: string
    province: string
    postal_code: string
  }
  bank_details: {
    bank_name: string
    account_name: string
    account_number: string
    branch_code: string
    account_type: string
  }
  shipping_fee: number
  free_shipping_threshold: number
  tax_rate: number
  low_stock_threshold: number
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    store_name: 'Perfume Oasis',
    store_email: 'info@perfumeoasis.co.za',
    store_phone: '+27 11 123 4567',
    store_address: {
      street: '123 Fragrance Avenue',
      city: 'Johannesburg',
      province: 'Gauteng',
      postal_code: '2000'
    },
    bank_details: {
      bank_name: 'First National Bank',
      account_name: 'Perfume Oasis (Pty) Ltd',
      account_number: '62891234567',
      branch_code: '250655',
      account_type: 'Business Cheque Account'
    },
    shipping_fee: 150,
    free_shipping_threshold: 1000,
    tax_rate: 0.15,
    low_stock_threshold: 10
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')

    if (!error && data) {
      const newSettings = { ...settings }
      
      data.forEach(setting => {
        switch (setting.key) {
          case 'store_name':
            newSettings.store_name = setting.value.value
            break
          case 'store_email':
            newSettings.store_email = setting.value.value
            break
          case 'store_phone':
            newSettings.store_phone = setting.value.value
            break
          case 'store_address':
            newSettings.store_address = setting.value.value
            break
          case 'bank_details':
            newSettings.bank_details = setting.value
            break
          case 'shipping_fee':
            newSettings.shipping_fee = setting.value.value
            break
          case 'free_shipping_threshold':
            newSettings.free_shipping_threshold = setting.value.value
            break
          case 'tax_rate':
            newSettings.tax_rate = setting.value.value
            break
          case 'low_stock_threshold':
            newSettings.low_stock_threshold = setting.value.value
            break
        }
      })
      
      setSettings(newSettings)
    }
    
    setLoading(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    const supabase = createClient()
    
    const updates = [
      { key: 'store_name', value: { value: settings.store_name } },
      { key: 'store_email', value: { value: settings.store_email } },
      { key: 'store_phone', value: { value: settings.store_phone } },
      { key: 'store_address', value: { value: settings.store_address } },
      { key: 'bank_details', value: settings.bank_details },
      { key: 'shipping_fee', value: { value: settings.shipping_fee } },
      { key: 'free_shipping_threshold', value: { value: settings.free_shipping_threshold } },
      { key: 'tax_rate', value: { value: settings.tax_rate } },
      { key: 'low_stock_threshold', value: { value: settings.low_stock_threshold } }
    ]

    let hasError = false
    
    for (const update of updates) {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: update.key,
          value: update.value,
          updated_at: new Date().toISOString()
        })
        .eq('key', update.key)

      if (error) {
        hasError = true
        console.error(`Failed to update ${update.key}:`, error)
      }
    }

    if (hasError) {
      toast.error('Some settings failed to save')
    } else {
      toast.success('Settings saved successfully')
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-palm mx-auto"></div>
      </div>
    )
  }

  const provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Western Cape'
  ]

  const banks = [
    'ABSA',
    'Capitec',
    'Discovery Bank',
    'First National Bank',
    'Investec',
    'Nedbank',
    'Standard Bank',
    'TymeBank'
  ]

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display text-emerald-palm mb-2">
          Settings
        </h1>
        <p className="text-gray-600">Manage your store configuration</p>
      </div>

      <div className="space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="h-5 w-5 text-emerald-palm" />
            <h2 className="text-lg font-semibold">Store Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({...settings, store_name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={settings.store_email}
                  onChange={(e) => setSettings({...settings, store_email: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={settings.store_phone}
                  onChange={(e) => setSettings({...settings, store_phone: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Store Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-5 w-5 text-emerald-palm" />
            <h2 className="text-lg font-semibold">Store Address</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <input
                type="text"
                value={settings.store_address.street}
                onChange={(e) => setSettings({
                  ...settings,
                  store_address: {...settings.store_address, street: e.target.value}
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={settings.store_address.city}
                  onChange={(e) => setSettings({
                    ...settings,
                    store_address: {...settings.store_address, city: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Province</label>
                <select
                  value={settings.store_address.province}
                  onChange={(e) => setSettings({
                    ...settings,
                    store_address: {...settings.store_address, province: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                >
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  value={settings.store_address.postal_code}
                  onChange={(e) => setSettings({
                    ...settings,
                    store_address: {...settings.store_address, postal_code: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-5 w-5 text-emerald-palm" />
            <h2 className="text-lg font-semibold">Bank Details</h2>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                These bank details will appear on customer invoices for bank transfer payments.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bank Name</label>
              <select
                value={settings.bank_details.bank_name}
                onChange={(e) => setSettings({
                  ...settings,
                  bank_details: {...settings.bank_details, bank_name: e.target.value}
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              >
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Account Type</label>
              <select
                value={settings.bank_details.account_type}
                onChange={(e) => setSettings({
                  ...settings,
                  bank_details: {...settings.bank_details, account_type: e.target.value}
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              >
                <option value="Business Cheque Account">Business Cheque Account</option>
                <option value="Business Savings Account">Business Savings Account</option>
                <option value="Current Account">Current Account</option>
                <option value="Savings Account">Savings Account</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Account Name</label>
              <input
                type="text"
                value={settings.bank_details.account_name}
                onChange={(e) => setSettings({
                  ...settings,
                  bank_details: {...settings.bank_details, account_name: e.target.value}
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                value={settings.bank_details.account_number}
                onChange={(e) => setSettings({
                  ...settings,
                  bank_details: {...settings.bank_details, account_number: e.target.value}
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Branch Code</label>
              <input
                type="text"
                value={settings.bank_details.branch_code}
                onChange={(e) => setSettings({
                  ...settings,
                  bank_details: {...settings.bank_details, branch_code: e.target.value}
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="h-5 w-5 text-emerald-palm" />
            <h2 className="text-lg font-semibold">Shipping & Tax</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Standard Shipping Fee (ZAR)</label>
              <input
                type="number"
                value={settings.shipping_fee}
                onChange={(e) => setSettings({...settings, shipping_fee: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                min="0"
                step="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Free Shipping Threshold (ZAR)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({...settings, free_shipping_threshold: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                min="0"
                step="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">VAT Rate (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={settings.tax_rate * 100}
                  onChange={(e) => setSettings({...settings, tax_rate: (parseFloat(e.target.value) || 0) / 100})}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
              <input
                type="number"
                value={settings.low_stock_threshold}
                onChange={(e) => setSettings({...settings, low_stock_threshold: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-palm/20"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={saveSettings}
            disabled={saving}
            size="lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}