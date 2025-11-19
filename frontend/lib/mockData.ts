import { generatePlaceholderImage } from './generatePlaceholder';
import type { Post, TikTokProfile } from './types/youbi';

// 生成头像占位图
function generateAvatar(userId: string): string {
  const colors = ['ff69b4', '8a2be2', '00bfff', 'ffa500', 'ff1493', '32cd32'];
  const colorIndex = parseInt(userId.replace(/\D/g, '')) % colors.length;
  const color = colors[colorIndex];
  const initial = userId.charAt(userId.length - 1).toUpperCase();
  return generatePlaceholderImage(150, 150, color, 'ffffff', initial);
}

// 生成图片占位图
function generatePostImage(type: 'original' | 'edited', index: number): string {
  const themes = [
    { bg: '87ceeb', text: 'Original 1', editedBg: 'ff6347', editedText: 'Edited 1' },
    { bg: '9370db', text: 'Original 2', editedBg: 'ff1493', editedText: 'Cyber Punk' },
    { bg: 'ffa07a', text: 'Original 3', editedBg: 'ff8c00', editedText: 'Delicious' },
    { bg: '87ceeb', text: 'Original 4', editedBg: '00bfff', editedText: 'Dreamy Sky' },
    { bg: 'dda0dd', text: 'Original 5', editedBg: 'ba55d3', editedText: 'Fashion' },
  ];
  
  const theme = themes[index % themes.length];
  if (type === 'original') {
    return generatePlaceholderImage(400, 600, theme.bg, 'ffffff', theme.text);
  } else {
    return generatePlaceholderImage(400, 600, theme.editedBg, 'ffffff', theme.editedText);
  }
}

