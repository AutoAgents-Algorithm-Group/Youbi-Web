import { NextRequest, NextResponse } from 'next/server';

// POST /api/profile/chat - 聊天消息处理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, username } = body;
    
    // 简单的自动回复逻辑
    const response = {
      message: `收到！你说的是: "${message}"。我们正在处理您的请求...`,
      timestamp: new Date()
    };

    return NextResponse.json({ 
      success: true, 
      response 
    });
  } catch (error) {
    console.error('聊天失败:', error);
    return NextResponse.json(
      { error: '聊天失败' },
      { status: 500 }
    );
  }
}

