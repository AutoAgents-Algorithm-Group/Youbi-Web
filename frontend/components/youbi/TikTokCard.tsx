'use client'

import { useState, useEffect } from 'react'
import { Heart, Eye, Sparkles, Check, Plus, Undo2, X, Download } from 'lucide-react'
import type { TikTokProfile } from '@/lib/types/youbi'

interface TikTokCardProps {
  profile: TikTokProfile
  isSelectionMode?: boolean
  selectedVideos?: string[]
  onToggleSelection?: (videoId: string) => void
  onUploadClick?: () => void
  originalCovers?: { [videoId: string]: string } // Store original covers for comparison
}

export default function TikTokCard({ 
  profile,
  isSelectionMode = false,
  selectedVideos = [],
  onToggleSelection,
  onUploadClick,
  originalCovers = {}
}: TikTokCardProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [showingOriginal, setShowingOriginal] = useState<{ [key: string]: boolean }>({})
  const [downloadingVideo, setDownloadingVideo] = useState<string | null>(null)

  // Handle Esc key to close fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [fullscreenImage])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleImageClick = (cover: string, videoId: string, isEnhanced: boolean, e: React.MouseEvent) => {
    e.stopPropagation()
    // Open fullscreen when not in selection mode
    if (!isSelectionMode) {
      console.log('Opening fullscreen for:', cover, 'isEnhanced:', isEnhanced)
      setFullscreenImage(cover)
    }
  }

  const handleDownload = async (imageUrl: string, videoId?: string) => {
    try {
      if (videoId) setDownloadingVideo(videoId)
      
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `youbi-enhanced-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      // Show success state briefly
      if (videoId) {
        setTimeout(() => setDownloadingVideo(null), 1500)
      }
    } catch (error) {
      console.error('Download failed:', error)
      if (videoId) setDownloadingVideo(null)
      // Fallback: open in new tab
      window.open(imageUrl, '_blank')
    }
  }

  const toggleOriginal = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowingOriginal(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }))
  }

  const isEnhanced = (cover: string) => {
    return cover.includes('faas-output-image') || cover.includes('jiekou.ai') || cover.includes('proxy-image')
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* 头部信息 */}
      <div className="flex items-start gap-4 mb-6">
        <img
          src={profile.avatar}
          alt={profile.nickname}
          className="w-26 h-26 rounded-full border-4 border-white shadow-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900">{profile.nickname}</h2>
          <p className="text-gray-500 mb-3">@{profile.username}</p>
          
          {/* 统计数据 */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-900 text-base">{formatNumber(profile.following)}</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-900 text-base">{formatNumber(profile.followers)}</span>
              <span className="text-gray-500">Followers</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-900 text-base">{formatNumber(profile.likes)}</span>
              <span className="text-gray-500">Likes</span>
            </div>
          </div>

          {/* Bio - 直接放在右侧 */}
          {profile.bio && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Videos Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Videos ({profile.videos.length + 1})
        </h3>
        {/* Responsive grid: 3 columns on mobile, 6 columns on desktop */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Upload Button as First Item */}
          <button
            onClick={onUploadClick}
            className="relative aspect-[9/16] rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center px-2">
              <p className="text-xs font-medium text-gray-600 group-hover:text-primary transition-colors">Upload</p>
              <p className="text-xs text-gray-400">Video</p>
            </div>
          </button>
          
          {/* Existing Videos */}
          {profile.videos.map((video, index) => {
            const isSelected = selectedVideos.includes(video.id)
            const hasOriginal = originalCovers[video.id]
            const showOriginal = showingOriginal[video.id]
            const displayCover = (showOriginal && hasOriginal) ? originalCovers[video.id] : video.cover
            const enhanced = isEnhanced(video.cover)
            
            return (
              <div 
                key={`${video.id}-${index}`} 
                className={`relative aspect-[9/16] group overflow-hidden rounded-lg ${
                  isSelectionMode ? 'cursor-pointer' : ''
                }`}
                onClick={(e) => {
                  if (isSelectionMode) {
                    e.stopPropagation()
                    onToggleSelection?.(video.id)
                  }
                }}
              >
                <img
                  key={displayCover}
                  src={displayCover}
                  alt={video.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isSelectionMode && isSelected ? 'scale-95 brightness-75' : 'group-hover:scale-110'
                  } ${!isSelectionMode && enhanced ? 'cursor-zoom-in' : 'cursor-pointer'}`}
                  loading="lazy"
                  onClick={(e) => {
                    if (!isSelectionMode) {
                      e.stopPropagation()
                      setFullscreenImage(displayCover)
                    }
                  }}
                />
                
                {/* Selection Mode Checkbox */}
                {isSelectionMode && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all pointer-events-none ${
                    isSelected 
                      ? 'bg-primary border-primary' 
                      : 'bg-white/30 border-white backdrop-blur-sm'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                )}
                
                {/* Back to Original Button - Show when enhanced and has original */}
                {!isSelectionMode && enhanced && hasOriginal && (
                  <button
                    onClick={(e) => toggleOriginal(video.id, e)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 z-10"
                    title={showOriginal ? "Show enhanced" : "Show original"}
                  >
                    <Undo2 className={`w-4 h-4 transition-colors ${showOriginal ? 'text-primary' : 'text-gray-600'}`} />
                  </button>
                )}
                
                {/* Download Button - Show when enhanced and not showing original */}
                {!isSelectionMode && enhanced && !showOriginal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(displayCover, video.id)
                    }}
                    className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 z-10 group/download ${
                      downloadingVideo === video.id 
                        ? 'bg-green-500 scale-110' 
                        : 'bg-white/90 hover:bg-white'
                    }`}
                    title="Download enhanced image"
                  >
                    {downloadingVideo === video.id ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Download className="w-4 h-4 text-gray-600 group-hover/download:text-primary transition-colors" />
                    )}
                  </button>
                )}
                
                {/* AI Enhanced Badge */}
                {!isSelectionMode && enhanced && !showOriginal && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>Enhanced</span>
                  </div>
                )}

                {/* Original Badge */}
                {!isSelectionMode && showOriginal && (
                  <div className="absolute top-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    <span>Original</span>
                  </div>
                )}
                
                {/* Hover Info */}
                {!isSelectionMode && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    <div className="absolute bottom-2 left-2 right-12">
                      <div className="flex items-center gap-2 text-white text-xs">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(video.playCount)}</span>
                        <Heart className="w-3 h-3 ml-2" />
                        <span>{formatNumber(video.likeCount)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all transform hover:scale-110 z-10 backdrop-blur-sm border border-white/20"
            title="Close (Esc)"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDownload(fullscreenImage)
            }}
            className="absolute top-4 right-20 md:top-6 md:right-24 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all transform hover:scale-110 z-10 backdrop-blur-sm border border-white/20"
            title="Download Image"
          >
            <Download className="w-6 h-6 text-white" />
          </button>

          {/* Enhanced Badge - Only show if image is enhanced */}
          {isEnhanced(fullscreenImage) && (
            <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-gradient-to-r from-primary to-pink-500 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">AI Enhanced</span>
            </div>
          )}

          {/* Image */}
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300 shadow-2xl rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Info */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm border border-white/20">
            <span className="hidden md:inline">Click anywhere to close • </span>
            <span className="md:hidden">Tap to close • </span>
            Press Esc
          </div>
        </div>
      )}
    </div>
  )
}