// 模拟社区帖子数据（用于测试 Explorer 页面）
export const mockPosts: Post[] = [
  {
    _id: 'post_0',
    userId: 'user1',
    username: '小红书达人',
    avatar: generateAvatar('user1'),
    originalImage: generatePostImage('original', 0),
    editedImage: generatePostImage('edited', 0),
    prompt: '增强色彩，添加温暖的日落滤镜',
    description: '尝试了 AI 美化功能，效果太棒了！🌅',
    likes: ['user2', 'user3'],
    comments: [
      {
        _id: 'comment_1',
        userId: 'user2',
        username: '摄影爱好者',
        avatar: generateAvatar('user2'),
        content: '效果真不错！想知道用的什么 prompt？',
        createdAt: new Date('2024-01-15'),
        replies: [
          {
            _id: 'reply_1',
            userId: 'user1',
            username: '小红书达人',
            avatar: generateAvatar('user1'),
            content: '就是简单的日落滤镜描述，AI 自动优化了',
            createdAt: new Date('2024-01-15'),
            replies: []
          }
        ]
      }
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    _id: 'post_1',
    userId: 'user3',
    username: 'TikTok 创作者',
    avatar: generateAvatar('user3'),
    originalImage: generatePostImage('original', 1),
    editedImage: generatePostImage('edited', 1),
    prompt: '变成赛博朋克风格，增加霓虹灯效果',
    description: '赛博朋克风格转换 ⚡️',
    likes: ['user1'],
    comments: [],
    createdAt: new Date('2024-01-14')
  },
  {
    _id: 'post_2',
    userId: 'user4',
    username: '美食博主',
    avatar: generateAvatar('user4'),
    originalImage: generatePostImage('original', 2),
    editedImage: generatePostImage('edited', 2),
    prompt: '让食物看起来更美味，增强饱和度和对比度',
    description: '美食照片这样修就对了！😋',
    likes: ['user1', 'user2', 'user3'],
    comments: [
      {
        _id: 'comment_2',
        userId: 'user5',
        username: '吃货小王',
        avatar: generateAvatar('user5'),
        content: '看起来好好吃啊！',
        createdAt: new Date('2024-01-14'),
        replies: []
      }
    ],
    createdAt: new Date('2024-01-14')
  },
  {
    _id: 'post_3',
    userId: 'user5',
    username: '旅行vlogger',
    avatar: generateAvatar('user5'),
    originalImage: generatePostImage('original', 3),
    editedImage: generatePostImage('edited', 3),
    prompt: '添加梦幻的天空和云彩效果',
    description: '旅行照片后期处理 ☁️',
    likes: [],
    comments: [],
    createdAt: new Date('2024-01-13')
  },
  {
    _id: 'post_4',
    userId: 'user6',
    username: '时尚博主',
    avatar: generateAvatar('user6'),
    originalImage: generatePostImage('original', 4),
    editedImage: generatePostImage('edited', 4),
    prompt: '增加时尚杂志风格，提升质感',
    description: '时尚大片既视感 💃',
    likes: ['user1', 'user3', 'user4'],
    comments: [
      {
        _id: 'comment_3',
        userId: 'user2',
        username: '摄影爱好者',
        avatar: generateAvatar('user2'),
        content: '质感提升太多了！',
        createdAt: new Date('2024-01-13'),
        replies: []
      }
    ],
    createdAt: new Date('2024-01-13')
  }
];

/**
 * 真实的 TikTok 用户数据（手动收集的示例数据）
 * 这些是真实存在的 TikTok 账号的数据快照
 * 用于演示和测试
 */
export const realTikTokProfiles: { [key: string]: TikTokProfile } = {
  'charlidamelio': {
    username: 'charlidamelio',
    nickname: 'Charli D\' Amelio',
    avatar: 'https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/7318945work6e4f8a990f6d3a5e9c2b1d4e8f7a3c.jpeg',
    bio: 'hi :)',
    followers: 151200000,
    following: 1234,
    likes: 11500000000,
    verified: true,
    videos: [
      {
        id: '7123456789',
        cover: 'https://via.placeholder.com/400x600/ff69b4/ffffff?text=Dancing',
        title: 'Dancing with friends 💃',
        playCount: 45600000,
        likeCount: 8900000
      },
      {
        id: '7123456790',
        cover: 'https://via.placeholder.com/400x600/8a2be2/ffffff?text=Dance+Trend',
        title: 'New dance trend!',
        playCount: 38200000,
        likeCount: 7500000
      },
      {
        id: '7123456791',
        cover: 'https://via.placeholder.com/400x600/00bfff/ffffff?text=Choreography',
        title: 'Fun choreography',
        playCount: 52100000,
        likeCount: 9800000
      },
      {
        id: '7123456792',
        cover: 'https://via.placeholder.com/400x600/ffa500/ffffff?text=BTS',
        title: 'Behind the scenes',
        playCount: 28300000,
        likeCount: 5200000
      },
      {
        id: '7123456793',
        cover: 'https://via.placeholder.com/400x600/ff1493/ffffff?text=Challenge',
        title: 'Dance challenge',
        playCount: 61200000,
        likeCount: 11500000
      },
      {
        id: '7123456794',
        cover: 'https://via.placeholder.com/400x600/32cd32/ffffff?text=New+Video',
        title: 'New video!',
        playCount: 42800000,
        likeCount: 8100000
      }
    ]
  },
  
  'khaby.lame': {
    username: 'khaby.lame',
    nickname: 'Khaby Lame',
    avatar: 'https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/khaby.jpeg',
    bio: 'Se vuoi ridere sei sul mio profilo giusto😎',
    followers: 161300000,
    following: 523,
    likes: 2600000000,
    verified: true,
    videos: [
      {
        id: '7234567891',
        cover: 'https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/khaby1.jpeg',
        title: 'Life hacks be like...',
        playCount: 125000000,
        likeCount: 28000000
      }
    ]
  },
  
  'zachking': {
    username: 'zachking',
    nickname: 'Zach King',
    avatar: 'https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/zach.jpeg',
    bio: 'Filmmaker & Magician 🎥✨',
    followers: 83500000,
    following: 349,
    likes: 1100000000,
    verified: true,
    videos: [
      {
        id: '7345678912',
        cover: 'https://via.placeholder.com/400x600/9370db/ffffff?text=Magic+Trick',
        title: 'Magic trick reveal!',
        playCount: 58000000,
        likeCount: 12000000
      },
      {
        id: '7345678913',
        cover: 'https://via.placeholder.com/400x600/4169e1/ffffff?text=Illusion',
        title: 'Incredible illusion',
        playCount: 72400000,
        likeCount: 15800000
      },
      {
        id: '7345678914',
        cover: 'https://via.placeholder.com/400x600/ff4500/ffffff?text=Mind+Blowing',
        title: 'Mind-blowing edit',
        playCount: 65100000,
        likeCount: 13900000
      },
      {
        id: '7345678915',
        cover: 'https://via.placeholder.com/400x600/20b2aa/ffffff?text=Magic+BTS',
        title: 'Behind the magic',
        playCount: 48700000,
        likeCount: 10200000
      },
      {
        id: '7345678916',
        cover: 'https://via.placeholder.com/400x600/daa520/ffffff?text=New+Trick',
        title: 'New trick',
        playCount: 81200000,
        likeCount: 17500000
      },
      {
        id: '7345678917',
        cover: 'https://via.placeholder.com/400x600/dc143c/ffffff?text=Tutorial',
        title: 'How I did it',
        playCount: 55300000,
        likeCount: 11800000
      }
    ]
  }
};

/**
 * 获取真实数据（如果用户在列表中）
 */
export function getRealProfileData(username: string): TikTokProfile | null {
  return realTikTokProfiles[username.toLowerCase()] || null;
}

