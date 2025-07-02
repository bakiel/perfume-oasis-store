import React from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface InvoiceTemplateProps {
  order: any
  invoiceRef: React.RefObject<HTMLDivElement>
}

export function InvoiceTemplate({ order, invoiceRef }: InvoiceTemplateProps) {
  const deliveryAddress = typeof order.delivery_address === 'string' 
    ? JSON.parse(order.delivery_address) 
    : order.delivery_address

  const subtotal = order.order_items?.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0) || 0
  
  return (
    <div ref={invoiceRef} className="bg-white p-8" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-palm mb-2">PERFUME OASIS</h1>
          <p className="text-sm text-gray-600">Refresh your senses</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-emerald-palm mb-2">INVOICE</h2>
          <p className="text-sm">Invoice #: {order.invoice_number}</p>
          <p className="text-sm">Date: {formatDate(order.created_at)}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-emerald-palm mb-2">BILL TO</h3>
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-sm">{order.customer_email}</p>
          <p className="text-sm">{order.customer_phone}</p>
        </div>
        <div>
          <h3 className="font-bold text-emerald-palm mb-2">SHIP TO</h3>
          <p className="text-sm">{deliveryAddress.street}</p>
          <p className="text-sm">{deliveryAddress.suburb}, {deliveryAddress.city}</p>
          <p className="text-sm">{deliveryAddress.province}, {deliveryAddress.postal_code}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-emerald-palm text-white">
              <th className="p-3 text-left">ITEM</th>
              <th className="p-3 text-center">QTY</th>
              <th className="p-3 text-right">PRICE</th>
              <th className="p-3 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="p-3">
                  <p className="font-medium">{item.product?.brand?.name || 'Unknown Brand'}</p>
                  <p className="text-sm text-gray-600">{item.product?.name || 'Product'}</p>
                </td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                <td className="p-3 text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span>{order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>TOTAL DUE</span>
            <span className="text-emerald-palm">{formatCurrency(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gray-50 p-6 rounded">
        <h3 className="font-bold text-emerald-palm mb-3">PAYMENT INSTRUCTIONS</h3>
        <p className="mb-3 text-sm">Please make payment via bank transfer to:</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="font-medium">Bank:</span> Standard Bank</p>
          <p><span className="font-medium">Account Name:</span> Perfume Oasis (Pty) Ltd</p>
          <p><span className="font-medium">Account Number:</span> 123 456 7890</p>
          <p><span className="font-medium">Branch Code:</span> 051001</p>
          <p className="col-span-2"><span className="font-medium">Reference:</span> {order.order_number}</p>
        </div>
        <p className="mt-3 text-sm italic">Please email proof of payment to: orders@perfumeoasis.co.za</p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
        <p>Perfume Oasis (Pty) Ltd | www.perfumeoasis.co.za | orders@perfumeoasis.co.za</p>
      </div>
    </div>
  )
}