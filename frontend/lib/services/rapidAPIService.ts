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
   * 获取用户视频列表（支持分页，获取所有视频）
   * 端点: GET /api/user/posts
   * 参数: secUid, count, cursor
   */
  async getUserVideos(secUid: string, maxVideos: number = 200): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    try {
      console.log(`📡 RapidAPI: 获取视频 - secUid: ${secUid.substring(0, 20)}...`);
      
      let allVideos: any[] = [];
      let cursor = 0;
      let hasMore = true;
      let userInfo: TikTokUserInfo | null = null;
      const perPage = 35; // 每次请求35个视频

      // 分页获取视频，直到没有更多或达到最大数量
      while (hasMore && allVideos.length < maxVideos) {
        const response = await axios.get(
          `https://${this.apiHost}/api/user/posts`,
          {
            params: {
              secUid: secUid,
              count: perPage,
              cursor: cursor
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

        const data = response.data.data;
        
        console.log(`📊 API响应:`, {
          statusCode: data.statusCode || data.status_code,
          itemListLength: data.itemList?.length || 0,
          hasMore: data.hasMore || data.has_more,
          cursor: data.cursor
        });
        
        if (data.statusCode !== 0 && data.status_code !== 0) {
          throw new Error(`API返回错误: ${data.statusCode || data.status_code}`);
        }

        const itemList = data.itemList || [];
        
        if (itemList.length === 0) {
          console.log(`⚠️  本次请求返回0个视频，停止分页`);
          hasMore = false;
          break;
        }

        // 第一次请求时提取用户信息
        if (!userInfo && itemList.length > 0) {
          const firstItem = itemList[0];
          const author = firstItem.author;
          const authorStats = firstItem.authorStats || firstItem.authorStatsV2;

          userInfo = {
            username: author.uniqueId || '',
            nickname: author.nickname || '',
            avatar: author.avatarLarger || author.avatarMedium || '',
            bio: author.signature || '',
            followers: parseInt(authorStats?.followerCount) || 0,
            following: parseInt(authorStats?.followingCount) || 0,
            likes: parseInt(authorStats?.heartCount || authorStats?.heart) || 0,
            verified: author.verified || false,
          };
        }

        allVideos = allVideos.concat(itemList);
        
        // 检查是否还有更多
        const apiHasMore = data.hasMore || data.has_more || false;
        const newCursor = data.cursor || (cursor + itemList.length);
        
        console.log(`📊 本轮结果: 获取${itemList.length}个，总计${allVideos.length}个，API hasMore: ${apiHasMore}, cursor: ${cursor} → ${newCursor}`);
        
        // 更新cursor
        cursor = newCursor;
        
        // 判断是否继续：如果返回数量少于请求数量，说明到底了
        if (itemList.length < perPage) {
          console.log(`✅ 返回数量(${itemList.length}) < 请求数量(${perPage})，已获取所有视频`);
          hasMore = false;
          break;
        }
        
        // 如果API明确说没有更多了，也停止
        if (!apiHasMore) {
          console.log(`✅ API 返回 hasMore=false，已获取所有视频`);
          hasMore = false;
          break;
        }
        
        // 添加小延迟避免请求过快
        if (allVideos.length < maxVideos) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (allVideos.length === 0) {
        throw new Error('没有找到视频');
      }

      if (!userInfo) {
        throw new Error('无法提取用户信息');
      }

      // 解析视频列表
      const videos: TikTokVideo[] = allVideos.slice(0, maxVideos).map((item: any) => ({
        id: item.id || '',
        cover: item.video?.cover || item.video?.dynamicCover || '',
        title: item.desc || item.contents?.[0]?.desc || '',
        playCount: parseInt(item.stats?.playCount || item.statsV2?.playCount) || 0,
        likeCount: parseInt(item.stats?.diggCount || item.statsV2?.diggCount) || 0,
        commentCount: parseInt(item.stats?.commentCount || item.statsV2?.commentCount) || 0,
        shareCount: parseInt(item.stats?.shareCount || item.statsV2?.shareCount) || 0,
        createTime: item.createTime || Date.now(),
      }));

      console.log(`✅ RapidAPI 成功: ${userInfo.nickname}，共 ${videos.length} 个视频`);
      
      return { userInfo, videos };
    } catch (error: any) {
      console.error('❌ RapidAPI 失败:', error.response?.data?.message || error.message);
      throw error;
    }
  }

  /**
   * 尝试通过搜索视频来获取用户信息
   * 这是一个变通方法：搜索用户的视频，从结果中提取作者信息
   */
  async getUserInfoBySearch(username: string): Promise<{
    secUid: string;
    userInfo: TikTokUserInfo;
  } | null> {
    try {
      console.log(`📡 RapidAPI: 通过搜索视频获取用户 - ${username}`);
      
      const response = await axios.get(
        `https://${this.apiHost}/api/search/video`,
        {
          params: {
            keyword: `@${username}`, // 添加 @ 符号提高匹配度
            cursor: 0,
            search_id: Date.now().toString()
          },
          headers: {
            'x-rapidapi-key': this.getApiKey(),
            'x-rapidapi-host': this.apiHost
          },
          timeout: 15000
        }
      );

      console.log(`📊 搜索响应:`, JSON.stringify(response.data).substring(0, 200));

      // 尝试多种可能的数据结构
      const videos = response.data?.data?.videos || 
                    response.data?.videos || 
                    response.data?.itemList ||
                    [];
      
      if (videos.length === 0) {
        console.log(`⚠️  搜索未返回任何视频`);
        return null;
      }

      console.log(`🔍 找到 ${videos.length} 个视频，正在查找匹配用户...`);
      
      // 查找作者是目标用户的视频
      const matchedVideo = videos.find((v: any) => {
        const authorId = v.author?.unique_id || v.author?.uniqueId || v.authorUniqueId || '';
        return authorId.toLowerCase() === username.toLowerCase();
      });

      if (matchedVideo?.author) {
        const author = matchedVideo.author;
        console.log(`✅ 从搜索结果找到用户: ${author.nickname || author.nick_name}`);
        
        const userInfo: TikTokUserInfo = {
          username: author.unique_id || author.uniqueId || username,
          nickname: author.nickname || author.nick_name || username,
          avatar: author.avatar_larger?.url_list?.[0] || 
                 author.avatar_medium?.url_list?.[0] || 
                 author.avatarLarger || 
                 author.avatarMedium || 
                 author.avatar || '',
          bio: author.signature || '',
          followers: author.followerCount || 0,
          following: author.followingCount || 0,
          likes: author.heartCount || 0,
          verified: author.is_verified || author.verified || false,
        };

        const secUid = author.sec_uid || author.secUid || '';
        console.log(`📝 提取到 secUid: ${secUid.substring(0, 20)}...`);

        return { secUid, userInfo };
      }
      
      console.log(`⚠️  在 ${videos.length} 个视频中未找到匹配的用户`);
      return null;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      console.log(`⚠️  搜索视频失败: ${msg}`);
      return null;
    }
  }

  /**
   * 通过用户名获取用户信息和secUid
   */
  async getUserInfo(username: string): Promise<{
    secUid: string;
    userInfo: TikTokUserInfo;
  }> {
    // 方法1: 尝试 /api/user/info
    try {
      console.log(`📡 RapidAPI user/info: ${username}`);
      
      const response = await axios.get(
        `https://${this.apiHost}/api/user/info`,
        {
          params: { uniqueId: username },
          headers: {
            'x-rapidapi-key': this.getApiKey(),
            'x-rapidapi-host': this.apiHost
          },
          timeout: 15000
        }
      );

      console.log(`📊 user/info 响应:`, JSON.stringify(response.data).substring(0, 200));

      // 尝试多种可能的数据结构
      const data = response.data?.data || response.data;
      const user = data?.user || data?.userInfo?.user;
      const stats = data?.stats || data?.userInfo?.stats;

      if (user && user.uniqueId) {
        const userInfo: TikTokUserInfo = {
          username: user.uniqueId || username,
          nickname: user.nickname || username,
          avatar: user.avatarLarger || user.avatarMedium || user.avatarThumb || '',
          bio: user.signature || '',
          followers: parseInt(stats?.followerCount) || 0,
          following: parseInt(stats?.followingCount) || 0,
          likes: parseInt(stats?.heartCount || stats?.heart) || 0,
          verified: user.verified || false,
        };

        console.log(`✅ user/info 成功: ${userInfo.nickname} (${userInfo.followers} 粉丝)`);
        return { secUid: user.secUid || '', userInfo };
      }
      
      console.log(`⚠️  user/info 返回数据但未找到用户信息`);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      console.log(`⚠️  user/info 失败: ${msg}`);
    }

    // 方法2: 尝试通过搜索视频获取
    console.log(`🔄 降级到搜索方法...`);
    const searchResult = await this.getUserInfoBySearch(username);
    if (searchResult && searchResult.secUid) {
      return searchResult;
    }

    throw new Error('无法获取用户信息: user/info 和 search/video 都失败');
  }

  /**
   * 通过username获取Profile
   * 先获取用户信息和 secUid，再获取视频列表
   */
  async getProfile(username: string): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    console.log(`🔍 使用 RapidAPI 获取 ${username} 的完整数据`);
    
    // 第一步：获取用户信息和 secUid
    const { secUid, userInfo } = await this.getUserInfo(username);
    
    if (!secUid) {
      // 如果没有 secUid，返回用户信息但没有视频
      console.log(`⚠️  未获取到 secUid，只返回用户信息`);
      return { userInfo, videos: [] };
    }
    
    // 第二步：获取视频列表（获取最多200个视频）
    try {
      const result = await this.getUserVideos(secUid, 200);
      console.log(`✅ RapidAPI 成功获取 ${result.videos.length} 个视频`);
      // 合并用户信息（getUserVideos 返回的可能更完整）
      return {
        userInfo: { ...userInfo, ...result.userInfo },
        videos: result.videos
      };
    } catch (error: any) {
      console.log(`⚠️  获取视频失败: ${error.message}，仅返回用户信息`);
      // 即使视频获取失败，也返回用户信息
      return { userInfo, videos: [] };
    }
  }
}

export default new RapidAPIService();

