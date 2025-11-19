import axios from 'axios';
import type { TikTokUserInfo, TikTokVideo } from '../types/youbi';

/**
 * TikTok 爬虫服务 V2
 * 使用第三方 API 或更可靠的方法获取真实数据
 */

class TikTokScraperV2 {
  /**
   * 方法1: 使用 TikTok 移动端 API（更可靠）
   */
  async getProfileViaMobileAPI(username: string): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    try {
      console.log(`📱 尝试通过移动端 API 获取 ${username} 的数据`);
      
      // TikTok 移动端 API 端点
      const userUrl = `https://m.tiktok.com/api/user/detail/?uniqueId=${username}`;
      
      const headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': `https://m.tiktok.com/@${username}`,
      };

      const userResponse = await axios.get(userUrl, { 
        headers,
        timeout: 15000,
      });

      if (!userResponse.data?.userInfo?.user) {
        throw new Error('无法获取用户信息');
      }

      const user = userResponse.data.userInfo.user;
      const stats = userResponse.data.userInfo.stats;

      const userInfo: TikTokUserInfo = {
        username: user.uniqueId || username,
        nickname: user.nickname || username,
        avatar: user.avatarLarger || user.avatarMedium || user.avatarThumb || '',
        bio: user.signature || '',
        followers: stats?.followerCount || 0,
        following: stats?.followingCount || 0,
        likes: stats?.heartCount || stats?.heart || 0,
        verified: user.verified || false,
      };

      // 获取用户视频
      const videoUrl = `https://m.tiktok.com/api/post/item_list/?secUid=${user.secUid}&count=30`;
      const videoResponse = await axios.get(videoUrl, { 
        headers,
        timeout: 15000,
      });

      const videos: TikTokVideo[] = (videoResponse.data?.itemList || []).map((item: any) => ({
        id: item.id || '',
        cover: item.video?.cover || item.video?.dynamicCover || item.video?.originCover || '',
        title: item.desc || '',
        playCount: item.stats?.playCount || 0,
        likeCount: item.stats?.diggCount || 0,
        commentCount: item.stats?.commentCount || 0,
        shareCount: item.stats?.shareCount || 0,
        createTime: item.createTime || Date.now(),
      }));

      console.log(`✅ 成功获取 ${username} 的数据，共 ${videos.length} 个视频`);
      return { userInfo, videos };

    } catch (error: any) {
      console.error(`❌ 移动端 API 获取失败:`, error.message);
      throw error;
    }
  }

  /**
   * 方法2: 使用 TikTok oEmbed API（官方但有限）
   */
  async getVideoInfoViaOEmbed(videoUrl: string): Promise<any> {
    try {
      const url = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(url, { timeout: 10000 });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 方法3: 直接解析 TikTok 网页（降级方案）
   */
  async getProfileViaWebPage(username: string): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    try {
      console.log(`🌐 尝试通过网页解析获取 ${username} 的数据`);
      
      const url = `https://www.tiktok.com/@${username}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
        timeout: 15000,
      });

      const html = response.data;
      
      // 尝试从 HTML 中提取 JSON 数据
      // TikTok 通常在 <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"> 中存储数据
      const scriptMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
      
      if (!scriptMatch) {
        throw new Error('无法找到用户数据');
      }

      const jsonData = JSON.parse(scriptMatch[1]);
      const defaultScope = jsonData['__DEFAULT_SCOPE__'];
      const userData = defaultScope?.['webapp.user-detail']?.userInfo;

      if (!userData?.user) {
        throw new Error('无法解析用户数据');
      }

      const user = userData.user;
      const stats = userData.stats;

      const userInfo: TikTokUserInfo = {
        username: user.uniqueId || username,
        nickname: user.nickname || username,
        avatar: user.avatarLarger || user.avatarMedium || '',
        bio: user.signature || '',
        followers: stats?.followerCount || 0,
        following: stats?.followingCount || 0,
        likes: stats?.heartCount || 0,
        verified: user.verified || false,
      };

      // 提取视频数据
      const videoList = defaultScope?.['webapp.video-detail']?.itemInfo?.itemStruct || 
                        defaultScope?.['webapp.user-detail']?.itemList || [];

      const videos: TikTokVideo[] = videoList.slice(0, 30).map((item: any) => ({
        id: item.id || '',
        cover: item.video?.cover || item.video?.dynamicCover || '',
        title: item.desc || '',
        playCount: item.stats?.playCount || 0,
        likeCount: item.stats?.diggCount || 0,
        commentCount: item.stats?.commentCount || 0,
        shareCount: item.stats?.shareCount || 0,
        createTime: item.createTime || Date.now(),
      }));

      console.log(`✅ 网页解析成功，获取 ${videos.length} 个视频`);
      return { userInfo, videos };

    } catch (error: any) {
      console.error(`❌ 网页解析失败:`, error.message);
      throw error;
    }
  }

  /**
   * 智能获取：尝试多种方法
   */
  async getProfile(username: string): Promise<{
    userInfo: TikTokUserInfo;
    videos: TikTokVideo[];
  }> {
    const errors: string[] = [];

    // 方法1: 移动端 API
    try {
      return await this.getProfileViaMobileAPI(username);
    } catch (error: any) {
      errors.push(`移动端API: ${error.message}`);
      console.log('⚠️  移动端 API 失败，尝试网页解析');
    }

    // 方法2: 网页解析
    try {
      return await this.getProfileViaWebPage(username);
    } catch (error: any) {
      errors.push(`网页解析: ${error.message}`);
      console.log('⚠️  网页解析失败');
    }

    // 所有方法都失败
    throw new Error(`所有获取方法都失败: ${errors.join(', ')}`);
  }
}

export default new TikTokScraperV2();

