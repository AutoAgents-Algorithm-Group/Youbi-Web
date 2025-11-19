import { NextRequest, NextResponse } from 'next/server';
import { mockPosts } from '@/lib/mockData';
import type { Post } from '@/lib/types/youbi';

// 内存存储（与 posts/route.ts 共享）
// 注意：在实际应用中，应该使用数据库或全局状态管理
let posts: Post[] = [...mockPosts.map((post, index) => ({
  ...post,
  _id: `post_${index}`,
  createdAt: new Date(Date.now() - index * 3600000)
}))];

// POST /api/explorer/posts/[postId]/like - 点赞/取消点赞
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const body = await request.json();
    const { userId } = body;

    const post = posts.find(p => p._id === postId);
    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // 取消点赞
      post.likes.splice(likeIndex, 1);
    } else {
      // 点赞
      post.likes.push(userId);
    }

    return NextResponse.json({ 
      success: true, 
      liked: likeIndex === -1, 
      likeCount: post.likes.length 
    });
  } catch (error) {
    console.error('点赞失败:', error);
    return NextResponse.json(
      { error: '点赞失败' },
      { status: 500 }
    );
  }
}

