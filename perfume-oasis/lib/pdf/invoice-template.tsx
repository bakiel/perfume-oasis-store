import React from 'react'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet,
  Image
} from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 25,
    fontFamily: 'Helvetica',
    fontSize: 8
  },
  header: {
    marginBottom: 15,
    borderBottom: '2px solid #0E5C4A',
    paddingBottom: 12
  },
  companyInfo: {
    fontSize: 7,
    color: '#666666',
    lineHeight: 1.3
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
    marginBottom: 15
  },
  section: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0E5C4A',
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3
  },
  label: {
    fontSize: 8,
    color: '#666666',
    width: 80
  },
  value: {
    fontSize: 8,
    color: '#333333',
    flex: 1
  },
  table: {
    marginTop: 15,
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0E5C4A',
    padding: 8,
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    padding: 8,
    fontSize: 8
  },
  tableCol1: { flex: 3 },
  tableCol2: { flex: 1, textAlign: 'center' },
  tableCol3: { flex: 1, textAlign: 'right' },
  tableCol4: { flex: 1, textAlign: 'right' },
  totals: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: '2px solid #0E5C4A'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4
  },
  totalLabel: {
    fontSize: 10,
    marginRight: 20,
    width: 80,
    textAlign: 'right'
  },
  totalValue: {
    fontSize: 10,
    width: 80,
    textAlign: 'right'
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1px solid #cccccc'
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0E5C4A'
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0E5C4A'
  },
  bankDetails: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 5
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    textAlign: 'center',
    fontSize: 7,
    color: '#666666',
    borderTop: '1px solid #eeeeee',
    paddingTop: 8
  },
  note: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 5,
    fontSize: 7,
    color: '#666666'
  },
  badge: {
    backgroundColor: '#C8A95B',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: 3,
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    width: 120
  }
})

interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: string
  customer: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      suburb: string
      city: string
      province: string
      postalCode: string
    }
  }
  items: Array<{
    product_name: string
    product_brand: string
    quantity: number
    price: number
    subtotal: number
  }>
  subtotal: number
  delivery: number
  total: number
  paymentStatus: string
  paymentMethod: string
  discount?: number
  appliedPromotions?: Array<{
    name: string
    type: string
    discount_amount: number
    code?: string
  }>
}

export const InvoiceDocument: React.FC<InvoiceData> = (data) => {
  const formatCurrency = (amount: number) => `R ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              {/* Logo */}
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0E5C4A', letterSpacing: 0.5 }}>
                  PERFUME OASIS
                </Text>
                <Text style={{ fontSize: 9, color: '#C8A95B', marginTop: -2 }}>
                  Premium Fragrances
                </Text>
              </View>
              <Text style={styles.companyInfo}>
                Trading as: Perfume Oasis{'\n'}
                Torrencial (Pty) Ltd{'\n'}
                Company Reg: 2025/213013/07
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={styles.badge}>
                <Text>INVOICE</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#666666', marginTop: 5 }}>
                Original
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={[styles.companyInfo, { textAlign: 'right' }]}>
                www.perfumeoasis.co.za{'\n'}
                orders@perfumeoasis.co.za{'\n'}
                info@perfumeoasis.co.za{'\n'}
                +27 82 480 1311
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
              {data.customer.address.suburb}, {data.customer.address.city}{'\n'}
              {data.customer.address.province} {data.customer.address.postalCode}{'\n'}
              {data.customer.email}{'\n'}
              {data.customer.phone}
            </Text>
          </View>
          
          <View style={{ width: 200 }}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice No:</Text>
              <Text style={styles.value}>{data.invoiceNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Order No:</Text>
              <Text style={styles.value}>{data.orderNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{formatDate(data.date)}</Text>
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
              <Text style={styles.tableCol1}>
                {item.product_name}{'\n'}
                <Text style={{ fontSize: 9, color: '#666666' }}>{item.product_brand}</Text>
              </Text>
              <Text style={styles.tableCol2}>{item.quantity}</Text>
              <Text style={styles.tableCol3}>{formatCurrency(item.price)}</Text>
              <Text style={styles.tableCol4}>{formatCurrency(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.subtotal)}</Text>
          </View>
          
          {/* Applied Promotions */}
          {data.appliedPromotions && data.appliedPromotions.length > 0 && (
            <>
              {data.appliedPromotions.map((promo, index) => (
                <View key={index} style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: '#0E5C4A' }]}>
                    {promo.name} {promo.code ? `(${promo.code})` : ''}:
                  </Text>
                  <Text style={[styles.totalValue, { color: '#0E5C4A' }]}>
                    - {formatCurrency(promo.discount_amount)}
                  </Text>
                </View>
              ))}
            </>
          )}
          
          {/* Or show single discount line if no promotion details */}
          {(!data.appliedPromotions || data.appliedPromotions.length === 0) && data.discount && data.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: '#0E5C4A' }]}>Discount:</Text>
              <Text style={[styles.totalValue, { color: '#0E5C4A' }]}>
                - {formatCurrency(data.discount)}
              </Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery:</Text>
            <Text style={styles.totalValue}>
              {data.delivery === 0 ? 'FREE' : formatCurrency(data.delivery)}
            </Text>
          </View>
          
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={[styles.totalLabel, styles.grandTotalLabel]}>Total Due:</Text>
            <Text style={[styles.totalValue, styles.grandTotalValue]}>
              {formatCurrency(data.total)}
            </Text>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.bankDetails}>
          <Text style={styles.sectionTitle}>Banking Details for Payment</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Beneficiary:</Text>
                <Text style={styles.value}>Torrencial</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Bank:</Text>
                <Text style={styles.value}>Nedbank</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Account No:</Text>
                <Text style={styles.value}>1313614866</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Branch Code:</Text>
                <Text style={styles.value}>198765</Text>
              </View>
            </View>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={[styles.label, { fontWeight: 'bold' }]}>Reference:</Text>
            <Text style={[styles.value, { fontWeight: 'bold', color: '#0E5C4A' }]}>
              {data.orderNumber}
            </Text>
          </View>
        </View>

        {/* Note */}
        <View style={styles.note}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Important:</Text>
          <Text>
            Please use your order number as the payment reference.{'\n'}
            Email proof of payment to: orders@perfumeoasis.co.za{'\n'}
            Your order will be processed within 24 hours of payment confirmation.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Thank you for choosing Perfume Oasis!{'\n'}
            www.perfumeoasis.co.za | orders@perfumeoasis.co.za | info@perfumeoasis.co.za
          </Text>
        </View>
      </Page>
    </Document>
  )
}
