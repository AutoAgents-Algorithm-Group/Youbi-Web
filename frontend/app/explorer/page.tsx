'use client'

import { useState, useEffect } from 'react'
import { explorerApi } from '@/lib/api-client'
import type { Post } from '@/lib/types/youbi'
import PostCard from '@/components/youbi/PostCard'
import Masonry from 'react-masonry-css'

export default function Explorer() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await explorerApi.getPosts(page, 20)
      const { posts: newPosts, pagination } = response.data

      setPosts(prev => page === 1 ? newPosts : [...prev, ...newPosts])
      setHasMore(pagination.page < pagination.totalPages)
    } catch (error) {
      console.error('获取帖子失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const userId = 'current_user' // 实际应用中从认证状态获取
      await explorerApi.likePost(postId, userId)
      
      // 更新本地状态
      setPosts(prev =>
        prev.map(post => {
          if (post._id === postId) {
            const liked = post.likes.includes(userId)
            return {
              ...post,
              likes: liked
                ? post.likes.filter(id => id !== userId)
                : [...post.likes, userId]
            }
          }
          return post
        })
      )
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const handleComment = async (postId: string, content: string, parentCommentId?: string) => {
    try {
      const commentData = {
        userId: 'current_user',
        username: '当前用户',
        avatar: 'https://i.pravatar.cc/150?u=current_user',
        content,
        parentCommentId
      }

      const response = await explorerApi.addComment(postId, commentData)
      
      // 更新本地状态
      setPosts(prev =>
        prev.map(post =>
          post._id === postId ? response.data.post : post
        )
      )
    } catch (error) {
      console.error('评论失败:', error)
    }
  }

  const breakpointColumns = {
    default: 2,
    768: 2,
    640: 1
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">探索社区</h1>
          <p className="text-gray-600 mt-1">发现更多精彩的 AI 美化作品</p>
        </div>

        {/* 瀑布流布局 */}
        {loading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">还没有作品，快来成为第一个分享的人吧！</p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </Masonry>
        )}

        {/* 加载更多 */}
        {hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <button
              onClick={() => {
                setPage(p => p + 1)
                fetchPosts()
              }}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? '加载中...' : '加载更多'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

