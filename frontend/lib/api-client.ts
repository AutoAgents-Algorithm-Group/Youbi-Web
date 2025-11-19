import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Profile API
export const profileApi = {
  getProfile: (username: string) => 
    apiClient.get(`/profile/${username}`),
  
  sendMessage: (username: string, message: string) => 
    apiClient.post('/profile/chat', { username, message })
}

// Image API
export const imageApi = {
  editImage: (imageUrl: string, prompt: string) => 
    apiClient.post('/image/edit', { imageUrl, prompt }),
  
  getTaskResult: (taskId: string) => 
    apiClient.get(`/image/task/${taskId}`)
}

// Explorer API
export const explorerApi = {
  getPosts: (page = 1, limit = 20) => 
    apiClient.get('/explorer/posts', { params: { page, limit } }),
  
  createPost: (data: any) => 
    apiClient.post('/explorer/posts', data),
  
  likePost: (postId: string, userId: string) => 
    apiClient.post(`/explorer/posts/${postId}/like`, { userId }),
  
  addComment: (postId: string, data: any) => 
    apiClient.post(`/explorer/posts/${postId}/comment`, data)
}

// Auth API
export const authApi = {
  login: (tiktokUsername: string) =>
    apiClient.post('/auth/login', { tiktokUsername })
}

export default apiClient

