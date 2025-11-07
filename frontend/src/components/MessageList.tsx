import React, { useState, useEffect } from 'react'
import { supabase, Message } from '../lib/supabase'
import './MessageList.css'

function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'user' | 'bot'>('all')

  useEffect(() => {
    loadMessages()

    const subscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [payload.new as Message, ...prev])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, filterType])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      if (data) setMessages(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading messages:', error)
      setLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.message_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((msg) =>
        filterType === 'bot' ? msg.is_from_bot : !msg.is_from_bot
      )
    }

    setFilteredMessages(filtered)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  if (loading) {
    return (
      <div className="message-list-container">
        <div className="loading">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="message-list-container">
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search messages or contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={filterType === 'all' ? 'active' : ''}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={filterType === 'user' ? 'active' : ''}
            onClick={() => setFilterType('user')}
          >
            Users
          </button>
          <button
            className={filterType === 'bot' ? 'active' : ''}
            onClick={() => setFilterType('bot')}
          >
            Bot
          </button>
        </div>
      </div>

      <div className="message-count">
        Showing {filteredMessages.length} of {messages.length} messages
      </div>

      {filteredMessages.length === 0 ? (
        <div className="empty-state">
          {searchTerm || filterType !== 'all'
            ? 'No messages match your filters'
            : 'No messages yet'}
        </div>
      ) : (
        <div className="messages-grid">
          {filteredMessages.map((message) => (
            <div key={message.id} className="message-card">
              <div className="message-card-header">
                <div className="contact-info">
                  <span className="contact-name">{message.contact_name}</span>
                  {message.is_from_bot && <span className="bot-badge">Bot</span>}
                </div>
                <span className="time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-body">
                <p>{message.message_text}</p>
              </div>
              <div className="message-footer">
                <span className="chat-id">{message.chat_id.substring(0, 20)}...</span>
                <span className="timestamp">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessageList
