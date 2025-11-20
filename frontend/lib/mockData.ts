import { generatePlaceholderImage } from './generatePlaceholder';
import type { Post } from './types/youbi';

// 生成头像占位图
function generateAvatar(userId: string): string {
  const colors = ['ff69b4', '8a2be2', '00bfff', 'ffa500', 'ff1493', '32cd32'];
  const colorIndex = parseInt(userId.replace(/\D/g, '')) % colors.length;
  const color = colors[colorIndex];
  const initial = userId.charAt(userId.length - 1).toUpperCase();
  return generatePlaceholderImage(150, 150, color, 'ffffff', initial);
}

// 生成图片占位图（仅用于社区帖子）
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
