import { NextRequest, NextResponse } from 'next/server';

// 内存存储用户
const users: { [key: string]: any } = {};

// POST /api/auth/login - 模拟登录/注册（简化版）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tiktokUsername } = body;
    
    if (!tiktokUsername) {
      return NextResponse.json(
        { error: '请提供 TikTok 用户名' },
        { status: 400 }
      );
    }

    let user = users[tiktokUsername];
    
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        tiktokUsername,
        avatar: `https://i.pravatar.cc/150?u=${tiktokUsername}`,
        bio: ''
      };
      users[tiktokUsername] = user;
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        tiktokUsername: user.tiktokUsername,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}

