import { NextRequest, NextResponse } from 'next/server';
import { mockPosts } from '@/lib/mockData';
import type { Post } from '@/lib/types/youbi';

// 内存存储（不依赖 MongoDB）
let posts: Post[] = [...mockPosts.map((post, index) => ({
  ...post,
  _id: `post_${index}`,
  createdAt: new Date(Date.now() - index * 3600000) // 每个帖子相隔1小时
}))];

// GET /api/explorer/posts - 获取所有帖子（瀑布流）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPosts = posts.slice(startIndex, endIndex);
    const total = posts.length;

    return NextResponse.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取帖子失败:', error);
    return NextResponse.json(
      { error: '获取帖子失败' },
      { status: 500 }
    );
  }
}

// POST /api/explorer/posts - 创建帖子
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username, avatar, originalImage, editedImage, prompt, description } = body;

    const newPost: Post = {
      _id: `post_${Date.now()}`,
      userId,
      username,
      avatar,
      originalImage,
      editedImage,
      prompt,
      description,
      likes: [],
      comments: [],
      createdAt: new Date()
    };

    posts.unshift(newPost); // 添加到开头
    
    return NextResponse.json({ 
      success: true, 
      post: newPost 
    });
  } catch (error) {
    console.error('创建帖子失败:', error);
    return NextResponse.json(
      { error: '创建帖子失败' },
      { status: 500 }
    );
  }
}

