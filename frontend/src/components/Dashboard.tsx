import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

interface DashboardProps {
  botStatus: 'online' | 'offline' | 'connecting'
}

interface Stats {
  totalMessages: number
  todayMessages: number
  activeChats: number
  avgResponseTime: string
}

function Dashboard({ botStatus }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    todayMessages: 0,
    activeChats: 0,
    avgResponseTime: '0s',
  })
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadStats(),
        loadQRCode(),
        loadRecentMessages(),
      ])
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  const loadStats = async () => {
    const { data: messages } = await supabase
      .from('messages')
      .select('chat_id, timestamp, is_from_bot')
      .order('timestamp', { ascending: false })

    if (messages) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayMessages = messages.filter(
        (m) => new Date(m.timestamp) >= today
      )
      const uniqueChats = new Set(messages.map((m) => m.chat_id))

      setStats({
        totalMessages: messages.length,
        todayMessages: todayMessages.length,
        activeChats: uniqueChats.size,
        avgResponseTime: '< 2s',
      })
    }
  }

  const loadQRCode = async () => {
    const { data } = await supabase
      .from('bot_status')
      .select('qr_code, status')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data && data.status === 'connecting' && data.qr_code) {
      setQrCode(data.qr_code)
    } else {
      setQrCode(null)
    }
  }

  const loadRecentMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5)

    if (data) {
      setRecentMessages(data)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-label">Total Messages</div>
            <div className="stat-value">{stats.totalMessages}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Today's Messages</div>
            <div className="stat-value">{stats.todayMessages}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Active Chats</div>
            <div className="stat-value">{stats.activeChats}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-label">Avg Response Time</div>
            <div className="stat-value">{stats.avgResponseTime}</div>
          </div>
        </div>
      </div>

      {qrCode && botStatus === 'connecting' && (
        <div className="qr-section">
          <h2>Scan QR Code to Connect</h2>
          <p>Open WhatsApp on your phone and scan this code:</p>
          <div className="qr-code">
            <pre>{qrCode}</pre>
          </div>
          <div className="qr-instructions">
            <ol>
              <li>Open WhatsApp on your phone</li>
              <li>Tap Menu (⋮) → Linked Devices</li>
              <li>Tap "Link a Device"</li>
              <li>Scan the QR code above</li>
            </ol>
          </div>
        </div>
      )}

      <div className="recent-section">
        <h2>Recent Messages</h2>
        {recentMessages.length === 0 ? (
          <div className="empty-state">No messages yet</div>
        ) : (
          <div className="message-list">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="message-item">
                <div className="message-header">
                  <span className="contact-name">{msg.contact_name}</span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className={`message-text ${msg.is_from_bot ? 'bot' : 'user'}`}>
                  {msg.is_from_bot && <span className="bot-badge">Bot</span>}
                  {msg.message_text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
