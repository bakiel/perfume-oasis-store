#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import twilio from 'twilio';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

// Define tools
const TOOLS: Tool[] = [
  {
    name: 'send_sms',
    description: 'Send an SMS message using Twilio',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number (with country code, e.g., +1234567890)',
        },
        body: {
          type: 'string',
          description: 'SMS message content',
        },
        from: {
          type: 'string',
          description: 'Sender phone number (optional, uses default if not provided)',
        },
      },
      required: ['to', 'body'],
    },
  },
  {
    name: 'send_whatsapp',
    description: 'Send a WhatsApp message using Twilio',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient WhatsApp number (with country code)',
        },
        body: {
          type: 'string',
          description: 'WhatsApp message content',
        },
        from: {
          type: 'string',
          description: 'Sender WhatsApp number (optional)',
        },
      },
      required: ['to', 'body'],
    },
  },
  {
    name: 'make_call',
    description: 'Make a voice call using Twilio',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number',
        },
        message: {
          type: 'string',
          description: 'Text to speak during the call',
        },
        from: {
          type: 'string',
          description: 'Caller phone number (optional)',
        },
      },
      required: ['to', 'message'],
    },
  },
  {
    name: 'check_phone_number',
    description: 'Lookup and validate a phone number',
    inputSchema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          description: 'Phone number to validate',
        },
      },
      required: ['phoneNumber'],
    },
  },
  {
    name: 'get_message_status',
    description: 'Get the status of a sent message',
    inputSchema: {
      type: 'object',
      properties: {
        messageSid: {
          type: 'string',
          description: 'Message SID from Twilio',
        },
      },
      required: ['messageSid'],
    },
  },
];

// Create server
const server = new Server(
  {
    name: 'twilio-mcp-server',
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
      case 'send_sms': {
        const { to, body, from } = args as any;
        
        const message = await client.messages.create({
          body,
          to,
          from: from || process.env.TWILIO_PHONE_NUMBER,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `SMS sent successfully. Message SID: ${message.sid}`,
            },
          ],
        };
      }

      case 'send_whatsapp': {
        const { to, body, from } = args as any;
        
        const message = await client.messages.create({
          body,
          to: `whatsapp:${to}`,
          from: from ? `whatsapp:${from}` : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `WhatsApp message sent. Message SID: ${message.sid}`,
            },
          ],
        };
      }

      case 'make_call': {
        const { to, message, from } = args as any;
        
        const twiml = `<Response><Say>${message}</Say></Response>`;
        
        const call = await client.calls.create({
          twiml,
          to,
          from: from || process.env.TWILIO_PHONE_NUMBER,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `Call initiated. Call SID: ${call.sid}`,
            },
          ],
        };
      }

      case 'check_phone_number': {
        const { phoneNumber } = args as any;
        
        try {
          const lookup = await client.lookups.v2
            .phoneNumbers(phoneNumber)
            .fetch();
          
          return {
            content: [
              {
                type: 'text',
                text: `Phone number ${phoneNumber} is valid. Country: ${lookup.countryCode}, Type: ${lookup.nationalFormat}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Phone number ${phoneNumber} appears to be invalid`,
              },
            ],
          };
        }
      }

      case 'get_message_status': {
        const { messageSid } = args as any;
        
        const message = await client.messages(messageSid).fetch();
        
        return {
          content: [
            {
              type: 'text',
              text: `Message Status: ${message.status}, To: ${message.to}, Sent: ${message.dateSent}`,
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
  console.error('Twilio MCP server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
