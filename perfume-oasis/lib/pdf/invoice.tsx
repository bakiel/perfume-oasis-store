import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  Font,
} from '@react-pdf/renderer'
import { formatCurrency, formatDate } from '@/lib/utils'

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0E5C4A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  invoiceDetails: {
    marginTop: 20,
    marginBottom: 30,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: '#0E5C4A',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  col: {
    flex: 1,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0E5C4A',
    color: 'white',
    padding: 8,
    fontSize: 10,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
    fontSize: 10,
  },
  tableCol: {
    flex: 1,
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#0E5C4A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 700,
  },
  paymentInstructions: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
})

interface InvoiceProps {
  order: any
  items: any[]
}

const InvoiceDocument: React.FC<InvoiceProps> = ({ order, items }) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const deliveryFee = subtotal > 1000 ? 0 : 150
  const total = subtotal + deliveryFee

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>PERFUME OASIS</Text>
            <Text style={styles.subtitle}>Refresh your senses</Text>
          </View>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 700, color: '#0E5C4A' }}>
              INVOICE
            </Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <Text style={styles.invoiceNumber}>
            Invoice #{order.order_number}
          </Text>
          <Text>Date: {formatDate(order.created_at)}</Text>
          <Text>Payment Due: Within 7 days</Text>
        </View>

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BILL TO</Text>
          <Text>{order.customer_name}</Text>
          <Text>{order.customer_email}</Text>
          <Text>{order.customer_phone}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>
          <Text>{order.delivery_address.street}</Text>
          <Text>
            {order.delivery_address.suburb}, {order.delivery_address.city}
          </Text>
          <Text>
            {order.delivery_address.province}, {order.delivery_address.postal_code}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol, { flex: 3 }]}>ITEM</Text>
            <Text style={styles.tableCol}>QTY</Text>
            <Text style={styles.tableCol}>PRICE</Text>
            <Text style={styles.tableCol}>TOTAL</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, { flex: 3 }]}>
                {item.product_brand} - {item.product_name}
              </Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>{formatCurrency(item.price)}</Text>
              <Text style={styles.tableCol}>{formatCurrency(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalLabel}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery</Text>
            <Text style={styles.totalLabel}>
              {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
            </Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 8 }]}>
            <Text style={[styles.totalAmount, { fontSize: 16 }]}>TOTAL DUE</Text>
            <Text style={[styles.totalAmount, { fontSize: 16, color: '#0E5C4A' }]}>
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        {/* Payment Instructions */}
        <View style={styles.paymentInstructions}>
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
            PAYMENT INSTRUCTIONS
          </Text>
          <Text style={{ marginBottom: 8 }}>
            Please make payment via bank transfer to:
          </Text>
          <Text>Bank: Standard Bank</Text>
          <Text>Account Name: Perfume Oasis (Pty) Ltd</Text>
          <Text>Account Number: 123 456 7890</Text>
          <Text>Branch Code: 051001</Text>
          <Text style={{ marginTop: 8 }}>
            Reference: {order.order_number}
          </Text>
          <Text style={{ marginTop: 8, fontStyle: 'italic' }}>
            Please email proof of payment to: orders@perfumeoasis.co.za
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Perfume Oasis (Pty) Ltd | www.perfumeoasis.co.za | orders@perfumeoasis.co.za
        </Text>
      </Page>
    </Document>
  )
}

export async function generateInvoice(order: any, items: any[]): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <InvoiceDocument order={order} items={items} />
  )
  return buffer
}

export async function generateInvoicePDF(invoiceData: any): Promise<Buffer> {
  // Format order data for the invoice component
  const orderData = {
    order_number: invoiceData.orderNumber,
    customer_name: invoiceData.customer.name,
    customer_email: invoiceData.customer.email,
    customer_phone: invoiceData.customer.phone,
    delivery_address: invoiceData.customer.address,
    created_at: invoiceData.date,
  }
  
  return generateInvoice(orderData, invoiceData.items)
}