import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Statistics.css'

interface ChatStats {
  chat_id: string
  contact_name: string
  total_messages: number
  user_messages: number
  bot_messages: number
  last_message_time: string
}

function Statistics() {
  const [chatStats, setChatStats] = useState<ChatStats[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'messages' | 'recent'>('messages')

  useEffect(() => {
    loadStatistics()
  }, [])

  useEffect(() => {
    sortChatStats()
  }, [sortBy])

  const loadStatistics = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) throw error

      if (messages) {
        const chatMap = new Map<string, ChatStats>()

        messages.forEach((msg) => {
          const existing = chatMap.get(msg.chat_id)

          if (existing) {
            existing.total_messages++
            if (msg.is_from_bot) {
              existing.bot_messages++
            } else {
              existing.user_messages++
            }
            if (new Date(msg.timestamp) > new Date(existing.last_message_time)) {
              existing.last_message_time = msg.timestamp
            }
          } else {
            chatMap.set(msg.chat_id, {
              chat_id: msg.chat_id,
              contact_name: msg.contact_name,
              total_messages: 1,
              user_messages: msg.is_from_bot ? 0 : 1,
              bot_messages: msg.is_from_bot ? 1 : 0,
              last_message_time: msg.timestamp,
            })
          }
        })

        const stats = Array.from(chatMap.values())
        setChatStats(stats)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading statistics:', error)
      setLoading(false)
    }
  }

  const sortChatStats = () => {
    const sorted = [...chatStats].sort((a, b) => {
      if (sortBy === 'messages') {
        return b.total_messages - a.total_messages
      } else {
        return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      }
    })
    setChatStats(sorted)
  }

  const getTotalStats = () => {
    const total = chatStats.reduce(
      (acc, chat) => ({
        messages: acc.messages + chat.total_messages,
        userMessages: acc.userMessages + chat.user_messages,
        botMessages: acc.botMessages + chat.bot_messages,
      }),
      { messages: 0, userMessages: 0, botMessages: 0 }
    )
    return total
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="loading">Loading statistics...</div>
      </div>
    )
  }

  const totals = getTotalStats()

  return (
    <div className="statistics-container">
      <div className="overview-cards">
        <div className="overview-card">
          <div className="overview-icon">💬</div>
          <div className="overview-content">
            <div className="overview-label">Total Messages</div>
            <div className="overview-value">{totals.messages}</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">👤</div>
          <div className="overview-content">
            <div className="overview-label">User Messages</div>
            <div className="overview-value">{totals.userMessages}</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">🤖</div>
          <div className="overview-content">
            <div className="overview-label">Bot Responses</div>
            <div className="overview-value">{totals.botMessages}</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">👥</div>
          <div className="overview-content">
            <div className="overview-label">Unique Chats</div>
            <div className="overview-value">{chatStats.length}</div>
          </div>
        </div>
      </div>

      <div className="chat-stats-section">
        <div className="section-header">
          <h2>Chat Statistics</h2>
          <div className="sort-buttons">
            <button
              className={sortBy === 'messages' ? 'active' : ''}
              onClick={() => setSortBy('messages')}
            >
              Most Messages
            </button>
            <button
              className={sortBy === 'recent' ? 'active' : ''}
              onClick={() => setSortBy('recent')}
            >
              Most Recent
            </button>
          </div>
        </div>

        {chatStats.length === 0 ? (
          <div className="empty-state">No chat statistics available</div>
        ) : (
          <div className="chat-stats-grid">
            {chatStats.map((chat) => (
              <div key={chat.chat_id} className="chat-stat-card">
                <div className="chat-stat-header">
                  <div className="contact-name">{chat.contact_name}</div>
                  <div className="message-count">{chat.total_messages} msgs</div>
                </div>
                <div className="chat-stat-body">
                  <div className="stat-row">
                    <span className="stat-label">User:</span>
                    <span className="stat-value">{chat.user_messages}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Bot:</span>
                    <span className="stat-value">{chat.bot_messages}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Last Active:</span>
                    <span className="stat-value">{formatTime(chat.last_message_time)}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill user"
                    style={{ width: `${(chat.user_messages / chat.total_messages) * 100}%` }}
                  ></div>
                  <div
                    className="progress-fill bot"
                    style={{ width: `${(chat.bot_messages / chat.total_messages) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistics
