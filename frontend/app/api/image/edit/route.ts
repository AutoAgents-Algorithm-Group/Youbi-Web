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
        { error: 'Please provide prompt and imageUrl' },
        { status: 400 }
      );
    }

    console.log('Submit image enhancement task:', { prompt, imageUrl: imageUrl.substring(0, 50) + '...' });
    console.log('API Key status:', IMAGE_API_KEY ? 'Configured' : 'Not configured');
    console.log('API URL:', `${IMAGE_API_URL}/qwen-image-edit`);

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
        },
        timeout: 30000
      }
    );

    const { task_id } = response.data;
    console.log('Task created successfully:', task_id);
    
    return NextResponse.json({ 
      success: true, 
      taskId: task_id 
    });
  } catch (error: any) {
    console.error('Image editing task failed:', error.response?.data || error.message);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    return NextResponse.json(
      { 
        error: 'Image editing task failed', 
        details: error.response?.data || error.message 
      },
      { status: 500 }
    );
  }
}

