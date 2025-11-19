<div align="center">

<img src="https://img.shields.io/badge/-Youbi-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Youbi" width="280"/>

<h4>AI-Powered TikTok KOL Empowerment Platform</h4>

English | [简体中文](README-CN.md)

<a href="LICENSE">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</a>

</div>

Youbi is an intelligent platform designed to empower TikTok Key Opinion Leaders (KOLs) with AI-driven tools for content creation, profile management, and community engagement. Built with modern web technologies, Youbi streamlines the workflow of content creators and helps them maximize their impact on the platform.

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Why Youbi?](#why-youbi)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Why Youbi?

Youbi revolutionizes how TikTok creators manage and optimize their content. By leveraging advanced AI technologies, Youbi transforms the content creation process into an intelligent, data-driven workflow.

**Core Capabilities**

- **AI Image Enhancement**: Automatically beautify video covers with intelligent color correction, contrast enhancement, and attention-grabbing text overlays
- **Profile Intelligence**: Comprehensive TikTok profile analysis with real-time data synchronization
- **Smart Interaction**: AI-powered chat assistant for content strategy and creative suggestions
- **Community Discovery**: Explore and connect with other creators through an engaging social feed
- **Modern Architecture**: Built on Next.js 15 and React 19 for optimal performance and developer experience

**Why Choose Youbi**

- **Time Saving**: Reduce content preparation time by up to 60% with automated image enhancement
- **Data-Driven**: Make informed decisions based on profile analytics and performance metrics
- **Creator-Focused**: Designed specifically for TikTok content creators' workflow
- **Production Ready**: Fully configured deployment pipeline with Docker support
- **Extensible**: Clean architecture allows easy integration of additional AI services

## Features

**TikTok Profile Management**
- Real-time profile data synchronization
- Video portfolio display with masonry layout
- Engagement metrics and analytics
- Profile comparison and tracking

**AI-Powered Image Enhancement**
- One-click video cover beautification
- Intelligent color grading and contrast optimization
- Automatic text overlay generation
- Real-time preview and comparison

**Smart Chat Assistant**
- Context-aware content suggestions
- Creative strategy recommendations
- Interactive Q&A for optimization tips
- Profile analysis and insights

**Community Exploration**
- Discover other creators' enhanced content
- Social engagement with likes and comments
- Trending content feed
- Creator networking opportunities

## Tech Stack

**Frontend**
- Next.js 15 with App Router
- React 19 with Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui component library
- Axios for API communication

**Backend Services**
- Next.js API Routes for backend logic
- Image proxy for CORS handling
- External AI services integration
- TikTok data fetching services

**Key Features**
- Responsive masonry grid layout
- Real-time image processing
- Cross-origin image handling
- Modern authentication flow

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- API keys for external services (see Configuration)
- Docker (optional, for containerized deployment)

### Automated Setup with setup.sh (Recommended)

The easiest way to get Youbi running is using our interactive setup script:

```bash
# 1. Clone the repository
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# 2. Make setup script executable and run it
chmod +x setup.sh
./setup.sh

# 3. Start development
make dev
```

The setup script will guide you through:
- Project configuration and customization
- Port configuration (Frontend: 3000, Backend: 8000)
- Dependencies installation
- Environment setup

### Alternative Quick Start (Manual)

```bash
# Clone and navigate to project
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# Install frontend dependencies
cd frontend
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see Youbi in action.

**Note**: If you later want to use setup.sh, remember to make it executable first:
```bash
chmod +x setup.sh
./setup.sh
```

## Configuration

### Environment Variables

Youbi requires several API keys for full functionality. Create a `.env.local` file in the frontend directory:

```bash
# Image Enhancement API (Required for AI beautification)
IMAGE_API_URL=https://api.jiekou.ai/v3/async
IMAGE_API_KEY=your_image_api_key_here

# RapidAPI (Optional - for real TikTok data fetching)
RAPIDAPI_KEY=your_rapidapi_key_here

# API Base URL (Usually no change needed)
NEXT_PUBLIC_API_BASE_URL=/api
```

**Getting API Keys:**

1. **Image API**: Sign up at the image enhancement service provider
2. **RapidAPI**: Create an account at RapidAPI and subscribe to TikTok API services (optional)

**Security Notes:**
- Never commit `.env.local` to version control
- Use different keys for development and production
- For Vercel deployment, set environment variables in the Vercel Dashboard

### Application Routes

- `/` - Welcome page and username input
- `/profile/[username]` - TikTok profile view with AI chat
- `/explorer` - Community content discovery feed

## Deployment

### Docker Deployment (Recommended)

```bash
cd Hera
docker compose -f docker/docker-compose.yml up -d
```

### Vercel Deployment

Youbi is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment Variables on Vercel:**
1. Go to Project Settings → Environment Variables
2. Add all required variables from Configuration section
3. Deploy the project

### Manual Production Build

```bash
cd frontend
npm run build
npm start
```

### Service Management

```bash
# Check running status
docker compose -f docker/docker-compose.yml ps

# View real-time logs
docker compose -f docker/docker-compose.yml logs -f

# Restart services
docker compose -f docker/docker-compose.yml restart

# Stop services
docker compose -f docker/docker-compose.yml down
```

### Troubleshooting

```bash
# View application logs
docker compose -f docker/docker-compose.yml logs -f app

# Stop and remove old containers
docker stop hera && docker rm hera
docker rmi hera-app

# Clear Next.js cache
cd frontend
rm -rf .next
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.