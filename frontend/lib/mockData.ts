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

// Mock social community posts data (for Explorer page testing)
export const mockPosts: Post[] = [
  {
    _id: 'post_0',
    userId: 'user1',
    username: 'SarahCreates',
    avatar: generateAvatar('user1'),
    originalImage: generatePostImage('original', 0),
    editedImage: generatePostImage('edited', 0),
    prompt: 'Enhance colors, add warm sunset filter',
    description: 'Tried the AI enhancement feature, the results are amazing! 🌅',
    likes: ['user2', 'user3'],
    comments: [
      {
        _id: 'comment_1',
        userId: 'user2',
        username: 'PhotoEnthusiast',
        avatar: generateAvatar('user2'),
        content: 'The effect looks great! What prompt did you use?',
        createdAt: new Date('2024-01-15'),
        replies: [
          {
            _id: 'reply_1',
            userId: 'user1',
            username: 'SarahCreates',
            avatar: generateAvatar('user1'),
            content: 'Just a simple sunset filter description, AI optimized it automatically',
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
    username: 'TikTokCreator',
    avatar: generateAvatar('user3'),
    originalImage: generatePostImage('original', 1),
    editedImage: generatePostImage('edited', 1),
    prompt: 'Transform to cyberpunk style, add neon light effects',
    description: 'Cyberpunk style transformation ⚡️',
    likes: ['user1'],
    comments: [],
    createdAt: new Date('2024-01-14')
  },
  {
    _id: 'post_2',
    userId: 'user4',
    username: 'FoodieLife',
    avatar: generateAvatar('user4'),
    originalImage: generatePostImage('original', 2),
    editedImage: generatePostImage('edited', 2),
    prompt: 'Make food look more delicious, enhance saturation and contrast',
    description: 'This is how you edit food photos! 😋',
    likes: ['user1', 'user2', 'user3'],
    comments: [
      {
        _id: 'comment_2',
        userId: 'user5',
        username: 'HungryTraveler',
        avatar: generateAvatar('user5'),
        content: 'Looks so delicious!',
        createdAt: new Date('2024-01-14'),
        replies: []
      }
    ],
    createdAt: new Date('2024-01-14')
  },
  {
    _id: 'post_3',
    userId: 'user5',
    username: 'TravelVlogger',
    avatar: generateAvatar('user5'),
    originalImage: generatePostImage('original', 3),
    editedImage: generatePostImage('edited', 3),
    prompt: 'Add dreamy sky and cloud effects',
    description: 'Travel photo post-processing ☁️',
    likes: [],
    comments: [],
    createdAt: new Date('2024-01-13')
  },
  {
    _id: 'post_4',
    userId: 'user6',
    username: 'FashionGuru',
    avatar: generateAvatar('user6'),
    originalImage: generatePostImage('original', 4),
    editedImage: generatePostImage('edited', 4),
    prompt: 'Add fashion magazine style, enhance texture',
    description: 'Fashion editorial vibes 💃',
    likes: ['user1', 'user3', 'user4'],
    comments: [
      {
        _id: 'comment_3',
        userId: 'user2',
        username: 'PhotoEnthusiast',
        avatar: generateAvatar('user2'),
        content: 'The texture improvement is incredible!',
        createdAt: new Date('2024-01-13'),
        replies: []
      }
    ],
    createdAt: new Date('2024-01-13')
  }
];
