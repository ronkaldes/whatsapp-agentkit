import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Message {
  id: string
  chat_id: string
  contact_name: string
  message_text: string
  is_from_bot: boolean
  timestamp: string
  created_at: string
}

export interface BotStatus {
  id: string
  status: 'online' | 'offline' | 'connecting'
  qr_code?: string
  updated_at: string
}

export interface ConversationStats {
  chat_id: string
  contact_name: string
  message_count: number
  last_message: string
}
