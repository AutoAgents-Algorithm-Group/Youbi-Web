'use client'

import { Heart, Eye, Sparkles } from 'lucide-react'
import type { TikTokProfile } from '@/lib/types/youbi'

interface TikTokCardProps {
  profile: TikTokProfile
}

export default function TikTokCard({ profile }: TikTokCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* 头部信息 */}
      <div className="flex items-start gap-4 mb-6">
        <img
          src={profile.avatar}
          alt={profile.nickname}
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{profile.nickname}</h2>
          <p className="text-gray-500 mb-3">@{profile.username}</p>
          
          {/* 统计数据 */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900">{formatNumber(profile.followers)}</div>
              <div className="text-gray-500 text-xs">粉丝</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">{formatNumber(profile.following)}</div>
              <div className="text-gray-500 text-xs">关注</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">{formatNumber(profile.likes)}</div>
              <div className="text-gray-500 text-xs">获赞</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-gray-700 mb-6 leading-relaxed">{profile.bio}</p>
      )}

      {/* 作品封面网格 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          热门作品
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {profile.videos.slice(0, 6).map((video, index) => (
            <div key={`${video.id}-${index}`} className="relative aspect-[9/16] group cursor-pointer overflow-hidden rounded-lg">
              <img
                key={video.cover}
                src={video.cover}
                alt={video.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                loading="eager"
              />
              {/* AI 美化标签（仅第一个封面显示，并且是美化后的图片） */}
              {index === 0 && (video.cover.includes('faas-output-image') || video.cover.includes('jiekou.ai')) && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  <span>AI美化</span>
                </div>
              )}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

