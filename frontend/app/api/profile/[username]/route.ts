import { NextRequest, NextResponse } from 'next/server';
import rapidAPIService from '@/lib/services/rapidAPIService';
import tiktokScraperV2 from '@/lib/services/tiktokScraperV2';
import { getRealProfileData } from '@/lib/mockData';
import { generateVideoCover } from '@/lib/generatePlaceholder';

// 缓存配置
const profileCache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

// 生成模拟数据（降级方案）
function generateMockProfile(username: string) {
  return {
    username,
    nickname: `@${username}`,
    avatar: `https://i.pravatar.cc/300?u=${username}`,
    bio: `🎬 内容创作者 | 📱 分享生活点滴 | ✨ 欢迎关注`,
    followers: Math.floor(Math.random() * 100000),
    following: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 1000000),
    verified: false,
    videos: Array.from({ length: 6 }, (_, i) => ({
      id: `video_${i}`,
      cover: generateVideoCover(i),
      title: `精彩作品 #${i + 1}`,
      playCount: Math.floor(Math.random() * 100000),
      likeCount: Math.floor(Math.random() * 10000)
    }))
  };
}

// GET /api/profile/[username] - 获取 TikTok Profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    // 先从缓存查找
    const cached = profileCache[username];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`📦 从缓存返回 ${username} 的数据`);
      return NextResponse.json({ 
        success: true, 
        profile: cached.data, 
        fromCache: true 
      });
    }
    
    console.log(`🔍 获取 TikTok 用户真实数据: ${username}`);
    
    let userInfo: any = null;
    let videos: any[] = [];
    let dataSource = 'mock';
    
    // 策略1: 优先尝试 RapidAPI（如果配置了）
    if (rapidAPIService.isConfigured()) {
      try {
        console.log(`📡 尝试使用 RapidAPI 获取数据: ${username}`);
        const result = await rapidAPIService.getProfile(username);
        userInfo = result.userInfo;
        videos = result.videos;
        dataSource = 'rapidapi';
        console.log(`✅ RapidAPI 成功获取数据`);
      } catch (error: any) {
        console.log(`⚠️  RapidAPI 失败: ${error.message}`);
        
        // RapidAPI失败后，尝试使用预存数据
        const realData = getRealProfileData(username);
        if (realData) {
          console.log(`✅ 使用预存的真实 TikTok 数据: ${realData.nickname}`);
          profileCache[username] = {
            data: { ...realData, dataSource: 'real_demo' },
            timestamp: Date.now()
          };
          return NextResponse.json({ 
            success: true, 
            profile: realData, 
            fromCache: false, 
            dataSource: 'real_demo' 
          });
        }
      }
    }
    
    // 策略2: 尝试爬虫（如果 RapidAPI 未配置或失败）
    if (!userInfo) {
      try {
        console.log(`🕷️ 使用爬虫获取数据`);
        const result = await tiktokScraperV2.getProfile(username);
        userInfo = result.userInfo;
        videos = result.videos;
        dataSource = 'scraper';
      } catch (error: any) {
        console.log(`⚠️  爬虫失败: ${error.message}`);
      }
    }
    
    // 策略3: 降级到模拟数据
    if (!userInfo || !videos || videos.length === 0) {
      console.log(`📦 使用模拟数据`);
      const mockProfile = generateMockProfile(username);
      const profile = {
        ...mockProfile,
        dataSource: 'mock'
      };
      
      // 保存到缓存
      profileCache[username] = {
        data: profile,
        timestamp: Date.now()
      };
      
      return NextResponse.json({ 
        success: true, 
        profile, 
        fromCache: false, 
        dataSource: 'mock' 
      });
    }
    
    // 格式化 Profile
    const profile = {
      username: userInfo.username || username,
      nickname: userInfo.nickname || username,
      avatar: userInfo.avatar || `https://i.pravatar.cc/300?u=${username}`,
      bio: userInfo.bio || '',
      followers: userInfo.followers || 0,
      following: userInfo.following || 0,
      likes: userInfo.likes || 0,
      verified: userInfo.verified || false,
      videos: videos.slice(0, 6).map((v, index) => ({
        id: v.id || `video_${Math.random()}`,
        cover: v.cover || generateVideoCover(index),
        title: v.title || '精彩作品',
        playCount: v.playCount || 0,
        likeCount: v.likeCount || 0
      })),
      dataSource
    };
    
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

