import axios from 'axios';
import type { TikTokUserInfo, TikTokVideo } from '../types/youbi';

/**
 * RapidAPI TikTok 服务
 * 使用 tiktok-scraper7.p.rapidapi.com
 * 参考文档: https://rapidapi.com/tiktok-scraper7
 */

class RapidAPIService {
  private apiHost: string;

  constructor() {
    this.apiHost = 'tiktok-scraper7.p.rapidapi.com';
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
   * 获取用户详细信息
   * 端点: GET /user/info
   * 参数: unique_id
   */
  async getUserInfo(username: string): Promise<TikTokUserInfo> {
    try {
      console.log(`📡 RapidAPI: 获取用户信息 - username: ${username}`);
      
      const response = await axios.get(
        `https://${this.apiHost}/user/info`,
        {
          params: {
            unique_id: username
          },
          headers: {
            'x-rapidapi-key': this.getApiKey(),
            'x-rapidapi-host': this.apiHost
          },
          timeout: 15000
        }
      );

      // 检查响应
      if (!response.data || response.data.code !== 0) {
        console.log(`⚠️  user/info API返回错误: ${response.data?.msg || '未知错误'}`);
        throw new Error(response.data?.msg || '无法获取用户信息');
      }

      const data = response.data.data;
      const user = data.user;
      const stats = data.stats;

      if (!user) {
        throw new Error('用户数据为空');
      }

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

      console.log(`✅ 用户信息获取成功: ${userInfo.nickname} (${userInfo.followers.toLocaleString()} 粉丝)`);
      
      return userInfo;
    } catch (error: any) {
      console.error('❌ 获取用户信息失败:', error.response?.data?.message || error.message);
      throw error;
    }
  }

  /**
   * 获取用户视频列表（支持分页，获取所有视频）
   * 端点: GET /user/posts
   * 参数: unique_id, count, cursor
   */
  async getUserVideos(username: string, maxVideos: number = 200): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    try {
      console.log(`📡 RapidAPI: 获取视频 - username: ${username}`);
      
      let allVideos: any[] = [];
      let cursor = 0;
      let hasMore = true;
      let userInfo: TikTokUserInfo | null = null;
      const perPage = 35; // 每次请求35个视频

      // 分页获取视频，直到没有更多或达到最大数量
      while (hasMore && allVideos.length < maxVideos) {
        const response = await axios.get(
          `https://${this.apiHost}/user/posts`,
          {
            params: {
              unique_id: username,
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

        // 检查响应数据结构 - 新API直接在response.data中
        if (!response.data || response.data.code !== 0) {
          console.log(`⚠️  API返回错误: ${response.data?.msg || '未知错误'}`);
          hasMore = false;
          break;
        }

        const data = response.data.data;
        
        if (!data || !data.videos) {
          console.log(`⚠️  API返回空数据，停止分页`);
          hasMore = false;
          break;
        }
        
        console.log(`📊 API响应:`, {
          code: response.data.code,
          msg: response.data.msg,
          videosLength: data.videos?.length || 0,
          hasMore: data.hasMore,
          cursor: data.cursor
        });

        const itemList = data.videos || [];
        
        if (itemList.length === 0) {
          console.log(`⚠️  本次请求返回0个视频，停止分页`);
          hasMore = false;
          break;
        }

        // 第一次请求时提取用户信息
        if (!userInfo && itemList.length > 0) {
          const firstItem = itemList[0];
          const author = firstItem.author;

          userInfo = {
            username: author.unique_id || author.uniqueId || username,
            nickname: author.nickname || username,
            avatar: author.avatar || '',
            bio: '', // 新API不包含bio
            followers: 0, // 新API在video列表中不包含统计数据
            following: 0,
            likes: 0,
            verified: false,
          };
        }

        allVideos = allVideos.concat(itemList);
        
        // 检查是否还有更多
        const apiHasMore = data.hasMore || false;
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

      // 如果没有找到视频，但可能有用户信息
      if (allVideos.length === 0) {
        console.log(`⚠️  没有找到视频数据`);
        // 如果有用户信息，返回空视频列表
        if (userInfo) {
          console.log(`✅ 返回用户信息但视频列表为空`);
          return { userInfo, videos: [] };
        }
        // 如果连用户信息都没有，抛出错误
        throw new Error('没有找到视频和用户信息');
      }

      if (!userInfo) {
        throw new Error('无法提取用户信息');
      }

      // 解析视频列表 - 新API的数据结构
      const videos: TikTokVideo[] = allVideos.slice(0, maxVideos).map((item: any) => ({
        id: item.aweme_id || item.video_id || '',
        cover: item.cover || item.origin_cover || '',
        title: item.title || '',
        playCount: parseInt(item.play_count) || 0,
        likeCount: parseInt(item.digg_count) || 0,
        commentCount: parseInt(item.comment_count) || 0,
        shareCount: parseInt(item.share_count) || 0,
        createTime: item.create_time || Date.now(),
      }));

      console.log(`✅ RapidAPI 成功: ${userInfo.nickname}，共 ${videos.length} 个视频`);
      
      return { userInfo, videos };
    } catch (error: any) {
      console.error('❌ RapidAPI 失败:', error.response?.data?.message || error.message);
      throw error;
    }
  }

  /**
   * 通过username获取Profile
   * 同时获取用户详细信息和视频列表
   */
  async getProfile(username: string): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    console.log(`🔍 使用 RapidAPI 获取 ${username} 的完整数据`);
    
    try {
      // 第一步：获取用户详细信息
      let userInfo: TikTokUserInfo;
      try {
        userInfo = await this.getUserInfo(username);
        console.log(`✅ 用户信息: ${userInfo.nickname}, ${userInfo.followers.toLocaleString()} 粉丝`);
      } catch (infoError) {
        console.log(`⚠️  user/info 失败，将从视频列表中提取基本信息`);
        // 如果获取用户信息失败，继续获取视频，从视频中提取用户信息
        userInfo = {
          username: username,
          nickname: username,
          avatar: '',
          bio: '',
          followers: 0,
          following: 0,
          likes: 0,
          verified: false,
        };
      }

      // 第二步：获取视频列表
      try {
        const videoResult = await this.getUserVideos(username, 200);
        console.log(`✅ 视频列表: ${videoResult.videos.length} 个视频`);
        
        // 如果之前用户信息获取失败，使用视频中的基本信息
        if (!userInfo.avatar || !userInfo.nickname || userInfo.nickname === username) {
          console.log(`🔄 使用视频中的用户信息补充`);
          userInfo = {
            ...userInfo,
            username: videoResult.userInfo.username || userInfo.username,
            nickname: videoResult.userInfo.nickname || userInfo.nickname,
            avatar: videoResult.userInfo.avatar || userInfo.avatar,
          };
        }
        
        return {
          userInfo,
          videos: videoResult.videos
        };
      } catch (videoError: any) {
        console.error(`❌ 获取视频失败: ${videoError.message}`);
        // 即使视频获取失败，也返回用户信息
        return {
          userInfo,
          videos: []
        };
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error';
      console.error(`❌ 获取完整数据失败: ${errorMsg}`);
      console.error(`❌ 错误详情:`, error.response?.data || error);
      
      // 最终降级方案：返回基本占位信息
      return {
        userInfo: {
          username: username,
          nickname: username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          bio: '',
          followers: 0,
          following: 0,
          likes: 0,
          verified: false,
        },
        videos: []
      };
    }
  }
}

export default new RapidAPIService();

