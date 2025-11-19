import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const IMAGE_API_URL = process.env.IMAGE_API_URL || 'https://api.jiekou.ai/v3/async';
const IMAGE_API_KEY = process.env.IMAGE_API_KEY || 'sk_2aUrxBPF5QKlf_mu8y4OEUXBbd4Y0Vl7xc66AscB8aU';

// GET /api/image/task/[taskId] - 查询任务结果
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const response = await axios.get(
      `${IMAGE_API_URL}/task-result`,
      {
        params: { task_id: taskId },
        headers: {
          'Authorization': IMAGE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;
    
    return NextResponse.json({
      success: true,
      status: data.task?.status,
      progress: data.task?.progress_percent,
      images: data.images || [],
      reason: data.task?.reason
    });
  } catch (error: any) {
    console.error('查询任务失败:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: '查询任务失败', 
        details: error.response?.data 
      },
      { status: 500 }
    );
  }
}

