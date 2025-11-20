'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, User as UserIcon, ImageIcon } from 'lucide-react'
import type { ChatMessage } from '@/lib/types/youbi'

interface ChatWindowProps {
  messages: ChatMessage[]
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* 头像 */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user'
                ? 'bg-primary'
                : message.type === 'bot'
                ? 'bg-secondary'
                : 'bg-gray-400'
            }`}
          >
            {message.type === 'user' ? (
              <UserIcon className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          {/* 消息内容 */}
          <div
            className={`flex-1 max-w-[75%] ${
              message.type === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : message.type === 'bot'
                  ? 'bg-gray-100 text-gray-900 rounded-tl-none'
                  : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              
              {/* 如果有图片 */}
              {message.imageUrl && (
                <ImagePreview imageUrl={message.imageUrl} />
              )}
            </div>
            
            <p className="text-xs text-gray-400 mt-1 px-2">
              {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

// 图片预览组件，带加载和错误处理
function ImagePreview({ imageUrl }: { imageUrl: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 提取原始 URL（用于打开新标签页）
  const originalUrl = imageUrl.includes('/api/proxy-image?url=') 
    ? decodeURIComponent(imageUrl.split('url=')[1]?.split('&')[0] || imageUrl)
    : imageUrl

  return (
    <div className="mt-2 rounded-lg overflow-hidden bg-gray-100 max-w-xs">
      {loading && !error && (
        <div className="flex items-center justify-center h-32 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 p-4">
          <ImageIcon className="w-8 h-8 mb-2" />
          <p className="text-xs text-center">Failed to load image</p>
          <a 
            href={originalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mt-2"
          >
            Open original in new tab
          </a>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt="Enhanced cover"
          className="w-full h-auto rounded-lg"
          loading="eager"
          onLoad={() => {
            console.log('✅ Image loaded successfully:', imageUrl)
            setLoading(false)
          }}
          onError={(e) => {
            console.error('❌ Failed to load image:', imageUrl, e)
            setLoading(false)
            setError(true)
          }}
          style={{ display: loading ? 'none' : 'block' }}
        />
      )}
    </div>
  )
}
