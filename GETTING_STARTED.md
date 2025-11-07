# Getting Started with WhatsApp Bot + Dashboard

This guide will help you get your WhatsApp bot and web dashboard up and running.

## Quick Start

### Option 1: Development Mode (Recommended for Testing)

Run these commands in **separate terminal windows**:

**Terminal 1 - Start the Bot:**
```bash
npm run dev
```

**Terminal 2 - Start the Dashboard:**
```bash
npm run dev:frontend
```

Then open your browser to `http://localhost:5173`

### Option 2: Production Mode

```bash
npm run build
npm start                 # Start bot
npm run preview          # Preview dashboard
```

## First Time Setup

### 1. Configure Environment Variables

You need to set up two `.env` files:

**Root `.env` file (already has Supabase credentials):**
```env
OPENAI_API_KEY=sk-proj-your-key-here
WORKFLOW_ID=wf_your-workflow-id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Frontend `.env` file (`frontend/.env`):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Quick setup:** Copy Supabase variables to frontend:
```bash
cat .env | grep VITE > frontend/.env
```

### 2. Authenticate WhatsApp

When you start the bot for the first time:

1. Look for the QR code in your terminal
2. Or open the dashboard at `http://localhost:5173` and scan it there
3. Open WhatsApp on your phone
4. Go to: Menu (⋮) → Linked Devices → Link a Device
5. Scan the QR code

### 3. Access the Dashboard

Open `http://localhost:5173` in your browser to:
- Monitor bot status (online/offline/connecting)
- View real-time messages
- See conversation statistics
- Scan QR code for authentication

## Dashboard Features

### Dashboard Tab
- Bot status indicator
- Quick stats (messages, chats, response time)
- QR code display (when connecting)
- Recent messages preview

### Messages Tab
- All messages in real-time
- Search and filter capabilities
- User vs Bot message differentiation

### Statistics Tab
- Overall message counts
- Per-chat analytics
- Activity visualization

## Bot Commands

Send these commands in WhatsApp to interact with the bot:

- `!help` or `!ajuda` - Show help message
- `!clear` or `!limpar` - Clear conversation history
- `!status` - Check bot status
- `!sessions` - View active sessions
- `!ping` - Test bot connectivity

## Project Structure

```
├── src/                      # Bot source code
│   ├── bot.ts               # Main bot logic
│   ├── openai-simple.ts     # OpenAI integration
│   └── index.ts             # Entry point
├── frontend/                # Dashboard source code
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities (Supabase client)
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── dist/                    # Compiled bot code
└── dist-frontend/          # Built dashboard
```

## Troubleshooting

### Bot won't start
- Check that `OPENAI_API_KEY` is set in `.env`
- Ensure port 5173 is not in use
- Delete `./session/` folder to reset WhatsApp auth

### Dashboard shows blank page
- Missing `frontend/.env` file with Supabase credentials
- Run: `cat .env | grep VITE > frontend/.env`
- Restart dashboard: `npm run dev:frontend`
- Check browser console for "supabaseUrl is required" error

### Dashboard shows offline
- Make sure bot is running (`npm run dev`)
- Check browser console for errors
- Verify Supabase credentials in `.env` AND `frontend/.env`

### Messages not appearing in dashboard
- Confirm bot is running and connected
- Check that Supabase tables exist (they should be auto-created)
- Look for errors in bot console

### QR code not visible
- Bot must be in "connecting" state (first run or after session deletion)
- Check terminal for ASCII QR code
- Refresh dashboard page

## Development Tips

### View Database
Go to your Supabase project dashboard to:
- Browse messages table
- Check bot_status entries
- View conversation_history

### Clear WhatsApp Session
Delete the session folder to force re-authentication:
```bash
rm -rf session/
```

### Clear Conversation History
Use the `!clear` command in WhatsApp or manually:
```sql
DELETE FROM messages WHERE chat_id = 'specific_chat_id';
```

## Next Steps

1. Customize the bot's responses in `src/openai-simple.ts`
2. Adjust message history limits in `src/bot.ts`
3. Modify dashboard styling in `frontend/src/*.css`
4. Add new commands in `handleSpecialCommands()` function
5. Extend statistics in the Statistics component

## Need Help?

Check these files for more information:
- `README.md` - General project information
- `DASHBOARD.md` - Dashboard-specific documentation
- `CLAUDE.md` - Development guidelines
- `VERSOES.md` - Version history

## Tech Stack

**Bot:**
- Node.js + TypeScript
- whatsapp-web.js
- OpenAI API
- Supabase (database)

**Dashboard:**
- React 19 + TypeScript
- Vite
- Supabase (database + real-time)
- Custom CSS

---

Happy chatting!
