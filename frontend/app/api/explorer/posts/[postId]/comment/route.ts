import { NextRequest, NextResponse } from 'next/server';
import { mockPosts } from '@/lib/mockData';
import type { Post, Comment } from '@/lib/types/youbi';

// 内存存储（与 posts/route.ts 共享）
let posts: Post[] = [...mockPosts.map((post, index) => ({
  ...post,
  _id: `post_${index}`,
  createdAt: new Date(Date.now() - index * 3600000)
}))];

// POST /api/explorer/posts/[postId]/comment - 添加评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const body = await request.json();
    const { userId, username, avatar, content, parentCommentId } = body;

    const post = posts.find(p => p._id === postId);
    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    const newComment: Comment = {
      _id: `comment_${Date.now()}`,
      userId,
      username,
      avatar,
      content,
      createdAt: new Date(),
      replies: []
    };

    if (parentCommentId) {
      // 添加回复
      const parentComment = post.comments.find((c: Comment) => c._id === parentCommentId);
      if (parentComment) {
        parentComment.replies.push(newComment);
      }
    } else {
      // 添加评论
      post.comments.push(newComment);
    }

    return NextResponse.json({ 
      success: true, 
      post 
    });
  } catch (error) {
    console.error('评论失败:', error);
    return NextResponse.json(
      { error: '评论失败' },
      { status: 500 }
    );
  }
}

