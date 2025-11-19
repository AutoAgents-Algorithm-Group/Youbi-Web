'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Music, Sparkles, Users, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function YoubiWelcome() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      router.push(`/profile/${username.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <Music className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Youbi</h1>
          <p className="text-white/90 text-lg">TikTok KOL 赋能工具</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            开始你的创作之旅
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                输入你的 TikTok 用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@your_username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95"
            >
              开始使用
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <Link 
              href="/explorer"
              className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              探索社区
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Sparkles className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-gray-600">AI 美化</p>
              </div>
              <div>
                <MessageCircle className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-gray-600">智能对话</p>
              </div>
              <div>
                <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-gray-600">社区互动</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}