'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, MessageCircle, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  
  const tabs = [
    {
      name: 'Create',
      href: '/create',
      icon: Home,
      active: pathname === '/create' || pathname === '/'
    },
    {
      name: 'Explore',
      href: '/explorer',
      icon: Compass,
      active: pathname === '/explorer'
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageCircle,
      active: pathname === '/chat'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  tab.active
                    ? 'text-pink-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

