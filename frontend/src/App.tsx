import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Dashboard from './components/Dashboard'
import MessageList from './components/MessageList'
import Statistics from './components/Statistics'
import './App.css'

function App() {
  const [botStatus, setBotStatus] = useState<'online' | 'offline' | 'connecting'>('offline')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'stats'>('dashboard')

  useEffect(() => {
    checkBotStatus()
    const interval = setInterval(checkBotStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkBotStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_status')
        .select('status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        const lastUpdate = new Date(data.updated_at)
        const now = new Date()
        const diffMs = now.getTime() - lastUpdate.getTime()

        if (diffMs < 30000) {
          setBotStatus(data.status as 'online' | 'offline' | 'connecting')
        } else {
          setBotStatus('offline')
        }
      }
    } catch (err) {
      console.error('Error checking bot status:', err)
      setBotStatus('offline')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>WhatsApp Bot Dashboard</h1>
            <div className={`status-badge status-${botStatus}`}>
              <span className="status-dot"></span>
              {botStatus.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <nav className="nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
        <button
          className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </nav>

      <main className="main">
        {activeTab === 'dashboard' && <Dashboard botStatus={botStatus} />}
        {activeTab === 'messages' && <MessageList />}
        {activeTab === 'stats' && <Statistics />}
      </main>
    </div>
  )
}

export default App
