#!/bin/bash

echo "========================================="
echo "WhatsApp Bot Dashboard Startup Script"
echo "========================================="
echo ""
echo "This will start the dashboard on http://localhost:5173"
echo ""
echo "Make sure you have already started the bot in another terminal with:"
echo "  npm run dev"
echo ""
echo "Starting dashboard..."
echo ""

cd "$(dirname "$0")"
npm run dev:frontend
