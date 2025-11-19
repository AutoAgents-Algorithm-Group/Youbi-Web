/**
 * 生成彩色占位图 SVG Data URI
 * 浏览器兼容版本（使用 btoa 代替 Node.js 的 Buffer）
 */

export function generatePlaceholderImage(
  width: number = 400,
  height: number = 600,
  backgroundColor: string = '1a1a1a',
  textColor: string = 'ffffff',
  text: string = 'Video'
): string {
  // 将十六进制颜色转换为 RGB
  const bgColor = `#${backgroundColor}`;
  const fgColor = `#${textColor}`;
  
  // 生成 SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="${fgColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  
  // 转换为 base64（使用浏览器的 btoa）
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  
  return `data:image/svg+xml;base64,${base64}`;
}

// 预定义的彩色主题
const colorThemes = [
  { bg: 'ff69b4', fg: 'ffffff', name: 'Pink' },
  { bg: '8a2be2', fg: 'ffffff', name: 'Purple' },
  { bg: '00bfff', fg: 'ffffff', name: 'Blue' },
  { bg: 'ffa500', fg: 'ffffff', name: 'Orange' },
  { bg: 'ff1493', fg: 'ffffff', name: 'DeepPink' },
  { bg: '32cd32', fg: 'ffffff', name: 'Green' },
  { bg: '9370db', fg: 'ffffff', name: 'MediumPurple' },
  { bg: '4169e1', fg: 'ffffff', name: 'RoyalBlue' },
  { bg: 'ff4500', fg: 'ffffff', name: 'OrangeRed' },
  { bg: '20b2aa', fg: 'ffffff', name: 'LightSeaGreen' },
  { bg: 'daa520', fg: 'ffffff', name: 'Goldenrod' },
  { bg: 'dc143c', fg: 'ffffff', name: 'Crimson' },
];

/**
 * 根据索引生成彩色占位图
 */
export function generateColorfulPlaceholder(index: number, text: string = `Video ${index + 1}`): string {
  const theme = colorThemes[index % colorThemes.length];
  return generatePlaceholderImage(400, 600, theme.bg, theme.fg, text);
}

/**
 * 为视频封面生成占位图
 */
export function generateVideoCover(index: number): string {
  return generateColorfulPlaceholder(index, `Video ${index + 1}`);
}

