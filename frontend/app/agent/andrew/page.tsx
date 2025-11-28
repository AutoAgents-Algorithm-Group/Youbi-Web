'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Zap, Bot, MessageCircle, Sparkles, Brain, Heart } from 'lucide-react'

export default function AndrewProfilePage() {
  const router = useRouter()
  const [andrew] = useState({
    name: 'Andrew',
    role: 'AI Butler',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Andrew&backgroundColor=b6e3f4',
    energy: 9999,
    description: 'I\'m Andrew, your personal AI butler. I\'m here to help you with anything you need - from enhancing your profile covers to connecting you with specialized agents for design and analytics.',
    specialties: [
      { icon: Sparkles, name: 'Image Enhancement', desc: 'Professional AI-powered image editing' },
      { icon: Brain, name: 'Smart Assistance', desc: 'Intelligent task delegation and support' },
      { icon: Heart, name: 'Always Available', desc: '24/7 ready to help you succeed' }
    ],
    stats: {
      tasksCompleted: '10,000+',
      usersHelped: '5,000+',
      responseTime: '< 1s'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 px-6 pt-12 pb-20 relative">
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-2xl font-bold text-white mb-1 text-center">AI Agent Profile</h1>
          <p className="text-white/80 text-center">Your Personal Assistant</p>
        </div>

        {/* Profile Card - overlapping header */}
        <div className="px-4 -mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <img
                  src={andrew.avatar}
                  alt={andrew.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{andrew.name}</h2>
              <p className="text-primary font-medium">{andrew.role}</p>
              
              {/* Energy Display */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900">{andrew.energy.toLocaleString()}</span>
                <span className="text-sm text-gray-600">Energy</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed">{andrew.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-900">{andrew.stats.tasksCompleted}</p>
                <p className="text-xs text-gray-600">Tasks</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-900">{andrew.stats.usersHelped}</p>
                <p className="text-xs text-gray-600">Users</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-900">{andrew.stats.responseTime}</p>
                <p className="text-xs text-gray-600">Response</p>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
              <div className="space-y-3">
                {andrew.specialties.map((specialty, index) => {
                  const Icon = specialty.icon
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{specialty.name}</h4>
                        <p className="text-sm text-gray-600">{specialty.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Continue Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 About Andrew:</span> Andrew is powered by advanced AI technology and continuously learns to provide better assistance. He can connect you with specialized agents like Ray (Design Expert) and Frank (Analytics Guru) when needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

