'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Send, Sparkles, MessageCircle, X, Minimize2, Upload } from 'lucide-react'
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
      content: 'Hello! I\'m Andrew, your AI butler. I can help you enhance covers or chat with you.',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([])
  const [isSending, setIsSending] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState('default')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Beautify prompt templates - Focus on people and filters only, no text overlay
  const promptTemplates = {
    default: {
      name: 'Default Enhancement',
      prompt: 'Enhance the people in this image with natural skin tone improvements, enhanced facial features clarity, and better lighting on faces. Apply professional color grading filters to improve overall image quality with vibrant but natural colors. Do NOT add any text or typography to the image.'
    },
    vibrant: {
      name: 'Vibrant Colors',
      prompt: 'Apply vibrant color filters to enhance the people in the image. Improve skin tones, brighten faces, and boost saturation for a lively, eye-catching look. Focus on making the subjects stand out with enhanced lighting. Do NOT add any text to the image.'
    },
    professional: {
      name: 'Professional Polish',
      prompt: 'Apply professional portrait enhancement focusing on the people in the image. Refine skin tones, enhance facial details, and apply balanced color grading filters. Create a polished, magazine-quality look without adding any text or overlays.'
    },
    dramatic: {
      name: 'Dramatic Impact',
      prompt: 'Apply dramatic filters with high contrast and cinematic lighting focused on the people. Enhance facial features, add depth with shadows and highlights, and create an impactful visual style. Do NOT add text or typography.'
    },
    minimal: {
      name: 'Minimal Clean',
      prompt: 'Apply subtle, clean filters to enhance the people naturally. Gentle skin retouching, soft color correction, and refined lighting. Keep the enhancement minimal and authentic-looking. Do NOT add any text to the image.'
    }
  }

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

  const getRandomEnhancingMessage = () => {
    const messages = [
      '🎨 Sprinkling some magic dust on your cover...',
      '✨ Making your thumbnail irresistible...',
      '🚀 Boosting those colors to the next level...',
      '💫 Adding that wow factor...',
      '🎭 Transforming pixels into art...',
      '🌟 Cranking up the visual appeal...',
      '🎪 Making your content pop like fireworks...',
      '🔥 Heating up those colors...',
      '💎 Polishing your masterpiece...',
      '🎯 Optimizing for maximum impact...'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const handleBeautifySelected = async () => {
    if (!profile || selectedVideos.length === 0) {
      return
    }

    const funMessages = [
      '✨ Casting some AI magic spells...',
      '🎨 Painting with pixels and dreams...',
      '🚀 Launching beauty rockets...',
      '💫 Sprinkling digital fairy dust...',
      '🎭 Transforming pixels into masterpieces...',
      '🌟 Making your photos Instagram-jealous...',
      '🎪 Rolling out the red carpet for your images...',
      '🔮 Consulting the crystal ball of beauty...',
      '💎 Polishing those gems to perfection...',
      '🎯 Hitting that sweet spot of stunning...',
      '🌈 Adding a rainbow of awesomeness...',
      '🎨 Bob Ross would be proud...',
      '✨ Bibbidi-Bobbidi-Boo! Working on it...',
      '🔥 Heating up those cold pixels...',
      '💖 Giving your covers some extra love...'
    ]

    const getRandomMessage = () => funMessages[Math.floor(Math.random() * funMessages.length)]

    setIsProcessing(true)
    setProcessingProgress(`${getRandomMessage()} Starting batch enhancement...`)

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < selectedVideos.length; i++) {
      const videoId = selectedVideos[i]
      const videoIndex = profile.videos.findIndex(v => v.id === videoId)
      
      if (videoIndex === -1) continue

      const video = profile.videos[videoIndex]
      
      try {
        setProcessingProgress(`[${i + 1}/${selectedVideos.length}] ${getRandomMessage()}`)

        const originalCover = video.cover
        const coverImage = originalCover.includes('/api/proxy-image?url=')
          ? decodeURIComponent(originalCover.split('url=')[1]?.split('&')[0] || originalCover)
          : originalCover
        
        const prompt = promptTemplates[selectedPromptTemplate as keyof typeof promptTemplates]?.prompt || promptTemplates.default.prompt
        
        const editResponse = await imageApi.editImage(coverImage, prompt)
        const taskId = editResponse.data.taskId

        // Poll for result
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
              setProcessingProgress(`[${i + 1}/${selectedVideos.length}] 🎉 Boom! Looking absolutely fire!`)
            } else if (status === 'TASK_STATUS_FAILED') {
              failCount++
              beautified = true
              setProcessingProgress(`[${i + 1}/${selectedVideos.length}] ❌ Oops! This one didn't cooperate...`)
            }
          } catch (error) {
            // Continue polling
          }
          
          attempts++
        }

        if (!beautified) {
          failCount++
          setProcessingProgress(`[${i + 1}/${selectedVideos.length}] ⏱️ Taking too long... moving on!`)
        }
      } catch (error) {
        failCount++
        setProcessingProgress(`[${i + 1}/${selectedVideos.length}] 💥 Something went kaboom!`)
      }
    }

    setProcessingProgress(`🎊 Mission accomplished! ${successCount} stunning covers created! ${failCount > 0 ? `(${failCount} rebels refused to cooperate 😅)` : 'Perfect score! 💯'}`)
    setTimeout(() => {
      setIsProcessing(false)
      setProcessingProgress('')
      setIsSelectionMode(false)
      setSelectedVideos([])
    }, 3000)
  }

  const handleBeautifyCover = async () => {
    if (!profile || !profile.videos[0]) {
      return
    }

    const funMessages = [
      '✨ Waving the magic wand...',
      '🎨 Painting with AI brushes...',
      '🚀 Launching into beauty space...',
      '💫 Sprinkling stardust...',
      '🎭 Creating a masterpiece...',
      '🌟 Making it shine...',
      '🎪 Rolling out the magic carpet...',
      '🔮 Consulting the beauty oracle...',
      '💎 Turning pixels into diamonds...',
      '🎯 Aiming for perfection...'
    ]

    const getRandomMessage = () => funMessages[Math.floor(Math.random() * funMessages.length)]

    setIsProcessing(true)
    setProcessingProgress(getRandomMessage())

    try {
      const originalCover = profile.videos[0].cover
      
      console.log('Start enhancing cover:', {
        originalCoverURL: originalCover,
        usingProxy: originalCover.includes('/api/proxy-image')
      })
      
      // If it's a proxy URL, extract the original URL
      const coverImage = originalCover.includes('/api/proxy-image?url=')
        ? decodeURIComponent(originalCover.split('url=')[1]?.split('&')[0] || originalCover)
        : originalCover
      
      console.log('Submit enhancement task:', coverImage)
      
      const prompt = promptTemplates[selectedPromptTemplate as keyof typeof promptTemplates]?.prompt || promptTemplates.default.prompt
      
      // Submit image editing task
      const editResponse = await imageApi.editImage(coverImage, prompt)
      const taskId = editResponse.data.taskId
      
      console.log('Task ID:', taskId)

      setProcessingProgress('🎨 AI is working its magic...')

      // Poll for result
      let attempts = 0
      const maxAttempts = 30 // Max wait 30 seconds
      
      const checkTask = async () => {
        try {
          const resultResponse = await imageApi.getTaskResult(taskId)
          const { status, images, progress } = resultResponse.data
          
          console.log('Task status query:', { 
            status: status, 
            progress: progress,
            imageCount: images?.length || 0
          })

          if (status === 'TASK_STATUS_SUCCEED' && images.length > 0) {
            const beautifiedImage = images[0].image_url
            
            // Use proxy URL to solve CORS issues
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(beautifiedImage)}&t=${Date.now()}`
            
            console.log('Image enhancement successful!')
            
            setProfile(prev => {
              if (!prev) return prev
              const updatedVideos = [...prev.videos]
              updatedVideos[0] = {
                ...updatedVideos[0],
                cover: proxyUrl
              }
              return {
                ...prev,
                videos: updatedVideos
              }
            })
            
            setProcessingProgress('🎉 Boom! Looking absolutely stunning!')
            setTimeout(() => {
              setIsProcessing(false)
              setProcessingProgress('')
            }, 2000)
          } else if (status === 'TASK_STATUS_FAILED') {
            setProcessingProgress('❌ Oops! Something went wrong...')
            setTimeout(() => {
              setIsProcessing(false)
              setProcessingProgress('')
            }, 2000)
          } else if (attempts < maxAttempts) {
            attempts++
            // Update with fun messages periodically
            if (attempts % 3 === 0) {
              setProcessingProgress(getRandomMessage())
            }
            setTimeout(checkTask, 1000) // Retry after 1 second
          } else {
            setProcessingProgress('⏱️ Taking longer than expected... try again?')
            setTimeout(() => {
              setIsProcessing(false)
              setProcessingProgress('')
            }, 2000)
          }
        } catch (error) {
          console.error('Failed to query task:', error)
          setProcessingProgress('💥 Failed to check status...')
          setTimeout(() => {
            setIsProcessing(false)
            setProcessingProgress('')
          }, 2000)
        }
      }

      setTimeout(checkTask, 1000) // Start querying after 1 second
    } catch (error) {
      console.error('Failed to enhance cover:', error)
      setProcessingProgress('💥 Enhancement failed! Please try again.')
      setTimeout(() => {
        setIsProcessing(false)
        setProcessingProgress('')
      }, 2000)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isSending) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    addMessage('user', userMessage)
    setIsSending(true)

    try {
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
        addMessage('bot', data.message)
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: data.message }
        ])
      } else {
        addMessage('bot', 'I apologize, but I\'m having trouble responding right now. Please try again.')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      addMessage('bot', 'I apologize, but I\'m having trouble connecting right now. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleUploadClick = () => {
    setShowUploadDialog(true)
  }

  const handleUploadVideo = () => {
    console.log('Upload video functionality')
    // TODO: Implement video upload
    addMessage('system', '🎬 Video upload feature coming soon! Stay tuned for the ability to upload and enhance your own videos.')
    setShowUploadDialog(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 顶部 Header 区域 */}
      {profile && !loading && !error && (
        <div className="fixed top-0 left-0 right-0 h-auto bg-white z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
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

              {/* Middle: Template selector (show when selection mode or enhancing) */}
              {(isSelectionMode || isProcessing) && (
                <div className="flex-1 max-w-xs">
                  <select
                    value={selectedPromptTemplate}
                    onChange={(e) => setSelectedPromptTemplate(e.target.value)}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {Object.entries(promptTemplates).map(([key, template]) => (
                      <option key={key} value={key}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Right: Batch enhance button (only show in selection mode) */}
              {isSelectionMode && selectedVideos.length > 0 && (
                <button
                  onClick={handleBeautifySelected}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enhance {selectedVideos.length}</span>
                </button>
              )}
            </div>
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
            onUploadClick={handleUploadClick}
          />
        ) : (
          <div className="h-screen flex items-center justify-center text-gray-500">
            Unable to load profile
          </div>
        )}
      </div>

      {/* 右下角浮窗按钮 - 移到中间右边 */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-1/2 right-6 transform -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center z-50 animate-pulse"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}

      {/* 聊天浮窗 - 位置移到中间右边 */}
      {isChatOpen && (
        <div className="fixed top-1/2 right-6 transform -translate-y-1/2 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
          {/* Floating window title bar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-pink-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Andrew - AI Butler</h3>
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
                disabled={isSending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upload Video Dialog */}
      {showUploadDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUploadDialog(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Video</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:border-primary transition">
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-2">Drag and drop your video here</p>
              <p className="text-sm text-gray-400">or click to browse</p>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-block mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full cursor-pointer transition"
              >
                Choose Video
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Upload your video to our platform, then beautify the cover to make it stand out!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadDialog(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadVideo}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Progress Bar for Enhancement */}
      {isProcessing && processingProgress && (
        <div 
          className="fixed left-0 right-0 z-50 px-4 animate-in slide-in-from-bottom duration-300"
          style={{ bottom: 'calc(33.33vh)' }}
        >
          <div className="max-w-2xl mx-auto bg-black/70 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium flex-1">{processingProgress}</p>
              <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

