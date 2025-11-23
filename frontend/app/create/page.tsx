'use client'

import { useRouter } from 'next/navigation'
import { User, Image, Video, Wand2, Sparkles, TrendingUp, LucideIcon, BarChart3, Search } from 'lucide-react'
import { useState } from 'react'

interface Feature {
  id: string
  title: string
  image?: string
  icon?: LucideIcon
  color?: string
  onClick: () => void
}

export default function CreatePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleProfileClick = () => {
    setShowInput(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      router.push(`/profile/${username.trim()}`)
    }
  }

  const features: Feature[] = [
    {
      id: 'profile',
      title: 'Profile Enhancement',
      image: '/profile.png',
      onClick: handleProfileClick
    },
    {
      id: 'image',
      title: 'Image Enhancement',
      icon: Image,
      color: 'from-purple-500 to-pink-500',
      onClick: () => console.log('Image enhancement coming soon')
    },
    {
      id: 'video',
      title: 'Video Editing',
      icon: Video,
      color: 'from-orange-500 to-red-500',
      onClick: () => console.log('Video editing coming soon')
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      icon: Wand2,
      color: 'from-green-500 to-emerald-500',
      onClick: () => console.log('AI assistant coming soon')
    },
    {
      id: 'batch-process',
      title: 'Batch Processing',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500',
      onClick: () => console.log('Batch processing coming soon')
    },
    {
      id: 'analytics',
      title: 'Data Analytics',
      icon: BarChart3,
      color: 'from-yellow-500 to-orange-500',
      onClick: () => console.log('Analytics')
    },
    {
      id: 'account-diagnosis',
      title: 'Account Diagnosis',
      icon: Search,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => console.log('Account diagnosis')
    }
  ]

  return (
    <div className="min-h-screen bg-[#f8f8f7] pb-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header with gradient background */}
        <div className="mb-6 pt-8 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-2">
            AI Creator Studio
          </h1>
          <p className="text-gray-600">Choose a tool to start creating amazing content</p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            const isComingSoon = feature.id !== 'profile'
            return (
              <button
                key={feature.id}
                onClick={feature.onClick}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 p-3 relative"
              >
                {/* Image or Icon Container - Square with padding */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  {feature.image ? (
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  ) : Icon ? (
                    <div className={`w-full h-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                  ) : null}
                  
                  {/* Coming Soon Badge */}
                  {isComingSoon && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <div className="pt-3 pb-1">
                  <h3 className="text-sm font-semibold text-gray-900 text-center">
                    {feature.title}
                  </h3>
                </div>
              </button>
            )
          })}
        </div>

        {/* Username Input Modal */}
        {showInput && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={() => setShowInput(false)}
          >
            <div 
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter TikTok Username</h2>
              <p className="text-gray-600 text-sm mb-6">We'll analyze your profile and help enhance your content</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@your_username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    autoFocus
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInput(false)
                      setUsername('')
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition transform hover:scale-105 active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

