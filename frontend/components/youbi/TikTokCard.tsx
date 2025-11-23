'use client'

import { Heart, Eye, Sparkles, Check, Plus, Upload } from 'lucide-react'
import type { TikTokProfile } from '@/lib/types/youbi'

interface TikTokCardProps {
  profile: TikTokProfile
  isSelectionMode?: boolean
  selectedVideos?: string[]
  onToggleSelection?: (videoId: string) => void
  onUploadClick?: () => void
}

export default function TikTokCard({ 
  profile,
  isSelectionMode = false,
  selectedVideos = [],
  onToggleSelection,
  onUploadClick
}: TikTokCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
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
            
            return (
              <div 
                key={`${video.id}-${index}`} 
                className="relative aspect-[9/16] group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => isSelectionMode && onToggleSelection?.(video.id)}
              >
                <img
                  key={video.cover}
                  src={video.cover}
                  alt={video.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isSelectionMode && isSelected ? 'scale-95 brightness-75' : 'group-hover:scale-110'
                  }`}
                  loading="lazy"
                />
                
                {/* 选择模式下的复选框 */}
                {isSelectionMode && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-primary border-primary' 
                      : 'bg-white/30 border-white backdrop-blur-sm'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                )}
                
                {/* AI Enhanced Badge */}
                {!isSelectionMode && (video.cover.includes('faas-output-image') || video.cover.includes('jiekou.ai')) && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Enhanced</span>
                  </div>
                )}
                
                {/* hover 信息 */}
                {!isSelectionMode && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-2 left-2 right-2">
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
    </div>
  )
}


