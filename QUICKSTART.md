# QuickStart Guide

Get your WhatsApp bot with web dashboard running in 2 minutes!

## Step 1: Start the Bot

Open a terminal and run:

```bash
npm run dev
```

You'll see:
- Bot initializing
- QR code displayed in terminal
- "Aguardando mensagens..." when ready

## Step 2: Start the Dashboard

Open a **second terminal** and run:

```bash
npm run dev:frontend
```

Then open your browser to: **http://localhost:5173**

## Step 3: Connect WhatsApp

**Option A - Scan from Terminal:**
1. Look at the QR code in your first terminal
2. Open WhatsApp on your phone
3. Go to: Menu (⋮) → Linked Devices → Link a Device
4. Scan the QR code

**Option B - Scan from Dashboard:**
1. Open http://localhost:5173 in your browser
2. QR code will appear on the Dashboard tab
3. Scan it with WhatsApp on your phone

## Step 4: Done!

You're all set! Now you can:

- **Chat with the bot** via WhatsApp (it will respond automatically)
- **Monitor messages** in real-time on the dashboard
- **View statistics** per conversation
- **Search messages** with filters

## Dashboard Features at a Glance

### Dashboard Tab
- Bot status indicator (🟢 online / 🔴 offline / 🟡 connecting)
- Quick statistics cards
- QR code display (when connecting)
- 5 most recent messages

### Messages Tab
- All messages with real-time updates
- Search by content or contact
- Filter: All / Users / Bot
- Full timestamps and chat IDs

### Statistics Tab
- Total metrics overview
- Per-chat message counts
- User vs Bot ratio
- Sort by activity or recency

## Common Commands

Send these to the bot in WhatsApp:

- `!help` - Show help
- `!clear` - Clear conversation history
- `!status` - Check bot status
- `!ping` - Test connectivity

## Troubleshooting

**Dashboard shows offline?**
- Make sure the bot is running in terminal 1
- Check browser console for errors

**No messages appearing?**
- Verify bot is connected to WhatsApp
- Send a test message to the bot
- Check bot terminal for errors

**Can't scan QR code?**
- Delete `./session/` folder and restart bot
- Try scanning from dashboard instead of terminal

## Next Steps

- Read `DASHBOARD.md` for detailed dashboard documentation
- Check `README.md` for complete project information
- See `GETTING_STARTED.md` for more setup options

---

**That's it! Enjoy your AI-powered WhatsApp bot with real-time monitoring!**
