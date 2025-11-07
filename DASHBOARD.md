# WhatsApp Bot Dashboard

A modern, real-time web dashboard for monitoring and managing your WhatsApp bot.

## Features

- **Real-time Monitoring**: See bot status and messages as they arrive
- **Message History**: Browse all conversations with search and filtering
- **Statistics**: View detailed analytics per chat
- **QR Code Display**: Easy bot authentication directly from the dashboard
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (database is already configured)
- Running WhatsApp bot

### Installation

The dashboard is already set up. Just run:

```bash
npm run dev:frontend
```

This will start the dashboard at `http://localhost:5173`

### Running the Complete System

To run both the WhatsApp bot and the dashboard:

1. **Terminal 1 - Start the WhatsApp Bot:**
```bash
npm run dev
```

2. **Terminal 2 - Start the Dashboard:**
```bash
npm run dev:frontend
```

3. **Open your browser:**
Navigate to `http://localhost:5173`

## Dashboard Sections

### 1. Dashboard Tab
- Bot status indicator (online/offline/connecting)
- Quick statistics (total messages, today's messages, active chats, response time)
- QR code for authentication (when bot is connecting)
- Recent messages preview

### 2. Messages Tab
- Complete message history
- Real-time updates as new messages arrive
- Search by message content or contact name
- Filter by user messages or bot responses
- Shows timestamp and chat ID for each message

### 3. Statistics Tab
- Overview cards (total messages, user messages, bot responses, unique chats)
- Per-chat statistics with message counts
- Sort by most messages or most recent activity
- Visual progress bars showing user vs bot message ratio

## Environment Variables

The dashboard uses the following environment variables (already configured):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are read from:
- `/tmp/cc-agent/59821353/project/.env` (for the bot)
- `/tmp/cc-agent/59821353/project/frontend/.env` (for the dashboard)

## Database Schema

The dashboard uses three Supabase tables:

### messages
Stores all WhatsApp messages (user and bot)
- `id`: Unique identifier
- `chat_id`: WhatsApp chat ID
- `contact_name`: Contact's name
- `message_text`: Message content
- `is_from_bot`: Boolean indicating if message is from bot
- `timestamp`: When message was sent

### bot_status
Tracks bot connection status
- `id`: Unique identifier
- `status`: Current status (online/offline/connecting)
- `qr_code`: QR code for authentication (when connecting)
- `updated_at`: Last update timestamp

### conversation_history
Stores conversation context (not currently displayed in dashboard)
- `id`: Unique identifier
- `chat_id`: WhatsApp chat ID
- `history`: JSON array of conversation messages
- `updated_at`: Last update timestamp

## Real-time Features

The dashboard uses Supabase Realtime subscriptions to:
- Update message list instantly when new messages arrive
- Refresh statistics automatically
- Show bot status changes without page refresh

## Building for Production

Build both the bot and dashboard:

```bash
npm run build
```

This will:
1. Compile TypeScript bot code to `dist/`
2. Build optimized frontend to `dist-frontend/`

To preview the production build:

```bash
npm run preview
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Styling**: Custom CSS with CSS Variables
- **Bot**: whatsapp-web.js, OpenAI

## Troubleshooting

### Dashboard shows "offline" status
- Make sure the bot is running (`npm run dev`)
- Check that environment variables are set correctly
- Verify Supabase connection

### Messages not appearing
- Check browser console for errors
- Verify bot is logging to Supabase (check bot console logs)
- Ensure Supabase tables were created correctly

### QR code not displaying
- Bot must be in "connecting" state
- Check that bot is calling `updateBotStatus('connecting', qr)`
- Verify `bot_status` table has recent entries

## Design Features

- Dark theme with cyan/teal accent colors
- Smooth animations and transitions
- Hover effects on interactive elements
- Responsive breakpoints for mobile devices
- Clear visual hierarchy
- Professional typography and spacing
