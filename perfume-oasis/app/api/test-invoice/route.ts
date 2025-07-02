import { NextRequest, NextResponse } from 'next/server'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'

export async function GET(request: NextRequest) {
  try {
    // Test invoice data
    const testData = {
      invoiceNumber: 'TEST-001',
      orderNumber: 'PO-TEST-001',
      date: new Date().toISOString(),
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '0123456789',
        address: {
          street: '123 Test Street',
          suburb: 'Test Suburb',
          city: 'Test City',
          province: 'Test Province',
          postalCode: '1234',
        },
      },
      items: [
        {
          product_name: 'Test Product',
          product_brand: 'Test Brand',
          quantity: 1,
          price: 999,
          subtotal: 999,
        },
      ],
      subtotal: 999,
      delivery: 0,
      total: 999,
      paymentStatus: 'Pending',
      paymentMethod: 'Bank Transfer',
    }

    console.log('Generating test PDF...')
    const pdfBuffer = await generateInvoicePDF(testData)
    console.log('PDF generated, size:', pdfBuffer.length)

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-invoice.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Test invoice error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate test invoice' },
      { status: 500 }
    )
  }
}