import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import rapidAPIService from '@/lib/services/rapidAPIService';

// 缓存配置
const profileCache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    // 检查是否强制刷新
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    
    // 先从缓存查找（除非强制刷新）
    if (!forceRefresh) {
      const cached = profileCache[username];
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`📦 从缓存返回 ${username} 的数据`);
        return NextResponse.json({ 
          success: true, 
          profile: cached.data, 
          fromCache: true 
        });
      }
    } else {
      console.log(`🔄 强制刷新 ${username} 的数据`);
      delete profileCache[username];
    }
    
    console.log(`🔍 获取 TikTok 用户真实数据: ${username}`);
    
    // 只使用 RapidAPI
    if (!rapidAPIService.isConfigured()) {
      console.error(`❌ RapidAPI 未配置`);
      return NextResponse.json(
        { 
          error: '未配置API密钥',
          message: 'RapidAPI 密钥未配置。请在 .env.local 中设置 RAPIDAPI_KEY',
          username
        },
        { status: 500 }
      );
    }

    let userInfo: any = null;
    let videos: any[] = [];
    let dataSource = 'rapidapi';
    
    try {
      console.log(`📡 使用 RapidAPI 获取数据: ${username}`);
      const result = await rapidAPIService.getProfile(username);
      userInfo = result.userInfo;
      videos = result.videos;
      console.log(`✅ RapidAPI 成功获取数据`);
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error';
      console.error(`❌ RapidAPI 失败: ${errorMsg}`);
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch user data',
          message: `Unable to get @${username} data from RapidAPI: ${errorMsg}`,
          username
        },
        { status: 404 }
      );
    }
    // 如果有用户信息但没有视频，记录警告
    if (!videos || videos.length === 0) {
      console.log(`⚠️  用户 ${username} 没有视频数据`);
      console.log(`⚠️  RapidAPI 视频端点可能有限制或该用户无公开视频`);
      videos = []; // 返回空数组
    }
    
    // 格式化 Profile
    const profile = {
      username: userInfo.username || username,
      nickname: userInfo.nickname || username,
      avatar: userInfo.avatar || '',
      bio: userInfo.bio || '',
      followers: userInfo.followers || 0,
      following: userInfo.following || 0,
      likes: userInfo.likes || 0,
      verified: userInfo.verified || false,
      videos: (videos || []).map((v) => ({
        id: v.id || `video_${Math.random()}`,
        cover: v.cover || '',
        title: v.title || '精彩作品',
        playCount: v.playCount || 0,
        likeCount: v.likeCount || 0
      })),
      dataSource
    };
    
    console.log(`📊 Profile 数据: 用户=${profile.nickname}, 粉丝=${profile.followers}, 视频数=${profile.videos.length}`);
    
    // 保存到缓存
    profileCache[username] = {
      data: profile,
      timestamp: Date.now()
    };

    console.log(`✅ 成功获取 ${username} 的数据（来源: ${dataSource}）`);
    return NextResponse.json({ 
      success: true, 
      profile, 
      fromCache: false, 
      dataSource 
    });
  } catch (error) {
    console.error('获取 Profile 失败:', error);
    return NextResponse.json(
      { error: '获取 Profile 失败' },
      { status: 500 }
    );
  }
}

