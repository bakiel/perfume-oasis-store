import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function createPdfWithRetry(element: HTMLElement, maxRetries: number = 3): Promise<Blob> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`PDF generation attempt ${attempt}/${maxRetries}`)
      
      // Wait a bit before each attempt
      if (attempt > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
      
      // Generate canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      
      // Convert to blob
      const blob = pdf.output('blob')
      console.log(`PDF generated successfully: ${Math.round(blob.size / 1024)} KB`)
      
      return blob
    } catch (error) {
      lastError = error as Error
      console.error(`PDF generation attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to generate PDF after ${maxRetries} attempts: ${lastError?.message}`)
      }
    }
  }
  
  throw lastError || new Error('PDF generation failed')
}

export async function downloadHtml(element: HTMLElement, filename: string): Promise<void> {
  try {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement
    
    // Create a complete HTML document
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${filename}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .bg-emerald-palm { background-color: #0E5C4A; }
    .text-emerald-palm { color: #0E5C4A; }
    .text-white { color: white; }
    .font-bold { font-weight: bold; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-3xl { font-size: 1.875rem; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .border-b { border-bottom: 1px solid #e5e5e5; }
    .border-t { border-top: 1px solid #e5e5e5; }
    .bg-gray-50 { background-color: #f9fafb; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .rounded { border-radius: 0.375rem; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .gap-8 { gap: 2rem; }
    .gap-2 { gap: 0.5rem; }
    .col-span-2 { grid-column: span 2; }
    .w-full { width: 100%; }
    .w-64 { width: 16rem; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .justify-end { justify-content: flex-end; }
    .items-start { align-items: flex-start; }
    table { border-collapse: collapse; }
    @media print {
      body { margin: 0; }
    }
  </style>
</head>
<body>
  ${clone.innerHTML}
</body>
</html>`
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading HTML:', error)
    throw error
  }
}