# Payment Verification Process Guide

## Overview

Perfume Oasis uses a **manual bank transfer verification system**. This is common for South African e-commerce where EFT (Electronic Funds Transfer) is the primary payment method.

## Customer Process

### 1. **Checkout**
- Customer completes checkout
- Order status: `pending`
- Payment status: `pending`
- Customer receives invoice via email with banking details

### 2. **Payment**
- Customer makes EFT payment to:
  - **Bank**: Nedbank
  - **Account**: Torrencial
  - **Account Number**: 1313614866
  - **Branch Code**: 198765
  - **Reference**: Order Number (e.g., PO1234567890)

### 3. **Proof of Payment**
- Customer emails proof of payment to: `orders@perfumeoasis.co.za`
- Can include: Bank screenshot, payment confirmation, SMS notification

## Store Owner Verification Process

### 1. **Check Bank Statement**
- Owner checks bank account for incoming payments
- Matches payment reference to order numbers

### 2. **Admin Panel Verification**

#### Step 1: View Pending Orders
```
Admin → Orders → Filter by "Payment Pending"
```

#### Step 2: Open Order Details
- Click eye icon on order
- Review order amount and customer details

#### Step 3: Verify Payment
Two methods available:

**Quick Update:**
- Change "Payment Status" dropdown from `Pending` to `Paid`
- Order automatically moves to `Processing` status

**Detailed Verification (with Payment Modal):**
- Click "Verify Payment" button
- Enter:
  - Bank reference number
  - Amount received
  - Payment date
  - Bank name
  - Notes (optional)
- System creates payment confirmation record
- Updates order to paid + processing

### 3. **What Happens After Verification**

When payment is marked as `Paid`:
- Order status changes to `Processing`
- Customer receives payment confirmation email
- Stock is already reserved (happened at checkout)
- Order appears in packing queue

## Order Status Flow

```
1. Pending Payment → Customer hasn't paid yet
2. Processing → Payment verified, preparing order
3. Ready to Ship → Order packed and ready
4. Shipped → Order dispatched with tracking
5. Delivered → Order delivered to customer
```

## Payment Status Options

- **Pending**: Awaiting payment
- **Paid**: Payment verified
- **Failed**: Payment issue/cancelled
- **Refunded**: Money returned to customer

## Automation Options (Future)

### 1. **Bank API Integration**
- Auto-match payments using reference numbers
- Requires bank API access (FNB, Standard Bank offer this)

### 2. **Payment Gateway Integration**
- PayFast, PayGate, Ozow for instant payments
- Higher fees but automatic verification

### 3. **Semi-Automated**
- Upload bank statement CSV
- System matches payments to orders

## Current Manual Process Benefits

1. **No transaction fees** (unlike payment gateways)
2. **Direct bank deposits** (customers trust this)
3. **Personal touch** (owner reviews each order)
4. **Flexibility** (can handle special cases)

## Best Practices

### For Store Owner

1. **Check payments daily**
   - Morning: Check overnight payments
   - Afternoon: Check day's payments

2. **Verify within 24 hours**
   - Customers expect quick confirmation
   - Builds trust and satisfaction

3. **Use order notes**
   - Record any payment discrepancies
   - Note special customer requests

4. **Tracking numbers**
   - Add tracking after shipping
   - Customer gets automatic notification

### For Customers

1. **Use correct reference**
   - Always use order number as reference
   - Helps quick identification

2. **Send proof promptly**
   - Email proof after payment
   - Include order number in email

3. **Keep proof**
   - Save payment confirmation
   - Useful for queries

## Database Structure

### Orders Table
```sql
- payment_status: 'pending', 'paid', 'failed', 'refunded'
- payment_reference: Bank reference number
- paid_at: Timestamp when verified
- status: Overall order status
```

### Payment Confirmations Table (Optional)
```sql
- order_id: Link to order
- reference_number: Bank reference
- amount: Amount received
- payment_date: When customer paid
- bank_name: Which bank
- confirmed_at: When owner verified
- notes: Any special notes
```

## Quick SQL Check

To see orders awaiting payment verification:
```sql
SELECT 
  order_number,
  customer_name,
  customer_email,
  total_amount,
  created_at
FROM orders
WHERE payment_status = 'pending'
ORDER BY created_at DESC;
```

## Troubleshooting

### Customer says they paid but order shows pending
1. Check bank account for payment
2. Check if reference number matches
3. Check spam folder for proof of payment email
4. Manually verify if payment found

### Payment amount doesn't match order
1. Check for bank fees deducted
2. Verify customer paid correct amount
3. Use payment notes to record discrepancy
4. Contact customer if needed

## Future Enhancements

1. **SMS Notifications**
   - Auto-SMS when payment verified
   - Using Twilio/Clickatell

2. **WhatsApp Integration**
   - Customers can send proof via WhatsApp
   - Using WhatsApp Business API

3. **Customer Portal**
   - Customers upload proof directly
   - See real-time order status

4. **Reconciliation Dashboard**
   - Match bank statement to orders
   - Bulk verify payments