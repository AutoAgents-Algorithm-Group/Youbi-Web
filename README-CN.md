<div align="center">

<img src="https://img.shields.io/badge/-Youbi-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Youbi" width="280"/>

<h4>AI 驱动的 TikTok KOL 赋能平台</h4>

[English](README.md) | 简体中文

<a href="LICENSE">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</a>

</div>

Youbi 是一个智能平台，旨在通过 AI 驱动的工具为 TikTok 关键意见领袖（KOL）提供内容创作、个人资料管理和社区互动的支持。基于现代 Web 技术构建，Youbi 简化了内容创作者的工作流程，帮助他们在平台上最大化影响力。

## 目录
- [目录](#目录)
- [为什么选择 Youbi？](#为什么选择-youbi)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [部署](#部署)
- [贡献](#贡献)
- [许可证](#许可证)

## 为什么选择 Youbi？

Youbi 革新了 TikTok 创作者管理和优化内容的方式。通过利用先进的 AI 技术，Youbi 将内容创作过程转变为智能化、数据驱动的工作流程。

**核心能力**

- **AI 图片增强**：自动美化视频封面，智能调色、对比度优化和引人注目的文字叠加
- **资料智能分析**：全面的 TikTok 个人资料分析，实时数据同步
- **智能互动**：AI 驱动的聊天助手，提供内容策略和创意建议
- **社区探索**：通过引人入胜的社交动态探索和连接其他创作者
- **现代架构**：基于 Next.js 15 和 React 19 构建，提供最佳性能和开发体验

**选择 Youbi 的理由**

- **节省时间**：通过自动化图片增强，内容准备时间减少多达 60%
- **数据驱动**：基于个人资料分析和性能指标做出明智决策
- **创作者导向**：专为 TikTok 内容创作者的工作流程设计
- **生产就绪**：完全配置的 Docker 部署管道
- **可扩展性**：清晰的架构设计，易于集成其他 AI 服务

## 功能特性

**TikTok 个人资料管理**
- 实时个人资料数据同步
- 瀑布流布局展示视频作品集
- 互动指标和分析数据
- 个人资料对比和跟踪

**AI 驱动的图片增强**
- 一键视频封面美化
- 智能色彩分级和对比度优化
- 自动文字叠加生成
- 实时预览和对比

**智能聊天助手**
- 基于上下文的内容建议
- 创意策略推荐
- 优化技巧的交互式问答
- 个人资料分析和洞察

**社区探索**
- 发现其他创作者的增强内容
- 点赞和评论的社交互动
- 热门内容动态
- 创作者网络机会

## 技术栈

**前端**
- Next.js 15 配合 App Router
- React 19 配合 Server Components
- TypeScript 提供类型安全
- Tailwind CSS 样式系统
- shadcn/ui 组件库
- Axios 进行 API 通信

**后端服务**
- Next.js API Routes 实现后端逻辑
- 图片代理处理 CORS 问题
- 外部 AI 服务集成
- TikTok 数据获取服务

**关键特性**
- 响应式瀑布流布局
- 实时图片处理
- 跨域图片处理
- 现代化认证流程

## 快速开始

### 前置要求
- Node.js 18+ 和 npm
- 外部服务 API 密钥（见配置说明）
- Docker（可选，用于容器化部署）

### 使用 setup.sh 自动设置（推荐）

使用交互式设置脚本是启动 Youbi 最简单的方式：

```bash
# 1. 克隆仓库
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# 2. 使设置脚本可执行并运行
chmod +x setup.sh
./setup.sh

# 3. 开始开发
make dev
```

设置脚本将引导您完成：
- 项目配置和自定义
- 端口配置（前端：3000，后端：8000）
- 依赖安装
- 环境设置

### 手动快速开始（备选方案）

```bash
# 克隆并进入项目
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# 安装前端依赖
cd frontend
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入您的 API 密钥

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看 Youbi 运行效果。

**注意**：如果之后想使用 setup.sh，记得先使其可执行：
```bash
chmod +x setup.sh
./setup.sh
```

## 配置说明

### 环境变量

Youbi 需要几个 API 密钥才能实现完整功能。在 frontend 目录创建 `.env.local` 文件：

```bash
# 图片增强 API（AI 美化功能必需）
IMAGE_API_URL=https://api.jiekou.ai/v3/async
IMAGE_API_KEY=your_image_api_key_here

# RapidAPI（可选 - 用于获取真实 TikTok 数据）
RAPIDAPI_KEY=your_rapidapi_key_here

# API 基础 URL（通常无需更改）
NEXT_PUBLIC_API_BASE_URL=/api
```

**获取 API 密钥：**

1. **图片 API**：在图片增强服务提供商处注册
2. **RapidAPI**：在 RapidAPI 创建账户并订阅 TikTok API 服务（可选）

**安全提示：**
- 永远不要将 `.env.local` 提交到版本控制
- 开发和生产环境使用不同的密钥
- Vercel 部署时，在 Vercel 控制面板设置环境变量

### 应用路由

- `/` - 欢迎页面和用户名输入
- `/profile/[username]` - TikTok 个人资料视图配合 AI 聊天
- `/explorer` - 社区内容发现动态

## 部署

### Docker 部署（推荐）

```bash
cd Hera
docker compose -f docker/docker-compose.yml up -d
```

### Vercel 部署

Youbi 针对 Vercel 部署进行了优化：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

**在 Vercel 上设置环境变量：**
1. 进入项目设置 → 环境变量
2. 添加配置说明部分的所有必需变量
3. 部署项目

### 手动生产构建

```bash
cd frontend
npm run build
npm start
```

### 服务管理

```bash
# 检查运行状态
docker compose -f docker/docker-compose.yml ps

# 查看实时日志
docker compose -f docker/docker-compose.yml logs -f

# 重启服务
docker compose -f docker/docker-compose.yml restart

# 停止服务
docker compose -f docker/docker-compose.yml down
```

### 故障排除

```bash
# 查看应用日志
docker compose -f docker/docker-compose.yml logs -f app

# 停止并删除旧容器
docker stop hera && docker rm hera
docker rmi hera-app

# 清除 Next.js 缓存
cd frontend
rm -rf .next
npm run build
```

## 贡献

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

该项目根据 MIT 许可证授权 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。