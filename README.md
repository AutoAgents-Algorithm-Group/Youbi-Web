<div align="center">

<img src="https://img.shields.io/badge/-Youbi Web-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Youbi" width="280"/>

<h4>AI-Powered TikTok KOL Empowerment Platform</h4>

English | [简体中文](README-CN.md)

<a href="LICENSE">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</a>

</div>

Named after the spirit of excellence, Youbi empowers TikTok creators with AI-driven tools to elevate their content and maximize their impact on the platform.

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Why Youbi?](#why-youbi)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Why Youbi?

Youbi revolutionizes how TikTok creators manage and optimize their content. By leveraging advanced AI technologies, Youbi transforms the content creation process into an intelligent, data-driven workflow.

**AI Image Enhancement**
- One-click video cover beautification
- Intelligent color grading and contrast optimization
- Automatic text overlay generation
- Real-time preview and comparison

**Profile Intelligence**
- Comprehensive TikTok profile analysis
- Real-time data synchronization
- Video portfolio with masonry layout
- Engagement metrics and analytics

**Smart Interaction**
- AI-powered chat assistant for content strategy
- Context-aware creative suggestions
- Interactive optimization tips
- Profile insights and recommendations

**Community Discovery**
- Explore and connect with other creators
- Social engagement with likes and comments
- Trending content feed
- Creator networking opportunities

## Quick Start

**Prerequisites**
- Node.js 18+ and npm
- Docker (optional, for containerized deployment)

**Get Started**
```bash
# 1. Clone the repository
git clone https://github.com/AutoAgents-Algorithm-Group/Youbi-Web.git
cd Youbi-Web

# 2. Make setup script executable and run it
chmod +x setup.sh
./setup.sh

# 3. Start development
make dev
```

## Deployment
**Docker**
```bash
cd Youbi-Web
docker compose -f docker/docker-compose.yml up -d
```

**Troubleshooting**
```bash
# View application logs
docker compose -f docker/docker-compose.yml logs -f app

# Stop and remove old containers
docker stop youbi && docker rm youbi
docker rmi youbi-app
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
