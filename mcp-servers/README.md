# MCP Servers Setup Guide

## Overview
This directory contains MCP (Model Context Protocol) servers for:
1. **SendGrid** - Email operations
2. **Twilio** - SMS, WhatsApp, and voice calls

## Installation

### 1. Install Dependencies

#### SendGrid MCP Server:
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/sendgrid-mcp
npm install
npm run build
```

#### Twilio MCP Server:
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/twilio-mcp
npm install
npm run build
```

### 2. Configure Claude Desktop

Add these servers to your Claude Desktop configuration file:

**Location**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sendgrid": {
      "command": "node",
      "args": ["/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/sendgrid-mcp/dist/index.js"],
      "env": {
        "SENDGRID_API_KEY": "your-sendgrid-api-key-here",
        "SENDGRID_FROM_EMAIL": "orders@perfumeoasis.co.za"
      }
    },
    "twilio": {
      "command": "node",
      "args": ["/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/mcp-servers/twilio-mcp/dist/index.js"],
      "env": {
        "TWILIO_ACCOUNT_SID": "your_account_sid_here",
        "TWILIO_AUTH_TOKEN": "your_auth_token_here",
        "TWILIO_PHONE_NUMBER": "+1234567890",
        "TWILIO_WHATSAPP_NUMBER": "+1234567890"
      }
    }
  }
}
```

### 3. Update Twilio Credentials

1. Log in to Twilio: https://console.twilio.com
2. Get your Account SID and Auth Token from the dashboard
3. Get your Twilio phone number
4. Update the `.env` file in the twilio-mcp directory

## Available Tools

### SendGrid Tools:
- `send_email` - Send plain or HTML emails
- `send_template_email` - Send emails using SendGrid templates
- `verify_email` - Basic email syntax validation
- `get_domain_authentication_status` - Check domain auth status

### Twilio Tools:
- `send_sms` - Send SMS messages
- `send_whatsapp` - Send WhatsApp messages
- `make_call` - Make voice calls with text-to-speech
- `check_phone_number` - Validate phone numbers
- `get_message_status` - Check message delivery status

## Usage Examples

### SendGrid Examples:

```
// Send a simple email
send_email({
  to: "customer@example.com",
  subject: "Order Confirmation",
  html: "<h1>Thank you for your order!</h1>"
})

// Send template email
send_template_email({
  to: "customer@example.com",
  templateId: "d-1234567890",
  dynamicData: {
    name: "John Doe",
    orderNumber: "12345"
  }
})
```

### Twilio Examples:

```
// Send SMS
send_sms({
  to: "+27821234567",
  body: "Your order has been shipped!"
})

// Send WhatsApp
send_whatsapp({
  to: "+27821234567",
  body: "Thank you for your order from Perfume Oasis!"
})
```

## Security Notes

1. **Never commit API keys** - The `.env` files are for local use only
2. **Use environment variables** in production
3. **Rotate keys regularly** for security
4. **Monitor usage** in both SendGrid and Twilio dashboards

## Troubleshooting

### MCP Server Not Working?
1. Restart Claude Desktop after config changes
2. Check logs: `tail -f ~/Library/Logs/Claude/mcp*.log`
3. Verify paths in config are absolute
4. Ensure Node.js is installed: `node --version`

### SendGrid Issues?
- Verify domain authentication in SendGrid dashboard
- Check API key permissions
- Monitor email activity feed

### Twilio Issues?
- Verify phone numbers are in E.164 format (+1234567890)
- Check account balance
- Verify phone number capabilities (SMS, voice, etc.)

## Next Steps

1. Complete domain authentication in SendGrid
2. Set up Twilio phone numbers
3. Create email templates in SendGrid
4. Configure webhook endpoints for delivery notifications
