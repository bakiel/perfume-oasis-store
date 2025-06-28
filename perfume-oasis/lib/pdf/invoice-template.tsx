import React from 'react'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  Font
} from '@react-pdf/renderer'
import { format } from 'date-fns'

// Register fonts (you can add custom fonts here)
Font.register({
  family: 'Helvetica-Bold',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2'
})

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #0E5C4A',
    paddingBottom: 20
  },
  logo: {
    width: 150,
    marginBottom: 10
  },
  companyInfo: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.5
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0E5C4A',
    marginBottom: 20,
    textAlign: 'center'
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0E5C4A',
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    fontSize: 10,
    color: '#666666',
    width: 100
  },
  value: {
    fontSize: 10,
    color: '#333333',
    flex: 1
  },
  table: {
    marginTop: 20,
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0E5C4A',
    padding: 10,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    padding: 10,
    fontSize: 10
  },
  tableCol1: { flex: 3 },
  tableCol2: { flex: 1, textAlign: 'center' },
  tableCol3: { flex: 1, textAlign: 'right' },
  tableCol4: { flex: 1, textAlign: 'right' },
  totals: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: '2px solid #0E5C4A'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5
  },
  totalLabel: {
    fontSize: 12,
    marginRight: 20,
    width: 100,
    textAlign: 'right'
  },
  totalValue: {
    fontSize: 12,
    width: 100,
    textAlign: 'right'
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #cccccc'
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0E5C4A'
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0E5C4A'
  },
  bankDetails: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 5
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
    borderTop: '1px solid #eeeeee',
    paddingTop: 20
  },
  note: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFF9E6',
    borderRadius: 5,
    fontSize: 10,
    color: '#666666'
  },
  badge: {
    backgroundColor: '#C8A95B',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    width: 150
  }
})

interface InvoiceData {
  orderNumber: string
  orderDate: Date
  customer: {
    name: string
    email: string
    phone?: string
    address: {
      street: string
      city: string
      province: string
      postalCode: string
    }
  }
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  bankDetails?: {
    bankName: string
    accountName: string
    accountNumber: string
    branchCode: string
    reference: string
  }
}

export const InvoiceTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
  const formatCurrency = (amount: number) => `R ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0E5C4A' }}>
                PERFUME OASIS
              </Text>
              <Text style={styles.companyInfo}>
                Luxury Fragrances for South Africa{'\n'}
                123 Fragrance Avenue{'\n'}
                Johannesburg, Gauteng 2000{'\n'}
                Tel: +27 11 123 4567{'\n'}
                Email: info@perfumeoasis.co.za
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.badge}>
                <Text>TAX INVOICE</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#666666' }}>
                VAT No: 4590123456
              </Text>
            </View>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
              {data.customer.name}
            </Text>
            <Text style={{ fontSize: 10, color: '#666666', lineHeight: 1.5 }}>
              {data.customer.address.street}{'\n'}
              {data.customer.address.city}, {data.customer.address.province}{'\n'}
              {data.customer.address.postalCode}{'\n'}
              {data.customer.email}{'\n'}
              {data.customer.phone}
            </Text>
          </View>
          
          <View style={{ width: 200 }}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice No:</Text>
              <Text style={styles.value}>{data.orderNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{format(data.orderDate, 'dd MMM yyyy')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{data.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Qty</Text>
            <Text style={styles.tableCol3}>Unit Price</Text>
            <Text style={styles.tableCol4}>Amount</Text>
          </View>
          
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol1}>{item.name}</Text>
              <Text style={styles.tableCol2}>{item.quantity}</Text>
              <Text style={styles.tableCol3}>{formatCurrency(item.price)}</Text>
              <Text style={styles.tableCol4}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalValue}>
              {data.shipping === 0 ? 'FREE' : formatCurrency(data.shipping)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT (15%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.tax)}</Text>
          </View>
          
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={[styles.totalLabel, styles.grandTotalLabel]}>Total Due:</Text>
            <Text style={[styles.totalValue, styles.grandTotalValue]}>
              {formatCurrency(data.total)}
            </Text>
          </View>
        </View>

        {/* Bank Details */}
        {data.bankDetails && (
          <View style={styles.bankDetails}>
            <Text style={styles.sectionTitle}>Banking Details for Payment</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <Text style={styles.label}>Bank:</Text>
                  <Text style={styles.value}>{data.bankDetails.bankName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Account Name:</Text>
                  <Text style={styles.value}>{data.bankDetails.accountName}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <Text style={styles.label}>Account No:</Text>
                  <Text style={styles.value}>{data.bankDetails.accountNumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Branch Code:</Text>
                  <Text style={styles.value}>{data.bankDetails.branchCode}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
              <Text style={[styles.label, { fontWeight: 'bold' }]}>Reference:</Text>
              <Text style={[styles.value, { fontWeight: 'bold', color: '#0E5C4A' }]}>
                {data.bankDetails.reference}
              </Text>
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.note}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Important:</Text>
          <Text>
            Please use your order number as the payment reference.{'\n'}
            Email proof of payment to: payments@perfumeoasis.co.za{'\n'}
            Your order will be processed within 24 hours of payment confirmation.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Thank you for choosing Perfume Oasis!{'\n'}
            www.perfumeoasis.co.za | info@perfumeoasis.co.za | +27 11 123 4567
          </Text>
        </View>
      </Page>
    </Document>
  )
}