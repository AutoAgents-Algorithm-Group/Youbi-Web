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
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const userId = 'current_user' // Should get from auth state in production
      await explorerApi.likePost(postId, userId)
      
      // Update local state
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
      console.error('Failed to like post:', error)
    }
  }

  const handleComment = async (postId: string, content: string, parentCommentId?: string) => {
    try {
      const commentData = {
        userId: 'current_user',
        username: 'Current User',
        avatar: 'https://i.pravatar.cc/150?u=current_user',
        content,
        parentCommentId
      }

      const response = await explorerApi.addComment(postId, commentData)
      
      // Update local state
      setPosts(prev =>
        prev.map(post =>
          post._id === postId ? response.data.post : post
        )
      )
    } catch (error) {
      console.error('Failed to comment:', error)
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
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Explore Community</h1>
          <p className="text-gray-600 mt-1">Discover more amazing AI enhanced works</p>
        </div>

        {/* 瀑布流布局 */}
        {loading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No posts yet. Be the first to share!</p>
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

        {/* Load More */}
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
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

