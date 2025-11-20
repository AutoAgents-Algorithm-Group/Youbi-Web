'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import type { Post, Comment } from '@/lib/types/youbi'

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onComment: (postId: string, content: string, parentCommentId?: string) => void
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<{ commentId: string; username: string } | null>(null)
  const currentUserId = 'current_user' // 实际应用中从认证状态获取
  const isLiked = post.likes.includes(currentUserId)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    onComment(post._id, commentText, replyTo?.commentId)
    setCommentText('')
    setReplyTo(null)
  }

  const handleReply = (commentId: string, username: string) => {
    setReplyTo({ commentId, username })
    setShowComments(true)
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment._id} className={`${isReply ? 'ml-8 mt-2' : 'mt-3'}`}>
      <div className="flex gap-2">
        <img
          src={comment.avatar}
          alt={comment.username}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-3 py-2">
            <p className="font-semibold text-sm">{comment.username}</p>
            <p className="text-sm text-gray-800">{comment.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-1 px-3">
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
            </span>
            {!isReply && (
              <button
                onClick={() => handleReply(comment._id!, comment.username)}
                className="text-xs text-gray-500 hover:text-primary"
              >
                Reply
              </button>
            )}
          </div>
          {/* 显示回复 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-2">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 hover:shadow-xl transition">
      {/* 用户信息 */}
      <div className="p-3 flex items-center gap-3">
        <img
          src={post.avatar}
          alt={post.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>

      {/* Comparison Images */}
      <div className="relative">
        <div className="grid grid-cols-2">
          <div className="relative">
            <img src={post.originalImage} alt="Original" className="w-full h-auto" />
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Original
            </span>
          </div>
          <div className="relative">
            <img src={post.editedImage} alt="Enhanced" className="w-full h-auto" />
            <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
              Enhanced
            </span>
          </div>
        </div>
      </div>

      {/* 描述 */}
      {post.description && (
        <div className="px-3 pt-3">
          <p className="text-sm text-gray-700">{post.description}</p>
        </div>
      )}
      
      <div className="px-3 py-2">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Prompt:</span> {post.prompt}
        </p>
      </div>

      {/* 互动按钮 */}
      <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-4">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 transition ${
            isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{post.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments.length}</span>
        </button>
      </div>

      {/* 评论区域 */}
      {showComments && (
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          {/* 显示评论 */}
          {post.comments.length > 0 && (
            <div className="space-y-2 mb-3">
              {post.comments.map(comment => renderComment(comment))}
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyTo ? `Reply to @${replyTo.username}` : 'Add a comment...'}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

