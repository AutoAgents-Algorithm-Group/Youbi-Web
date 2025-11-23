'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, MessageSquare, Image as ImageIcon, X } from 'lucide-react'
import { explorerApi } from '@/lib/api-client'
import type { Post } from '@/lib/types/youbi'
import PostCard from '@/components/youbi/PostCard'
import Masonry from 'react-masonry-css'

export default function Explorer() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showPostDialog, setShowPostDialog] = useState(false)
  const [showAskDialog, setShowAskDialog] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [question, setQuestion] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleShare = (postId: string) => {
    console.log('Share post:', postId)
    // TODO: Implement share functionality
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 4 images
    const newImages = files.slice(0, 4 - selectedImages.length)
    setSelectedImages(prev => [...prev, ...newImages])

    // Create preview URLs
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file))
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const handleRemoveImage = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(imagePreviewUrls[index])
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handlePost = () => {
    if (!postContent.trim() && selectedImages.length === 0) return
    
    console.log('Post content:', postContent)
    console.log('Post images:', selectedImages)
    // TODO: Implement post functionality with images
    
    // Clean up
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url))
    setPostContent('')
    setSelectedImages([])
    setImagePreviewUrls([])
    setShowPostDialog(false)
  }

  const handleAsk = () => {
    if (!question.trim()) return
    console.log('Ask question:', question)
    // TODO: Implement ask functionality
    setQuestion('')
    setShowAskDialog(false)
  }

  const breakpointColumns = {
    default: 2,
    768: 2,
    640: 1
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Page Title and Action Buttons */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Explore Community</h1>
            <p className="text-gray-600 mt-1">Discover amazing AI enhanced works</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAskDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask</span>
            </button>
            <button
              onClick={() => setShowPostDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
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
                onShare={handleShare}
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

      {/* Post Dialog */}
      {showPostDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowPostDialog(false)
            // Clean up preview URLs
            imagePreviewUrls.forEach(url => URL.revokeObjectURL(url))
            setSelectedImages([])
            setImagePreviewUrls([])
          }}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Creation</h2>
            
            {/* Text Input */}
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share your AI-enhanced work or thoughts with the community..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              rows={4}
              autoFocus
            />

            {/* Image Preview Grid */}
            {imagePreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Image Upload Button */}
            {selectedImages.length < 4 && (
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition flex items-center justify-center gap-2 text-gray-600"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Add Images ({selectedImages.length}/4)</span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowPostDialog(false)
                  imagePreviewUrls.forEach(url => URL.revokeObjectURL(url))
                  setPostContent('')
                  setSelectedImages([])
                  setImagePreviewUrls([])
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!postContent.trim() && selectedImages.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Dialog */}
      {showAskDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAskDialog(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ask the Community</h2>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know? Ask anything about AI enhancement, TikTok strategies, or creative tips..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              rows={6}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAskDialog(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAsk}
                disabled={!question.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

