'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Send, Sparkles, MessageCircle, X, Minimize2, Upload } from 'lucide-react'
import { profileApi, imageApi } from '@/lib/api-client'
import type { TikTokProfile, ChatMessage } from '@/lib/types/youbi'
import TikTokCard from '@/components/youbi/TikTokCard'
import ChatWindow from '@/components/youbi/ChatWindow'

export default function Profile() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  
  // Andrew's avatar
  const andrewAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=Andrew&backgroundColor=b6e3f4'
  
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
  const [originalCovers, setOriginalCovers] = useState<{ [videoId: string]: string }>({})
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Beautify prompt templates - Focus on subtle, natural enhancements
  const promptTemplates = {
    default: {
      name: 'Default Enhancement',
      prompt: 'Apply subtle natural enhancements. Minimal skin retouching preserving texture. Gentle lighting and balanced color grading. Maintain authentic facial features. No text overlays.'
    },
    vibrant: {
      name: 'Vibrant Colors',
      prompt: 'Vibrant color filters with natural people. Minimal skin adjustments, preserve facial features. Focus on environmental colors. Subtle lighting improvements. No text.'
    },
    professional: {
      name: 'Professional Polish',
      prompt: 'Professional portrait enhancement with authenticity. Preserve natural skin texture, original facial features. Balanced color grading, subtle lighting. Refined magazine-quality look. No text.'
    },
    dramatic: {
      name: 'Dramatic Impact',
      prompt: 'Dramatic cinematic lighting while maintaining natural faces. High contrast, atmospheric effects. Realistic skin texture. Preserve authentic appearance. No text.'
    },
    minimal: {
      name: 'Minimal Clean',
      prompt: 'Ultra-subtle barely-visible enhancements. Complete natural appearance including skin texture. Very gentle lighting and color adjustments. Maximum authenticity. No text.'
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
      const fetchedProfile = response.data.profile
      setProfile(fetchedProfile)
      
      // Store original covers
      const covers: { [videoId: string]: string } = {}
      fetchedProfile.videos.forEach(video => {
        covers[video.id] = video.cover
      })
      setOriginalCovers(covers)
      
      // Auto-enter selection mode
      setIsSelectionMode(true)
      
      // Find the first (latest) unenhanced post
      const firstUnenhancedVideo = fetchedProfile.videos.find(video => {
        const isEnhanced = video.cover.includes('faas-output-image') || 
                          video.cover.includes('jiekou.ai') || 
                          video.cover.includes('proxy-image')
        return !isEnhanced
      })
      
      // Auto-select the first unenhanced video (but don't auto-beautify)
      if (firstUnenhancedVideo) {
        setSelectedVideos([firstUnenhancedVideo.id])
      }
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

  const autoBeautifyFirstVideo = async (currentProfile: TikTokProfile, videoId: string) => {
    const funMessages = [
      '✨ Auto-enhancing your latest post...',
      '🎨 Working some AI magic on this cover...',
      '🚀 Making this thumbnail shine...',
      '💫 Beautifying in the background...',
      '🎭 Auto-pilot: Enhancement mode activated...'
    ]

    const getRandomMessage = () => funMessages[Math.floor(Math.random() * funMessages.length)]

    const videoIndex = currentProfile.videos.findIndex(v => v.id === videoId)
    if (videoIndex === -1) {
      console.error('Video not found for auto-beautify:', videoId)
      return
    }

    const video = currentProfile.videos[videoIndex]
    
    try {
      setIsProcessing(true)
      setProcessingProgress(getRandomMessage())

      const originalCover = video.cover
      const coverImage = originalCover.includes('/api/proxy-image?url=')
        ? decodeURIComponent(originalCover.split('url=')[1]?.split('&')[0] || originalCover)
        : originalCover
      
      const prompt = promptTemplates[selectedPromptTemplate as keyof typeof promptTemplates]?.prompt || promptTemplates.default.prompt
      
      setProcessingProgress('📡 Submitting to AI enhancement service...')
      const editResponse = await imageApi.editImage(coverImage, prompt)
      
      if (!editResponse.data.taskId) {
        throw new Error('Failed to get task ID from API')
      }
      
      const taskId = editResponse.data.taskId
      setProcessingProgress('⏳ AI is processing your image...')

      // Poll for result with better progress indication
      let attempts = 0
      const maxAttempts = 40 // Increase max attempts to 40 seconds
      let beautified = false

      while (attempts < maxAttempts && !beautified) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update progress message every 10 seconds
        if (attempts % 10 === 0 && attempts > 0) {
          setProcessingProgress(`⏳ Still working... (${attempts}s elapsed)`)
        }
        
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
              return {
                ...prev,
                videos: updatedVideos
              }
            })

            setProcessingProgress('✅ Enhancement complete!')
            setTimeout(() => {
              setIsProcessing(false)
              setProcessingProgress('')
              // Exit selection mode after successful auto-beautify
              setIsSelectionMode(false)
              setSelectedVideos([])
            }, 2000)
            
            beautified = true
          } else if (status === 'TASK_STATUS_FAILED') {
            throw new Error('Enhancement task failed on server')
          }
          
          attempts++
        } catch (pollError) {
          console.error('Poll error:', pollError)
          attempts++
        }
      }

      if (!beautified) {
        throw new Error('Enhancement timed out after 40 seconds')
      }
    } catch (error: any) {
      console.error('Auto-beautify failed:', error)
      
      // Provide more specific error messages
      let errorMessage = '❌ Auto-enhancement failed.'
      if (error.message?.includes('timeout')) {
        errorMessage = '⏱️ Request timed out. The AI service might be busy. Try manual selection.'
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = '🌐 Network error. Please check your connection.'
      } else if (error.response?.status === 500) {
        errorMessage = '⚠️ AI service is temporarily unavailable. Please try manual selection.'
      }
      
      setProcessingProgress(errorMessage)
      
      // Always clean up after failure
      setTimeout(() => {
        setIsProcessing(false)
        setProcessingProgress('')
        // Keep selection mode active so user can manually retry
        // But clear the auto-selected video
        setSelectedVideos([])
      }, 5000) // Show error for 5 seconds
    }
  }

  const handleBeautifySelected = async () => {
    if (!profile || selectedVideos.length === 0) {
      return
    }

    const funMessages = [
      '🎨 Hold my coffee, I got this...',
      '✨ *Puts on wizard hat* Let\'s do this!',
      '🚀 To infinity... and beyond gorgeous!',
      '💫 Mixing pixels with a dash of awesome sauce...',
      '🎭 Channeling my inner Picasso... but cooler!',
      '🌟 Making pixels jealous of each other...',
      '🎪 *Cracks knuckles* Time to work some magic!',
      '🔮 The crystal ball says... STUNNING!',
      '💎 Turning good into "OMG WOW!"',
      '🎯 Activating beast mode... 3... 2... 1...',
      '🌈 Adding sprinkles of pure awesomeness...',
      '🎨 Bob Ross is watching... no pressure!',
      '✨ *Waves magic wand dramatically*',
      '🔥 About to drop some HOT pixels!',
      '💖 Giving your covers a glow-up they deserve!',
      '🎪 Ladies and gentlemen... the show begins!',
      '🚁 Deploying beauty drones...',
      '🌊 Riding the wave of fabulousness...',
      '⚡ Charging up the awesome-inator!',
      '🎸 Time to rock this cover like a star!'
    ]

    const progressMessages = [
      '🎨 Mixing the perfect color cocktail...',
      '✨ Sprinkling magic pixels like confetti...',
      '🚀 Houston, we\'re going gorgeous!',
      '💫 Teaching pixels how to shine...',
      '🎭 Applying the "wow" filter...',
      '🌟 Making stars jealous...',
      '🎪 Juggling beauty and brilliance...',
      '🔮 Consulting the style gods...',
      '💎 Polish level: LEGENDARY!',
      '🎯 Hitting the sweet spot of stunning...',
      '🌈 Painting with all colors of awesome...',
      '🎨 Creating art that makes Mona Lisa jealous...',
      '✨ Bibbidi-Bobbidi-BEAUTIFUL!',
      '🔥 Setting beauty standards on fire!',
      '💖 Spreading love one pixel at a time...',
      '🎪 The circus of cuteness is in town!',
      '🚁 Flying high on cloud gorgeous!',
      '🌊 Surfing the tsunami of trends!',
      '⚡ Electrifying every single pixel!',
      '🎸 Shredding on the beauty guitar!'
    ]

    const successMessages = [
      '🎉 BOOM! Nailed it!',
      '🌟 *Chef\'s kiss* Perfection!',
      '✨ And that\'s how it\'s done!',
      '🔥 Absolute fire! 🔥',
      '💎 Flawless victory!',
      '🎯 Bullseye! Direct hit to gorgeous!',
      '🚀 Mission accomplished, captain!',
      '🎪 *Takes a bow* Thank you, thank you!',
      '💖 Another masterpiece for the collection!',
      '⚡ KABOOM! Beauty bomb deployed!',
      '🌈 Rainbow approved! ✓',
      '🎨 Even Picasso is impressed!',
      '✨ Magic successfully casted!',
      '🔮 The prophecy was true!',
      '🎭 Oscar-worthy transformation!'
    ]

    const getRandomMessage = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

    setIsProcessing(true)
    setProcessingProgress(`${getRandomMessage(funMessages)} Starting the show...`)

    let successCount = 0
    let failCount = 0
    const processedVideoIds = new Set<string>()

    try {
      for (let i = 0; i < selectedVideos.length; i++) {
        const videoId = selectedVideos[i]
        const videoIndex = profile.videos.findIndex(v => v.id === videoId)
        
        if (videoIndex === -1) {
          failCount++
          continue
        }

        const video = profile.videos[videoIndex]
        
        try {
          setProcessingProgress(`[${i + 1}/${selectedVideos.length}] ${getRandomMessage(progressMessages)}`)

          const originalCover = video.cover
          const coverImage = originalCover.includes('/api/proxy-image?url=')
            ? decodeURIComponent(originalCover.split('url=')[1]?.split('&')[0] || originalCover)
            : originalCover
          
          const prompt = promptTemplates[selectedPromptTemplate as keyof typeof promptTemplates]?.prompt || promptTemplates.default.prompt
          
          const editResponse = await imageApi.editImage(coverImage, prompt)
          
          if (!editResponse.data.taskId) {
            throw new Error('No task ID received')
          }
          
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
                  // Save original cover before updating
                  const originalCover = updatedVideos[videoIndex].cover
                  if (!originalCovers[video.id]) {
                    setOriginalCovers(prevCovers => ({
                      ...prevCovers,
                      [video.id]: originalCover
                    }))
                  }
                  updatedVideos[videoIndex] = {
                    ...updatedVideos[videoIndex],
                    cover: proxyUrl
                  }
                  return { ...prev, videos: updatedVideos }
                })
                
                successCount++
                processedVideoIds.add(videoId)
                beautified = true
                setProcessingProgress(`[${i + 1}/${selectedVideos.length}] ${getRandomMessage(successMessages)}`)
              } else if (status === 'TASK_STATUS_FAILED') {
                failCount++
                beautified = true
                setProcessingProgress(`[${i + 1}/${selectedVideos.length}] 😅 Oops! This one\'s being stubborn...`)
              }
            } catch (error) {
              // Continue polling
            }
            
            attempts++
          }

          if (!beautified) {
            failCount++
            setProcessingProgress(`[${i + 1}/${selectedVideos.length}] ⏱️ Taking a coffee break... moving on!`)
          }
        } catch (error) {
          console.error('Enhancement error for video:', videoId, error)
          failCount++
          setProcessingProgress(`[${i + 1}/${selectedVideos.length}] 💥 Plot twist! This one\'s tricky...`)
          await new Promise(resolve => setTimeout(resolve, 1000)) // Brief pause before next
        }
      }

      // Final summary with fun messages
      const totalProcessed = successCount + failCount
      if (successCount > 0) {
        const finalMessages = [
          `🎊 Fantastic! ${successCount} cover${successCount > 1 ? 's' : ''} looking absolutely gorgeous!`,
          `🌟 Mission complete! ${successCount} masterpiece${successCount > 1 ? 's' : ''} created!`,
          `✨ And... DONE! ${successCount} stunning cover${successCount > 1 ? 's' : ''}!`,
          `🔥 Hot off the press! ${successCount} beauty bomb${successCount > 1 ? 's' : ''} ready!`,
          `💎 Flawless! ${successCount} gem${successCount > 1 ? 's' : ''} polished to perfection!`
        ]
        const finalMsg = getRandomMessage(finalMessages)
        setProcessingProgress(failCount > 0 ? `${finalMsg} (${failCount} didn't make the cut 😅)` : `${finalMsg} 💯`)
      } else {
        setProcessingProgress(`😅 Whoops! ${totalProcessed} rebel${totalProcessed > 1 ? 's' : ''} refused the makeover. Let\'s try again!`)
      }
    } catch (error) {
      console.error('Batch enhancement error:', error)
      setProcessingProgress('💥 Plot twist! Something went wrong. But hey, we can try again! 💪')
    } finally {
      // Always clean up, regardless of success or failure
      setTimeout(() => {
        setIsProcessing(false)
        setProcessingProgress('')
        setIsSelectionMode(false)
        setSelectedVideos([])
      }, 3000)
    }
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
              const oldCover = prev.videos[0].cover
              // Save original cover before updating
              if (!originalCovers[prev.videos[0].id]) {
                setOriginalCovers(prevCovers => ({
                  ...prevCovers,
                  [prev.videos[0].id]: oldCover
                }))
              }
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

              {/* Right side buttons container */}
              <div className="flex items-center gap-3">
                {/* Batch enhance button (only show in selection mode) */}
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
                
                {/* Upload button (demo placeholder) */}
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 border-2 border-gray-300 rounded-full font-medium hover:bg-gray-200 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </div>
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
            originalCovers={originalCovers}
          />
        ) : (
          <div className="h-screen flex items-center justify-center text-gray-500">
            Unable to load profile
          </div>
        )}
      </div>

      {/* 右下角浮窗按钮 - 移到中间右边 - 带 Andrew 头像 */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-1/2 right-6 transform -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center z-50 animate-pulse border-4 border-white overflow-hidden p-0"
        >
          <img 
            src={andrewAvatar} 
            alt="Andrew" 
            className="w-full h-full object-cover"
          />
        </button>
      )}

      {/* 聊天浮窗 - 位置移到中间右边 */}
      {isChatOpen && (
        <div className="fixed top-1/2 right-6 transform -translate-y-1/2 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
          {/* Floating window title bar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-2xl">
            <button 
              onClick={() => router.push('/agent/andrew')}
              className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 -ml-2 transition"
            >
              <img 
                src={andrewAvatar} 
                alt="Andrew" 
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <h3 className="font-semibold">Andrew - AI Butler</h3>
            </button>
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

