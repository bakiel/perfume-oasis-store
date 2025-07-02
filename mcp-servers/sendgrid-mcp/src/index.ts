#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('SENDGRID_API_KEY environment variable is required');
  process.exit(1);
}
sgMail.setApiKey(apiKey);

// Define tools
const TOOLS: Tool[] = [
  {
    name: 'send_email',
    description: 'Send an email using SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address',
        },
        subject: {
          type: 'string',
          description: 'Email subject',
        },
        text: {
          type: 'string',
          description: 'Plain text content',
        },
        html: {
          type: 'string',
          description: 'HTML content',
        },
        from: {
          type: 'string',
          description: 'Sender email address (optional, uses default if not provided)',
        },
      },
      required: ['to', 'subject'],
    },
  },
  {
    name: 'send_template_email',
    description: 'Send an email using a SendGrid template',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address',
        },
        templateId: {
          type: 'string',
          description: 'SendGrid template ID',
        },
        dynamicData: {
          type: 'object',
          description: 'Dynamic template data',
        },
        from: {
          type: 'string',
          description: 'Sender email address (optional)',
        },
      },
      required: ['to', 'templateId'],
    },
  },
  {
    name: 'verify_email',
    description: 'Verify if an email address is valid (syntax check only)',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address to verify',
        },
      },
      required: ['email'],
    },
  },
  {
    name: 'get_domain_authentication_status',
    description: 'Check domain authentication status (requires API key with appropriate permissions)',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain to check',
        },
      },
      required: ['domain'],
    },
  },
];

// Create server
const server = new Server(
  {
    name: 'sendgrid-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'send_email': {
        const { to, subject, text, html, from } = args as any;
        
        const msg: any = {
          to,
          from: from || process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
          subject,
        };

        if (text) msg.text = text;
        if (html) msg.html = html;

        const result = await sgMail.send(msg);
        
        return {
          content: [
            {
              type: 'text',
              text: `Email sent successfully to ${to}`,
            },
          ],
        };
      }

      case 'send_template_email': {
        const { to, templateId, dynamicData, from } = args as any;
        
        const msg: any = {
          to,
          from: from || process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
          templateId,
          dynamicTemplateData: dynamicData || {},
        };

        await sgMail.send(msg);
        
        return {
          content: [
            {
              type: 'text',
              text: `Template email sent successfully to ${to}`,
            },
          ],
        };
      }

      case 'verify_email': {
        const { email } = args as any;
        
        // Basic email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        return {
          content: [
            {
              type: 'text',
              text: `Email ${email} is ${isValid ? 'valid' : 'invalid'} (syntax check only)`,
            },
          ],
        };
      }

      case 'get_domain_authentication_status': {
        // This would require additional API setup
        // For now, return a placeholder
        return {
          content: [
            {
              type: 'text',
              text: 'Domain authentication check requires additional API configuration',
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SendGrid MCP server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
