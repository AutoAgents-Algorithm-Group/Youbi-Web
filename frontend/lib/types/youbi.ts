// Youbi-Web 类型定义
// 整合了前端和后端的所有类型定义，移除了 mongoose 依赖

// TikTok 相关类型
export interface Video {
  id: string
  cover: string
  title: string
  playCount: number
  likeCount: number
}

export interface TikTokProfile {
  username: string
  nickname: string
  avatar: string
  bio: string
  followers: number
  following: number
  likes: number
  verified?: boolean
  videos: Video[]
  dataSource?: string
}

// 评论类型
export interface Comment {
  _id?: string
  userId: string
  username: string
  avatar: string
  content: string
  createdAt: Date
  replies: Comment[]
}

// 帖子类型
export interface Post {
  _id: string
  userId: string
  username: string
  avatar: string
  originalImage: string
  editedImage: string
  prompt: string
  description?: string
  likes: string[]
  comments: Comment[]
  createdAt: Date
}

// 聊天消息类型
export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  imageUrl?: string
}

// 用户类型
export interface User {
  id: string
  tiktokUsername: string
  email?: string
  avatar?: string
  bio?: string
  followers: number
  following: number
  likes: number
  createdAt: Date
  isAvatar?: boolean
  originalUserId?: string
}

// RapidAPI 相关类型
export interface TikTokUserInfo {
  username: string
  nickname: string
  avatar: string
  bio: string
  followers: number
  following: number
  likes: number
  verified: boolean
}

export interface TikTokVideo {
  id: string
  cover: string
  title: string
  playCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  createTime: number
}

