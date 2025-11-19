import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const IMAGE_API_URL = process.env.IMAGE_API_URL || 'https://api.jiekou.ai/v3/async';
const IMAGE_API_KEY = process.env.IMAGE_API_KEY || 'sk_2aUrxBPF5QKlf_mu8y4OEUXBbd4Y0Vl7xc66AscB8aU';

// POST /api/image/edit - 提交图像编辑任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, imageUrl } = body;

    if (!prompt || !imageUrl) {
      return NextResponse.json(
        { error: '请提供 prompt 和 imageUrl' },
        { status: 400 }
      );
    }

    console.log('🎨 提交图像美化任务:', { prompt, imageUrl: imageUrl.substring(0, 50) + '...' });
    console.log('📡 API Key 状态:', IMAGE_API_KEY ? '已配置' : '未配置');

    const response = await axios.post(
      `${IMAGE_API_URL}/qwen-image-edit`,
      {
        prompt,
        image: imageUrl,
        seed: Math.floor(Math.random() * 10000)
      },
      {
        headers: {
          'Authorization': IMAGE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const { task_id } = response.data;
    console.log('✅ 任务创建成功:', task_id);
    
    return NextResponse.json({ 
      success: true, 
      taskId: task_id 
    });
  } catch (error: any) {
    console.error('❌ 图像编辑任务提交失败:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: '图像编辑任务提交失败', 
        details: error.response?.data || error.message 
      },
      { status: 500 }
    );
  }
}

