<div align="center">

<img src="https://img.shields.io/badge/-Youbi-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Youbi" width="280"/>

<h4>AI 驱动的 TikTok KOL 赋能平台</h4>

[English](README.md) | 简体中文

<a href="LICENSE">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</a>

</div>

Youbi，寓意卓越精神，通过 AI 驱动的工具赋能 TikTok 创作者，提升内容质量，最大化平台影响力。

## 目录
- [目录](#目录)
- [为什么选择 Youbi？](#为什么选择-youbi)
- [快速开始](#快速开始)
- [部署](#部署)
- [贡献](#贡献)
- [许可证](#许可证)

## 为什么选择 Youbi？

Youbi 革新了 TikTok 创作者管理和优化内容的方式。通过利用先进的 AI 技术，Youbi 将内容创作过程转变为智能化、数据驱动的工作流程。

**AI 图片增强**
- 一键视频封面美化
- 智能色彩分级和对比度优化
- 自动文字叠加生成
- 实时预览和对比

**资料智能分析**
- 全面的 TikTok 个人资料分析
- 实时数据同步
- 瀑布流布局展示视频作品集
- 互动指标和分析数据

**智能互动**
- AI 驱动的内容策略聊天助手
- 基于上下文的创意建议
- 交互式优化技巧
- 个人资料洞察和推荐

**社区探索**
- 发现并连接其他创作者
- 点赞和评论的社交互动
- 热门内容动态
- 创作者网络机会

## 快速开始

**前置要求**
- Node.js 18+ 和 npm
- Docker（可选，用于容器化部署）

**开始使用**
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

## 部署
**Docker**
```bash
cd Hera
docker compose -f docker/docker-compose.yml up -d
```

**故障排除**
```bash
# 查看应用日志
docker compose -f docker/docker-compose.yml logs -f app

# 停止并删除旧容器
docker stop hera && docker rm hera
docker rmi hera-app
```

## 贡献

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

该项目根据 MIT 许可证授权 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。
