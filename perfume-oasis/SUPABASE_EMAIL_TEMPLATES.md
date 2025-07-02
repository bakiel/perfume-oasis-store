# Supabase Email Templates Configuration

## Overview

This guide shows how to configure custom email templates in Supabase for authentication emails (signup, password reset, etc.).

## Steps to Configure

### 1. Access Email Templates

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Email Templates
3. You'll see templates for:
   - Confirm signup
   - Invite user
   - Magic Link
   - Change Email Address
   - Reset Password

### 2. Update Each Template

Replace the default templates with these custom versions:

#### Confirm Signup Template

```html
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0E5C4A; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .content { background-color: #ffffff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background-color: #0E5C4A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PERFUME OASIS</div>
      <div>Premium Fragrances</div>
    </div>
    
    <div class="content">
      <h2>Welcome to Perfume Oasis!</h2>
      <p>Thank you for creating an account with us. Please confirm your email address by clicking the button below:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0E5C4A;">{{ .ConfirmationURL }}</p>
      
      <p>This link will expire in 24 hours.</p>
      
      <p>If you didn't create an account with Perfume Oasis, please ignore this email.</p>
    </div>
    
    <div class="footer">
      <p>Perfume Oasis - Premium Fragrances<br>
      www.perfumeoasis.co.za | info@perfumeoasis.co.za | +27 82 480 1311</p>
    </div>
  </div>
</body>
</html>
```

#### Reset Password Template

```html
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0E5C4A; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .content { background-color: #ffffff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background-color: #0E5C4A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PERFUME OASIS</div>
      <div>Premium Fragrances</div>
    </div>
    
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0E5C4A;">{{ .ConfirmationURL }}</p>
      
      <p>This link will expire in 1 hour.</p>
      
      <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
      
      <p>For security reasons, if you did not request this change, we recommend you log into your account and change your password.</p>
    </div>
    
    <div class="footer">
      <p>Perfume Oasis - Premium Fragrances<br>
      www.perfumeoasis.co.za | info@perfumeoasis.co.za | +27 82 480 1311</p>
    </div>
  </div>
</body>
</html>
```

#### Magic Link Template

```html
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0E5C4A; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .content { background-color: #ffffff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background-color: #0E5C4A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PERFUME OASIS</div>
      <div>Premium Fragrances</div>
    </div>
    
    <div class="content">
      <h2>Your Magic Link</h2>
      <p>Click the button below to securely log in to your Perfume Oasis account:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Log In to Your Account</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0E5C4A;">{{ .ConfirmationURL }}</p>
      
      <p>This link will expire in 1 hour and can only be used once.</p>
      
      <p>If you didn't request this login link, please ignore this email.</p>
    </div>
    
    <div class="footer">
      <p>Perfume Oasis - Premium Fragrances<br>
      www.perfumeoasis.co.za | info@perfumeoasis.co.za | +27 82 480 1311</p>
    </div>
  </div>
</body>
</html>
```

### 3. Configure Email Settings

1. Go to Authentication > Providers > Email
2. Update these settings:
   - **Site URL**: https://perfumeoasis.co.za
   - **Redirect URLs**: 
     - https://perfumeoasis.co.za/*
     - http://localhost:3000/* (for development)
   - **Email Address Confirmation**: Enable
   - **Secure Email Change**: Enable

### 4. Update SMTP Settings (Optional)

If you want to use custom SMTP instead of Supabase's default:

1. Go to Project Settings > Auth
2. Scroll to SMTP Settings
3. Enable "Custom SMTP"
4. Enter your SMTP details:
   - **Host**: Your SMTP server
   - **Port**: Usually 587 for TLS
   - **Username**: SMTP username
   - **Password**: SMTP password
   - **Sender email**: noreply@perfumeoasis.co.za
   - **Sender name**: Perfume Oasis

### 5. Test Your Templates

1. Create a test user account
2. Request a password reset
3. Check that emails arrive with proper formatting

## Variables Available in Templates

- `{{ .ConfirmationURL }}` - The confirmation/action link
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Confirmation token (if needed separately)
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL
- `{{ .RedirectTo }}` - Redirect URL after action

## Best Practices

1. Always include both button and text link
2. Set reasonable expiration times
3. Include clear instructions
4. Add contact information for support
5. Test on multiple email clients
6. Keep design simple for better compatibility

## Troubleshooting

If emails are not sending:
1. Check spam folders
2. Verify email provider settings
3. Check Supabase logs
4. Ensure user email is valid
5. Check rate limits

For custom SMTP issues:
1. Verify SMTP credentials
2. Check firewall/port access
3. Enable "less secure apps" if using Gmail
4. Use app-specific passwords when available