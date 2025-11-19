'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Send, Sparkles } from 'lucide-react'
import { profileApi, imageApi } from '@/lib/api-client'
import type { TikTokProfile, ChatMessage } from '@/lib/types/youbi'
import TikTokCard from '@/components/youbi/TikTokCard'
import ChatWindow from '@/components/youbi/ChatWindow'

export default function Profile() {
  const params = useParams()
  const username = params.username as string
  
  const [profile, setProfile] = useState<TikTokProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: '你好！我是你的 AI 助手，可以帮你美化封面或者聊天互动 ✨',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (username) {
      fetchProfile()
    }
  }, [username])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await profileApi.getProfile(username)
      setProfile(response.data.profile)
    } catch (error) {
      console.error('获取 Profile 失败:', error)
      addMessage('system', '获取 TikTok 信息失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const addMessage = (type: 'user' | 'bot' | 'system', content: string, imageUrl?: string) => {
    console.log('💬 添加消息:', { type, content, imageUrl })
    const newMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random()}`,
      type,
      content,
      timestamp: new Date(),
      imageUrl
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleBeautifyCover = async () => {
    if (!profile || !profile.videos[0]) {
      addMessage('system', '没有找到可用的封面图片')
      return
    }

    setIsProcessing(true)
    addMessage('user', '一键美化封面')
    addMessage('bot', '正在为你美化封面，请稍候... 🎨')

    try {
      const originalCover = profile.videos[0].cover
      
      console.log('🎨 开始美化封面:', {
        原始封面URL: originalCover,
        是否使用代理: originalCover.includes('/api/proxy-image')
      })
      
      // 如果是代理 URL，提取原始 URL
      const coverImage = originalCover.includes('/api/proxy-image?url=')
        ? decodeURIComponent(originalCover.split('url=')[1]?.split('&')[0] || originalCover)
        : originalCover
      
      console.log('📤 提交美化任务:', coverImage)
      
      const prompt = '大幅增强这张图片的色彩饱和度和对比度，增加鲜艳度和光影效果，让画面更加生动有冲击力，增强细节清晰度和锐度。同时在图片上添加醒目的吸引人的中文文字标题或标语，文字要大而清晰，颜色鲜明突出，位置合理，能够吸引观众注意力。文字内容要简短有力，富有感染力'
      
      // 提交图像编辑任务
      const editResponse = await imageApi.editImage(coverImage, prompt)
      const taskId = editResponse.data.taskId
      
      console.log('✅ 任务ID:', taskId)

      // 轮询查询结果
      let attempts = 0
      const maxAttempts = 30 // 最多等待30秒
      
      const checkTask = async () => {
        try {
          const resultResponse = await imageApi.getTaskResult(taskId)
          const { status, images, progress } = resultResponse.data
          
          console.log('📋 任务状态查询:', { 
            状态: status, 
            进度: progress,
            图片数量: images?.length || 0,
            完整响应: resultResponse.data
          })

          if (status === 'TASK_STATUS_SUCCEED' && images.length > 0) {
            const beautifiedImage = images[0].image_url
            
            // 使用代理 URL 解决跨域问题
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(beautifiedImage)}&t=${Date.now()}`
            
            console.log('✅ 图片美化成功！', {
              任务状态: status,
              原始图片URL: beautifiedImage,
              代理URL: proxyUrl,
              图片是否改变: !originalCover.includes(beautifiedImage)
            })
            
            console.log('📊 对比信息:', {
              旧封面: originalCover.substring(0, 100) + '...',
              新封面: proxyUrl.substring(0, 100) + '...',
              是否相同: originalCover === proxyUrl
            })
            
            setProfile(prev => {
              if (!prev) return prev
              const oldCover = prev.videos[0].cover
              const updatedVideos = [...prev.videos]
              updatedVideos[0] = {
                ...updatedVideos[0],
                cover: proxyUrl
              }
              console.log('🔄 封面更新:', {
                更新前: oldCover.substring(0, 50) + '...',
                更新后: proxyUrl.substring(0, 50) + '...'
              })
              return {
                ...prev,
                videos: updatedVideos
              }
            })
            
            // 添加对比信息到消息中
            const comparisonMessage = `✨ 封面美化完成！

📊 对比信息：
原始图片: ${originalCover.includes('placeholder') ? '占位图' : '真实封面'}
美化后图片: ${beautifiedImage.substring(0, 60)}...

🎯 已自动替换第一个作品封面，向上滚动查看效果！`
            
            addMessage('bot', comparisonMessage, proxyUrl)
            setIsProcessing(false)
          } else if (status === 'TASK_STATUS_FAILED') {
            addMessage('bot', '抱歉，美化失败了，请稍后重试')
            setIsProcessing(false)
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(checkTask, 1000) // 1秒后重试
          } else {
            addMessage('bot', '美化超时，请稍后重试')
            setIsProcessing(false)
          }
        } catch (error) {
          console.error('查询任务失败:', error)
          addMessage('bot', '查询美化结果失败')
          setIsProcessing(false)
        }
      }

      setTimeout(checkTask, 1000) // 1秒后开始查询
    } catch (error) {
      console.error('美化封面失败:', error)
      addMessage('bot', '美化封面失败，请稍后重试')
      setIsProcessing(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isProcessing) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    addMessage('user', userMessage)

    try {
      const response = await profileApi.sendMessage(username, userMessage)
      addMessage('bot', response.data.response.message)
    } catch (error) {
      console.error('发送消息失败:', error)
      addMessage('bot', '收到！我正在学习如何更好地回复你 🤖')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 上半屏 - TikTok Profile 卡片 (55%) */}
      <div className="h-[55vh] overflow-y-auto bg-white border-b border-gray-200">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : profile ? (
          <TikTokCard profile={profile} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            无法加载 Profile
          </div>
        )}
      </div>

      {/* 下半屏 - 对话窗口 (45%) */}
      <div className="h-[45vh] flex flex-col bg-white">
        {/* 快捷操作按钮 */}
        <div className="flex gap-2 p-3 border-b border-gray-100 bg-gray-50">
          <button
            onClick={handleBeautifyCover}
            disabled={isProcessing || !profile}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            一键美化封面
          </button>
        </div>

        {/* 聊天消息区域 */}
        <ChatWindow messages={messages} />

        {/* 输入框 */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="输入消息..."
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isProcessing}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

