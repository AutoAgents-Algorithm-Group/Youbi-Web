import axios from 'axios';
import type { TikTokUserInfo, TikTokVideo } from '../types/youbi';

/**
 * RapidAPI TikTok 服务
 * 使用 tiktok-api23.p.rapidapi.com
 * 参考文档: https://rapidapi.com/Lundehund/api/tiktok-api23
 */

class RapidAPIService {
  private apiHost: string;

  constructor() {
    this.apiHost = 'tiktok-api23.p.rapidapi.com';
  }

  /**
   * 获取 API Key（每次动态读取，确保环境变量已加载）
   */
  private getApiKey(): string {
    return process.env.RAPIDAPI_KEY || '';
  }

  /**
   * 检查 API Key 是否配置
   */
  isConfigured(): boolean {
    return !!this.getApiKey();
  }

  /**
   * 获取用户视频列表
   * 端点: GET /api/user/posts
   * 参数: secUid, count, cursor
   */
  async getUserVideos(secUid: string, count: number = 35): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    try {
      console.log(`📡 RapidAPI: 获取视频 - secUid: ${secUid.substring(0, 20)}...`);
      
      const response = await axios.get(
        `https://${this.apiHost}/api/user/posts`,
        {
          params: {
            secUid: secUid,
            count: count,
            cursor: 0
          },
          headers: {
            'x-rapidapi-key': this.getApiKey(),
            'x-rapidapi-host': this.apiHost
          },
          timeout: 15000
        }
      );

      // 检查响应数据结构
      if (!response.data || !response.data.data) {
        throw new Error('API返回数据为空');
      }

      // statusCode 在 data.data 中，不是在 data 中
      const data = response.data.data;
      if (data.statusCode !== 0 && data.status_code !== 0) {
        throw new Error('API返回错误: ' + JSON.stringify(data));
      }

      const itemList = data.itemList || [];
      
      if (itemList.length === 0) {
        throw new Error('没有找到视频');
      }

      // 从第一个视频提取用户信息
      const firstItem = itemList[0];
      const author = firstItem.author;
      const authorStats = firstItem.authorStats || firstItem.authorStatsV2;

      const userInfo: TikTokUserInfo = {
        username: author.uniqueId || '',
        nickname: author.nickname || '',
        avatar: author.avatarLarger || author.avatarMedium || '',
        bio: author.signature || '',
        followers: parseInt(authorStats?.followerCount) || 0,
        following: parseInt(authorStats?.followingCount) || 0,
        likes: parseInt(authorStats?.heartCount || authorStats?.heart) || 0,
        verified: author.verified || false,
      };

      // 解析视频列表
      const videos: TikTokVideo[] = itemList.map((item: any) => ({
        id: item.id || '',
        cover: item.video?.cover || item.video?.dynamicCover || '',
        title: item.desc || item.contents?.[0]?.desc || '',
        playCount: parseInt(item.stats?.playCount || item.statsV2?.playCount) || 0,
        likeCount: parseInt(item.stats?.diggCount || item.statsV2?.diggCount) || 0,
        commentCount: parseInt(item.stats?.commentCount || item.statsV2?.commentCount) || 0,
        shareCount: parseInt(item.stats?.shareCount || item.statsV2?.shareCount) || 0,
        createTime: item.createTime || Date.now(),
      }));

      console.log(`✅ RapidAPI 成功: ${userInfo.nickname}，${videos.length} 个视频`);
      if (videos[0]) {
        console.log(`   封面示例: ${videos[0].cover.substring(0, 60)}...`);
      }
      
      return { userInfo, videos };
    } catch (error: any) {
      console.error('❌ RapidAPI 失败:', error.response?.data?.message || error.message);
      throw error;
    }
  }

  /**
   * 通过username获取Profile
   * 使用预定义的secUid映射
   */
  async getProfile(username: string): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    // 知名账号的secUid映射
    const secUidMap: { [key: string]: string } = {
      'taylorswift': 'MS4wLjABAAAAqB08cUbXaDWqbD6MCga2RbGTuhfO2EsHayBYx08NDrN7IE3jQuRDNNN6YwyfH6_6',
      'charlidamelio': 'MS4wLjABAAAA-VASjiXTh7wDDyXvjk10VFhMWUAoxr8bgfO1kAL1-9s',
      'khaby.lame': 'MS4wLjABAAAAeH_XfG3mng5HdtOKKaJmpq_DQ5WpDCxpxP3nEJkDGGVJNXG8pQpUfzHJtZj7a8gI',
      'bellapoarch': 'MS4wLjABAAAAPKCqGhFRECZ7G-T6LFVL_aKiziDWGmLMnKtF6kZPYKS5Y9sCDfgzKUaGYCFG6PKF',
      'zachking': 'MS4wLjABAAAAXw8ZT3D2qGVajJEagE_GVQz7mU4fJeVuPrLtRBKjKJ_c5dA6G5VFVLnJTXPg8l9r',
      'willsmith': 'MS4wLjABAAAAhpFRzGx34p4lFdazsS7gFLJ-D5f5CqYs7iEzaVMPXeGO7h0kZmZ7Dq7YxFdC_eAf'
    };

    const secUid = secUidMap[username.toLowerCase()];
    
    if (!secUid) {
      throw new Error(`用户 ${username} 暂不支持，请使用: ${Object.keys(secUidMap).join(', ')}`);
    }

    console.log(`🔍 使用 RapidAPI 获取 ${username} 的数据`);
    return await this.getUserVideos(secUid, 35);
  }
}

export default new RapidAPIService();

