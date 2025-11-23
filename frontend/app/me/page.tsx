'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Wallet, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Zap,
  Coins,
  Menu
} from 'lucide-react'

export default function MePage() {
  // Mock user data
  const [user] = useState({
    name: 'User',
    username: '@user123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    energy: 850,
    points: 12500
  })

  const [showMenu, setShowMenu] = useState(false)

  const menuSections = [
    {
      title: 'Wallet',
      items: [
        {
          icon: Zap,
          label: 'Energy',
          value: user.energy.toLocaleString(),
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50'
        },
        {
          icon: Coins,
          label: 'Points',
          value: user.points.toLocaleString(),
          color: 'text-orange-500',
          bgColor: 'bg-orange-50'
        }
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', href: '/settings/profile' },
        { icon: Bell, label: 'Notifications', href: '/settings/notifications' },
        { icon: Shield, label: 'Privacy & Security', href: '/settings/privacy' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', href: '/help' },
        { icon: Settings, label: 'App Settings', href: '/settings' }
      ]
    }
  ]

  const handleLogout = () => {
    console.log('Logout clicked')
    // Implement logout logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header with gradient background and settings icon */}
        <div className="bg-gradient-to-br from-primary to-pink-500 px-6 pt-12 pb-20 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          {/* Settings dropdown menu */}
          {showMenu && (
            <div className="absolute top-16 right-6 bg-white rounded-xl shadow-lg overflow-hidden z-10 min-w-[200px]">
              <button
                onClick={() => console.log('Settings')}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Settings</span>
              </button>
              <button
                onClick={() => console.log('Help')}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left border-t border-gray-100"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Help Center</span>
              </button>
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
          <p className="text-white/80">Manage your account and settings</p>
        </div>

        {/* User Card - overlapping header */}
        <div className="px-4 -mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="px-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
            Wallet
          </h3>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-50 mb-3">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{user.energy.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Energy</p>
              </div>
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mb-3">
                  <Coins className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{user.points.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Points</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition">
                Top Up Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.slice(1).map((section, sectionIdx) => (
          <div key={section.title} className="px-4 mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
              {section.title}
            </h3>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden divide-y divide-gray-100">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon
                return (
                  <button
                    key={itemIdx}
                    onClick={() => console.log(`Navigate to ${item.label}`)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="flex-1 text-left font-medium text-gray-900">{item.label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="px-4 mt-6 mb-8">
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-center gap-3 text-red-500 font-medium hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

