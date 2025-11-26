'use client'

import { useRouter } from 'next/navigation'
import { MoreHorizontal, BarChart3, Search, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function CreatePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      router.push(`/profile/${username.trim()}`)
    }
  }

  const comingSoonFeatures = [
    {
      id: 'analytics',
      title: 'Data Analytics',
      description: 'Analyze your TikTok performance and growth trends',
      icon: BarChart3,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'account-diagnosis',
      title: 'Account Diagnosis',
      description: 'Get insights and recommendations for your account',
      icon: Search,
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  return (
    <div className="min-h-screen bg-[#f8f8f7] pb-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header with More button */}
        <div className="mb-6 pt-8 pb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-2">
              AI Creator Studio
            </h1>
            <p className="text-gray-600">Enhance your TikTok profile and content</p>
          </div>
          
          {/* More Button */}
          <button
            onClick={() => setShowComingSoon(true)}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Main Profile Enhancement Card with Input */}
        <div className="mb-8">
          <div className="w-full bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* Before/After Comparison Container */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
              <div className="flex h-full">
                {/* Before (Left Half) */}
                <div className="w-1/2 relative bg-gray-200 flex items-center justify-center border-r-2 border-white">
                  {/* Placeholder for before image - can be replaced with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-6xl">📷</span>
                      </div>
                      <p className="text-gray-600 font-medium">Original Cover</p>
                    </div>
                  </div>
                  {/* Before Badge - moved after content for higher z-index */}
                  <div className="absolute top-4 left-4 bg-gray-700/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg z-20">
                    Before
                  </div>
                </div>
                
                {/* After (Right Half) */}
                <div className="w-1/2 relative bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                  {/* Placeholder for after image - can be replaced with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                        <span className="text-6xl">✨</span>
                      </div>
                      <p className="text-white font-medium">AI Enhanced</p>
                    </div>
                  </div>
                  {/* After Badge - moved after content for higher z-index */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg z-20">
                    <span className="text-lg">✨</span>
                    <span>After</span>
                  </div>
                </div>
              </div>
              
              {/* Center Divider with Arrow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gray-100">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
            
            {/* Content with Input */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Profile Enhancement
              </h2>
              <p className="text-gray-600 mb-6">
                Enhance your TikTok profile covers with AI-powered image editing. Make your content stand out!
              </p>
              
              {/* Username Input Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="TikTok username"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-base placeholder:text-gray-400"
                  required
                />
                <button
                  type="submit"
                  disabled={!username.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Go</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">💡 Tip:</span> Enter your TikTok username to start enhancing your profile covers with professional filters and effects.
          </p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowComingSoon(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
                <p className="text-gray-600 text-sm mt-1">Exciting features we're working on</p>
              </div>
              <button
                onClick={() => setShowComingSoon(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {comingSoonFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Stay tuned! We're constantly adding new features to help you grow.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

