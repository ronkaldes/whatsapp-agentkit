/*
  # WhatsApp Bot Dashboard Database Schema

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `chat_id` (text) - WhatsApp chat identifier
      - `contact_name` (text) - Name of the contact
      - `message_text` (text) - The actual message content
      - `is_from_bot` (boolean) - Whether the message is from the bot
      - `timestamp` (timestamptz) - When the message was sent
      - `created_at` (timestamptz) - When the record was created
    
    - `bot_status`
      - `id` (uuid, primary key)
      - `status` (text) - Bot status (online, offline, connecting)
      - `qr_code` (text, nullable) - QR code for authentication
      - `updated_at` (timestamptz) - Last status update time
      - `metadata` (jsonb, nullable) - Additional status information
    
    - `conversation_history`
      - `id` (uuid, primary key)
      - `chat_id` (text) - WhatsApp chat identifier
      - `history` (jsonb) - Conversation history as JSON
      - `updated_at` (timestamptz) - Last update time
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (dashboard is public)
    - Add policies for bot service write access
  
  3. Indexes
    - Index on messages.chat_id for fast lookups
    - Index on messages.timestamp for sorting
    - Index on bot_status.updated_at for latest status queries
*/

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL,
  contact_name text NOT NULL,
  message_text text NOT NULL,
  is_from_bot boolean NOT NULL DEFAULT false,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service can insert messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Bot status table
CREATE TABLE IF NOT EXISTS bot_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'offline',
  qr_code text,
  metadata jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bot_status_updated_at ON bot_status(updated_at DESC);

ALTER TABLE bot_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bot status"
  ON bot_status FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service can insert bot status"
  ON bot_status FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service can update bot status"
  ON bot_status FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Conversation history table
CREATE TABLE IF NOT EXISTS conversation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text UNIQUE NOT NULL,
  history jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversation_history_chat_id ON conversation_history(chat_id);

ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read conversation history"
  ON conversation_history FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service can insert conversation history"
  ON conversation_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service can update conversation history"
  ON conversation_history FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
