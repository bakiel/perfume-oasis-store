// Domain-related email configuration for perfumeoasis.co.za
export const COMPANY_EMAILS = {
  // Primary contact email
  info: 'info@perfumeoasis.co.za',
  
  // Customer support email
  support: 'support@perfumeoasis.co.za',
  
  // Order-related emails
  orders: 'orders@perfumeoasis.co.za',
  
  // No-reply email for automated messages
  noreply: 'noreply@perfumeoasis.co.za',
  
  // Admin email
  admin: 'admin@perfumeoasis.co.za',
}

// Email configuration for sending
export const EMAIL_CONFIG = {
  fromName: 'Perfume Oasis',
  replyTo: COMPANY_EMAILS.support,
  domain: 'perfumeoasis.co.za',
  companyName: 'Perfume Oasis (Pty) Ltd',
  companyAddress: 'Sandton, Johannesburg, South Africa',
  companyPhone: '+27 11 123 4567', // Update with actual phone
  companyWebsite: 'https://perfumeoasis.co.za',
}