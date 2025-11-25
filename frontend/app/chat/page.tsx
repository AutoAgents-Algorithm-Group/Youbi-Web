'use client'

import { useState } from 'react'
import { 
  MessageCircle, 
  Users, 
  Zap, 
  Coins, 
  Send,
  Search,
  Plus,
  ArrowLeft,
  Menu,
  Settings,
  HelpCircle,
  User as UserIcon,
  LogOut
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  username: string
  avatar: string
  lastMessage?: string
  lastMessageTime?: string
  unread?: number
  type: '1:1' | 'group'
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'system'
}

export default function ChatPage() {
  const [user] = useState({
    name: 'User',
    username: '@user123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    energy: 850,
    points: 12500
  })

  const [activeTab, setActiveTab] = useState<'1:1' | 'group'>('1:1')
  const [selectedChat, setSelectedChat] = useState<Contact | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([])
  const [isSending, setIsSending] = useState(false)
  
  // Mock data
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      username: '@sarah_j',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      lastMessage: 'Hey! How are you doing?',
      lastMessageTime: '2m ago',
      unread: 2,
      type: '1:1'
    },
    {
      id: '2',
      name: 'Mike Chen',
      username: '@mike_c',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      lastMessage: 'Thanks for the help!',
      lastMessageTime: '1h ago',
      type: '1:1'
    },
    {
      id: '3',
      name: 'Content Creators',
      username: '8 members',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Group1',
      lastMessage: 'Alice: Anyone tried the new feature?',
      lastMessageTime: '30m ago',
      unread: 5,
      type: 'group'
    },
    {
      id: '4',
      name: 'TikTok Tips',
      username: '15 members',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Group2',
      lastMessage: 'Check out this amazing trend!',
      lastMessageTime: '2h ago',
      type: 'group'
    }
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'andrew',
      content: 'Hi! I\'m Andrew, your AI butler. I\'m here to help you with anything you need. I can connect you with Ray for design help or Frank for analytics insights. How can I assist you today?',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    }
  ])

  const filteredContacts = contacts.filter(c => c.type === activeTab)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || isSending) return
    
    const userMessage = messageInput.trim()
    setMessageInput('')
    
    // Add user message to UI
    const userMsgId = `msg_${Date.now()}`
    setMessages(prev => [...prev, {
      id: userMsgId,
      senderId: 'me',
      content: userMessage,
      timestamp: new Date(),
      type: 'text'
    }])
    
    setIsSending(true)
    
    try {
      // Call AI Agent API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.message) {
        // Add agent response to UI
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_bot`,
          senderId: data.agent.type || 'andrew',
          content: data.message,
          timestamp: new Date(),
          type: 'text'
        }])
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: data.message }
        ])
      } else {
        // Fallback message
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_bot`,
          senderId: 'andrew',
          content: 'I apologize, but I\'m having trouble responding right now. Please try again.',
          timestamp: new Date(),
          type: 'text'
        }])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_bot`,
        senderId: 'andrew',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date(),
        type: 'text'
      }])
    } finally {
      setIsSending(false)
    }
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    // TODO: Implement logout logic
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header with Balance and Settings */}
        <div className="bg-gradient-to-br from-primary to-pink-500 px-6 pt-12 pb-8 relative">
          {/* Settings Menu Icon */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          {/* Settings dropdown menu */}
          {showMenu && (
            <div className="absolute top-16 right-6 bg-white rounded-xl shadow-lg overflow-hidden z-50 min-w-[200px]">
              <button
                onClick={() => {
                  console.log('Settings')
                  setShowMenu(false)
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Settings</span>
              </button>
              <button
                onClick={() => {
                  console.log('Help')
                  setShowMenu(false)
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left border-t border-gray-100"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Help Center</span>
              </button>
              <button
                onClick={() => {
                  handleLogout()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition text-left border-t border-gray-100"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-500">Logout</span>
              </button>
            </div>
          )}
          
          {/* User Info */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-white/80">{user.username}</p>
            </div>
          </div>
          
          {/* Balance Cards - Compact Version */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 mb-1.5">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-white mb-0.5">{user.energy.toLocaleString()}</p>
              <p className="text-xs text-white/80">Energy</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 mb-1.5">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-white mb-0.5">{user.points.toLocaleString()}</p>
              <p className="text-xs text-white/80">Points</p>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="px-4 pt-4">
          {!selectedChat ? (
            <>
              {/* Search and New Chat */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('1:1')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                    activeTab === '1:1'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 inline-block mr-2" />
                  1:1 Chat
                </button>
                <button
                  onClick={() => setActiveTab('group')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                    activeTab === 'group'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 inline-block mr-2" />
                  Group Chat
                </button>
              </div>

              {/* Contact List */}
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedChat(contact)}
                    className="w-full bg-white rounded-xl p-4 hover:shadow-md transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {contact.unread && contact.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">{contact.unread}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                          <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Chat Window */
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 320px)' }}>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary to-pink-500 text-white p-4 flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="p-1 hover:bg-white/20 rounded-full transition">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-xs text-white/80">{selectedChat.username}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 130px)' }}>
                {messages.map((message) => {
                  const isMe = message.senderId === 'me'
                  const isAndrew = message.senderId === 'andrew'
                  const isRay = message.senderId === 'ray'
                  const isFrank = message.senderId === 'frank'
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMe
                            ? 'bg-primary text-white rounded-tr-none'
                            : isAndrew
                            ? 'bg-gray-100 text-gray-900 rounded-tl-none border-l-4 border-blue-500'
                            : isRay
                            ? 'bg-purple-50 text-purple-900 rounded-tl-none border-l-4 border-purple-500'
                            : isFrank
                            ? 'bg-green-50 text-green-900 rounded-tl-none border-l-4 border-green-500'
                            : 'bg-gray-100 text-gray-900 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isSending}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSending}
                    className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

