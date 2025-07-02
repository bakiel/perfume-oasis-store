import { NextRequest, NextResponse } from 'next/server'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'

export async function POST(request: NextRequest) {
  try {
    // Test invoice data
    const testInvoiceData = {
      invoiceNumber: 'INV-TEST-001',
      orderNumber: 'PO-TEST-001',
      date: new Date().toISOString(),
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+27 12 345 6789',
        address: {
          street: '123 Test Street',
          suburb: 'Test Suburb',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2000',
        },
      },
      items: [
        {
          product_name: 'Chanel No. 5',
          product_brand: 'Chanel',
          quantity: 1,
          price: 2500,
          subtotal: 2500,
        },
        {
          product_name: 'Sauvage',
          product_brand: 'Dior',
          quantity: 2,
          price: 1800,
          subtotal: 3600,
        },
      ],
      subtotal: 6100,
      delivery: 0,
      total: 6100,
      paymentStatus: 'Pending',
      paymentMethod: 'Bank Transfer',
    }

    console.log('Generating test PDF with data:', testInvoiceData)

    // Try to generate PDF
    const pdfBuffer = await generateInvoicePDF(testInvoiceData)
    
    console.log('PDF generated successfully, buffer size:', pdfBuffer.length)

    // Convert buffer to base64 for response
    const base64PDF = pdfBuffer.toString('base64')
    
    return NextResponse.json({
      success: true,
      message: 'PDF generated successfully',
      pdfSize: pdfBuffer.length,
      pdfBase64Length: base64PDF.length,
      // Don't include the actual base64 in response to avoid size issues
      sample: base64PDF.substring(0, 100) + '...',
    })
    
  } catch (error: any) {
    console.error('Test PDF error:', error)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate PDF', 
        details: error.toString(),
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
