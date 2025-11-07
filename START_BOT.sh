#!/bin/bash

echo "========================================="
echo "WhatsApp Bot Startup Script"
echo "========================================="
echo ""
echo "Starting WhatsApp bot..."
echo ""
echo "After the bot starts:"
echo "1. Scan the QR code in your terminal OR"
echo "2. Open http://localhost:5173 and scan it there"
echo ""
echo "To view the dashboard, run in another terminal:"
echo "  ./START_DASHBOARD.sh"
echo "  OR"
echo "  npm run dev:frontend"
echo ""

cd "$(dirname "$0")"
npm run dev
