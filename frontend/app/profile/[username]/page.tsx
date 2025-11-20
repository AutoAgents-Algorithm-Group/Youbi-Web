'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Send, Sparkles, MessageCircle, X, Minimize2 } from 'lucide-react'
import { profileApi, imageApi } from '@/lib/api-client'
import type { TikTokProfile, ChatMessage } from '@/lib/types/youbi'
import TikTokCard from '@/components/youbi/TikTokCard'
import ChatWindow from '@/components/youbi/ChatWindow'

export default function Profile() {
  const params = useParams()
  const username = params.username as string
  
  const [profile, setProfile] = useState<TikTokProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Hello! I\'m your AI assistant, I can help you enhance covers or chat with you ✨',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (username) {
      fetchProfile()
    }
  }, [username])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await profileApi.getProfile(username)
      setProfile(response.data.profile)
    } catch (error: any) {
      console.error('Failed to fetch profile:', error)
      const errorMessage = error.response?.data?.message || 'Failed to fetch TikTok info, please try again later'
      const errorDetails = error.response?.data?.details || []
      
      setError(errorMessage)
      
      // Show error details in chat window
      addMessage('system', `❌ ${errorMessage}`)
      if (errorDetails.length > 0) {
        addMessage('system', `Details:\n${errorDetails.join('\n')}`)
      }
      addMessage('system', '💡 Tip: Please ensure you have a valid RapidAPI key configured, or try another username.')
    } finally {
      setLoading(false)
    }
  }

  const addMessage = (type: 'user' | 'bot' | 'system', content: string, imageUrl?: string) => {
    console.log('💬 Add message:', { type, content, imageUrl })
    const newMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random()}`,
      type,
      content,
      timestamp: new Date(),
      imageUrl
    }
    setMessages(prev => [...prev, newMessage])
  }

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId)
      } else {
        return [...prev, videoId]
      }
    })
  }

  const handleBeautifySelected = async () => {
    if (!profile || selectedVideos.length === 0) {
      addMessage('system', 'Please select videos to enhance')
      return
    }

    setIsProcessing(true)
    setIsChatOpen(true)
    addMessage('user', `Batch enhance ${selectedVideos.length} covers`)
    addMessage('bot', `Enhancing ${selectedVideos.length} covers for you, please wait... 🎨`)

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < selectedVideos.length; i++) {
      const videoId = selectedVideos[i]
      const videoIndex = profile.videos.findIndex(v => v.id === videoId)
      
      if (videoIndex === -1) continue

      const video = profile.videos[videoIndex]
      
      try {
        addMessage('bot', `[${i + 1}/${selectedVideos.length}] Enhancing: ${video.title || 'Video'}`)

        const originalCover = video.cover
        const coverImage = originalCover.includes('/api/proxy-image?url=')
          ? decodeURIComponent(originalCover.split('url=')[1]?.split('&')[0] || originalCover)
          : originalCover
        
        const prompt = 'Dramatically enhance the color saturation and contrast of this image, increase vibrancy and lighting effects to make the scene more vivid and impactful. Enhance detail clarity and sharpness. Add eye-catching and attractive English text titles or slogans on the image. The text should be large and clear, with prominent colors, positioned appropriately to attract audience attention. The text content should be short, powerful, and engaging.'
        
        const editResponse = await imageApi.editImage(coverImage, prompt)
        const taskId = editResponse.data.taskId

        // 轮询查询结果
        let attempts = 0
        const maxAttempts = 30
        let beautified = false

        while (attempts < maxAttempts && !beautified) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          try {
            const resultResponse = await imageApi.getTaskResult(taskId)
            const { status, images } = resultResponse.data

            if (status === 'TASK_STATUS_SUCCEED' && images.length > 0) {
              const beautifiedImage = images[0].image_url
              const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(beautifiedImage)}&t=${Date.now()}`
              
              setProfile(prev => {
                if (!prev) return prev
                const updatedVideos = [...prev.videos]
                updatedVideos[videoIndex] = {
                  ...updatedVideos[videoIndex],
                  cover: proxyUrl
                }
                return { ...prev, videos: updatedVideos }
              })
              
              successCount++
              beautified = true
              addMessage('bot', `✅ [${i + 1}/${selectedVideos.length}] Enhanced successfully`)
            } else if (status === 'TASK_STATUS_FAILED') {
              failCount++
              beautified = true
              addMessage('bot', `❌ [${i + 1}/${selectedVideos.length}] Enhancement failed`)
            }
          } catch (error) {
            // 继续轮询
          }
          
          attempts++
        }

        if (!beautified) {
          failCount++
          addMessage('bot', `⏱️ [${i + 1}/${selectedVideos.length}] Enhancement timeout`)
        }
      } catch (error) {
        failCount++
        addMessage('bot', `❌ [${i + 1}/${selectedVideos.length}] Enhancement failed`)
      }
    }

    addMessage('bot', `🎉 Batch enhancement complete! Success: ${successCount}, Failed: ${failCount}`)
    setIsProcessing(false)
    setIsSelectionMode(false)
    setSelectedVideos([])
  }

  const handleBeautifyCover = async () => {
    if (!profile || !profile.videos[0]) {
      addMessage('system', 'No cover image found')
      return
    }

    setIsProcessing(true)
    setIsChatOpen(true)
    addMessage('user', 'Enhance cover')
    addMessage('bot', 'Enhancing your cover, please wait... 🎨')

    try {
      const originalCover = profile.videos[0].cover
      
      console.log('🎨 Start enhancing cover:', {
        originalCoverURL: originalCover,
        usingProxy: originalCover.includes('/api/proxy-image')
      })
      
      // If it's a proxy URL, extract the original URL
      const coverImage = originalCover.includes('/api/proxy-image?url=')
        ? decodeURIComponent(originalCover.split('url=')[1]?.split('&')[0] || originalCover)
        : originalCover
      
      console.log('📤 Submit enhancement task:', coverImage)
      
      const prompt = 'Dramatically enhance the color saturation and contrast of this image, increase vibrancy and lighting effects to make the scene more vivid and impactful. Enhance detail clarity and sharpness. Add eye-catching and attractive English text titles or slogans on the image. The text should be large and clear, with prominent colors, positioned appropriately to attract audience attention. The text content should be short, powerful, and engaging.'
      
      // Submit image editing task
      const editResponse = await imageApi.editImage(coverImage, prompt)
      const taskId = editResponse.data.taskId
      
      console.log('✅ Task ID:', taskId)

      // Poll for result
      let attempts = 0
      const maxAttempts = 30 // Max wait 30 seconds
      
      const checkTask = async () => {
        try {
          const resultResponse = await imageApi.getTaskResult(taskId)
          const { status, images, progress } = resultResponse.data
          
          console.log('📋 Task status query:', { 
            status: status, 
            progress: progress,
            imageCount: images?.length || 0,
            fullResponse: resultResponse.data
          })

          if (status === 'TASK_STATUS_SUCCEED' && images.length > 0) {
            const beautifiedImage = images[0].image_url
            
            // Use proxy URL to solve CORS issues
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(beautifiedImage)}&t=${Date.now()}`
            
            console.log('✅ Image enhancement successful!', {
              taskStatus: status,
              originalImageURL: beautifiedImage,
              proxyURL: proxyUrl,
              imageChanged: !originalCover.includes(beautifiedImage)
            })
            
            console.log('📊 Comparison info:', {
              oldCover: originalCover.substring(0, 100) + '...',
              newCover: proxyUrl.substring(0, 100) + '...',
              isSame: originalCover === proxyUrl
            })
            
            setProfile(prev => {
              if (!prev) return prev
              const oldCover = prev.videos[0].cover
              const updatedVideos = [...prev.videos]
              updatedVideos[0] = {
                ...updatedVideos[0],
                cover: proxyUrl
              }
              console.log('🔄 Cover update:', {
                before: oldCover.substring(0, 50) + '...',
                after: proxyUrl.substring(0, 50) + '...'
              })
              return {
                ...prev,
                videos: updatedVideos
              }
            })
            
            // Add completion message
            const comparisonMessage = `✨ Cover enhancement complete!`
            
            addMessage('bot', comparisonMessage, proxyUrl)
            setIsProcessing(false)
          } else if (status === 'TASK_STATUS_FAILED') {
            addMessage('bot', 'Sorry, enhancement failed. Please try again later')
            setIsProcessing(false)
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(checkTask, 1000) // Retry after 1 second
          } else {
            addMessage('bot', 'Enhancement timeout, please try again later')
            setIsProcessing(false)
          }
        } catch (error) {
          console.error('Failed to query task:', error)
          addMessage('bot', 'Failed to query enhancement result')
          setIsProcessing(false)
        }
      }

      setTimeout(checkTask, 1000) // Start querying after 1 second
    } catch (error) {
      console.error('Failed to enhance cover:', error)
      addMessage('bot', 'Failed to enhance cover, please try again later')
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
      console.error('Failed to send message:', error)
      addMessage('bot', 'Got it! I\'m learning how to better respond to you 🤖')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 顶部 Header 区域 */}
      {profile && !loading && !error && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white z-40">
          <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
            {/* Left: Select button */}
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode)
                setSelectedVideos([])
              }}
              className="px-5 py-2 bg-white text-primary border-2 border-primary rounded-full font-medium hover:bg-primary hover:text-white transition"
            >
              {isSelectionMode ? 'Cancel' : 'Select'}
            </button>

            {/* Right: Batch enhance button (only show in selection mode) */}
            {isSelectionMode && selectedVideos.length > 0 && (
              <button
                onClick={handleBeautifySelected}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enhance {selectedVideos.length} covers</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 全屏 Profile 卡片 - 添加顶部 padding */}
      <div className={`min-h-screen overflow-y-auto bg-white pb-20 ${profile && !loading && !error ? 'pt-16' : ''}`}>
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="h-screen flex items-center justify-center px-6">
            <div className="max-w-md text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to fetch user data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchProfile}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : profile ? (
          <TikTokCard 
            profile={profile}
            isSelectionMode={isSelectionMode}
            selectedVideos={selectedVideos}
            onToggleSelection={toggleVideoSelection}
          />
        ) : (
          <div className="h-screen flex items-center justify-center text-gray-500">
            Unable to load profile
          </div>
        )}
      </div>

      {/* 右下角浮窗按钮 */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-20 right-6 w-16 h-16 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center z-50"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}

      {/* 聊天浮窗 */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Floating window title bar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-pink-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat message area */}
          <div className="flex-1 overflow-hidden">
            <ChatWindow messages={messages} />
          </div>

          {/* Input box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isProcessing}
                className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

