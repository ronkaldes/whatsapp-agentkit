# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a WhatsApp bot powered by OpenAI that uses the whatsapp-web.js library to provide AI-driven automated responses. The bot integrates with OpenAI's Assistants API (with workflow/thread management) and has a fallback to chat completions.

## Development Commands

### Running the Bot
```bash
# Development mode (with TypeScript hot reload)
npm run dev

# Production mode (requires build first)
npm run build && npm start
```

### Building
```bash
# Compile TypeScript to JavaScript
npm run build
```

### Windows-Specific
The project includes `.bat` files for Windows users:
- `start_dev.bat` - Runs in development mode
- `start_prod.bat` - Builds and runs in production mode

## Environment Configuration

Required environment variables in `.env`:
- `OPENAI_API_KEY` - OpenAI API key (required)
- `WORKFLOW_ID` - OpenAI Assistant/Workflow ID (optional, defaults to hardcoded value)

Use `.env.example` as a template.

## Architecture

### Core Components

**src/bot.ts** - Main WhatsApp client and message handling
- Initializes whatsapp-web.js client with LocalAuth strategy
- Manages per-chat conversation history in a Map<string, ConversationMessage[]>
- Processes incoming messages and routes them to OpenAI
- Handles special commands (!help, !clear, !status, !ping)
- Ignores group messages and self-sent messages by default

**src/openai-simple.ts** - OpenAI integration layer
- Primary function: `runAgentKitWorkflow()` - Uses OpenAI Chat Completions API
- Workflow ID is used only as a reference in the system prompt (not for Assistants API)
- Takes conversation history as parameter (managed by bot.ts)
- Helper functions for history management, context creation, and connection testing

**src/index.ts** - Entry point (simply imports bot.ts)

### Message Flow

1. WhatsApp message arrives → `message_create` event in bot.ts
2. Check if it's a special command → handle and return
3. If not a command → retrieve/create conversation history for this chat
4. Call `sendMessageToOpenAI()` with message, context, and history
5. OpenAI integration:
   - Calls `runAgentKitWorkflow()` with workflow ID, message, context, and history
   - Constructs system prompt with workflow ID reference and conversation context
   - Sends to OpenAI Chat Completions API (gpt-4o)
   - Receives and returns assistant's text response
6. Update conversation history and send reply to WhatsApp

### State Management

- **Conversation History**: Stored in-memory per chat (Map in bot.ts)
  - Limited to 20 messages by default via `limitConversationHistory()`
  - Cleared with !clear command


- **WhatsApp Session**: Persisted to disk in `./session/` directory
  - Managed by whatsapp-web.js LocalAuth
  - Delete to force re-authentication

### OpenAI Integration Details

The bot uses OpenAI's Chat Completions API:
- Uses the standard chat completions endpoint (not Assistants API)
- The `WORKFLOW_ID` is used only as a reference string in the system prompt
- Conversation history is maintained in-memory per chat by bot.ts
- Context metadata (chatId, contactName, platform, etc.) is included in the system prompt
- Model: gpt-4o with temperature 0.7 and max_tokens 500

### Special Behaviors

- Groups are ignored by default (line 58 in bot.ts - can be removed to enable group support)
- Bot ignores its own messages
- OpenAI connection is tested lazily on first message
- Conversation history is limited to prevent excessive token usage
- Context is appended to user messages for OpenAI (contact name, platform)

## Key Configuration Points

### WhatsApp Client (bot.ts:10-33)
- Uses LocalAuth with `./session` directory
- Puppeteer configured for headless operation with specific Chrome args
- Uses wppconnect-team's remote web version cache for stability
- 60-second timeout for initialization

### OpenAI Settings (openai-simple.ts)
- Model: `gpt-4o` (in fallback completions)
- Temperature: 0.7 (in fallback)
- Max tokens: 500 (in fallback, 10 for connection test)
- History limit: 20 messages (configurable in bot.ts:78)

## Common Development Tasks

### Enabling Group Message Support
Remove or comment out lines 58-61 in bot.ts:
```typescript
// if (message.from.includes('@g.us')) {
//     console.log('📱 Mensagem de grupo ignorada');
//     return;
// }
```

### Changing History Limit
Modify line 78 in bot.ts:
```typescript
history = limitConversationHistory(history, 20); // Change 20 to desired limit
```

### Changing OpenAI Model (Fallback Mode)
Modify line 172 in openai-simple.ts in `fallbackToCompletions()`:
```typescript
model: "gpt-4o", // Change to desired model
```

### Adding New Bot Commands
Add cases to `handleSpecialCommands()` function in bot.ts:120-165

### Clearing Conversation History
Use the `!clear` command in WhatsApp to clear the conversation history for a specific chat

## Troubleshooting

### Bot doesn't respond
- Check `OPENAI_API_KEY` is set correctly in `.env`
- Check OpenAI API has available credits
- Check console logs for error messages
- Use `!ping` command to verify bot is receiving messages

### Authentication fails
- Delete `./session/` directory
- Restart bot and scan QR code again

### TypeScript compilation errors
- Ensure Node.js version is 18+
- Run `npm install` to ensure all dependencies are installed
- Check tsconfig.json matches project structure
