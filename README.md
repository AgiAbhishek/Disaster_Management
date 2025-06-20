# Disaster Response Coordination Platform

A comprehensive disaster response coordination platform that provides real-time, location-specific emergency information and resource management across India. Built with React, Express.js, and PostgreSQL.

![Platform Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js Version](https://img.shields.io/badge/Node.js-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🚀 Features

- **Real-time Disaster Monitoring** - Track active disasters across Indian cities
- **Social Media Integration** - Monitor feeds from Indian emergency services (NDRF, IMD, MHA)
- **Resource Mapping** - Locate nearby emergency facilities (hospitals, shelters, relief centers)
- **Official Updates** - Live updates from government authorities and disaster management agencies
- **Image Verification** - AI-powered disaster image authentication using Grok API
- **Location Services** - Automatic coordinate detection for Indian cities
- **WebSocket Updates** - Real-time data synchronization across all components

## 🏛️ Architecture

- **Frontend**: React 18 + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript + WebSocket
- **Database**: PostgreSQL with Drizzle ORM (also supports in-memory storage)
- **AI Integration**: Google Gemini API for location extraction, Grok API for image verification
- **Real-time**: WebSocket for live updates
- **Development**: Vite for fast development and building

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20.x or higher** ([Download here](https://nodejs.org/))
- **PostgreSQL 14+** (optional - app works with in-memory storage)
- **Git** for version control

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/disaster-response-platform.git
cd disaster-response-platform
```

### 2. Install Dependencies

```bash
# Clean install with Node.js v20
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database (Optional - uses in-memory storage if not provided)
DATABASE_URL=postgresql://username:password@localhost:5432/disaster_response_db

# Development Environment
NODE_ENV=development

# API Keys (Optional - platform works with mock data)
GEMINI_API_KEY=your_gemini_api_key_here
XAI_API_KEY=your_grok_api_key_here
```

### 4. Database Setup (Optional)

If you want to use PostgreSQL instead of in-memory storage:

```bash
# Create database
createdb disaster_response_db

# Push schema to database
npm run db:push
```

### 5. TypeScript Configuration

Create the required type definitions:

**Create folder:** `server/@types/`

**Create file:** `server/@types/express.d.ts`

```typescript
// Type definitions for Express with custom user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        role: string;
      };
    }
  }
}

export {};
```

### 6. Start the Application

```bash
# Development mode (recommended)
npm run dev

# The application will be available at http://localhost:5000
```

## 🚀 Quick Start

1. **Open your browser** and navigate to `http://localhost:5000`
2. **Create a disaster report** by clicking "Report Disaster"
3. **Select an Indian city** (Mumbai, Delhi, Chennai, etc.) - coordinates are set automatically
4. **View real-time updates** from Indian emergency services in the Social Media Feed
5. **Check available resources** like hospitals and relief centers near disaster locations
6. **Monitor official updates** from NDRF, IMD, and other government agencies

## 📁 Project Structure

```
disaster-response-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and API client
├── server/                 # Express backend
│   ├── @types/             # TypeScript definitions
│   ├── services/           # Business logic services
│   ├── routes.ts           # API routes
│   └── storage.ts          # Data storage interface
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)

# Utilities
npm run type-check   # Run TypeScript type checking
```

## 🌍 Indian Localization Features

The platform is specifically designed for Indian disaster response:

- **Cities Supported**: Mumbai, Delhi, Chennai, Bangalore, Kolkata, Hyderabad, Ahmedabad, Pune
- **Automatic Coordinates**: Indian city names automatically resolve to correct coordinates
- **Government Sources**: Integrated with NDRF, IMD, MHA, Indian Railways official feeds
- **Emergency Resources**: Pre-loaded with authentic Indian emergency facilities
- **Regional Alerts**: Location-specific disaster monitoring across Indian states

## 🔐 API Keys & External Services

### Required for Full Functionality:

1. **Google Gemini API** (for location extraction)
   - Get your key at: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add as `GEMINI_API_KEY` in `.env`

2. **Grok API** (for image verification)
   - Get your key at: [xAI Console](https://console.x.ai/)
   - Add as `XAI_API_KEY` in `.env`

*Note: The platform works with mock data if API keys are not provided.*

## 🚀 Deployment Options

### Recommended Platforms:

1. **Vercel** (Free tier available)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Railway** (PostgreSQL included)
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Render** (Free tier available)
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set start command: `npm start`

## 🐛 Troubleshooting

### Common Issues:

**Node.js Version Errors**
```bash
# Check your Node.js version
node --version

# Should be 20.x or higher
# If not, update Node.js from nodejs.org
```

**TypeScript Errors**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

**Database Connection Issues**
```bash
# Check PostgreSQL is running
pg_ctl status

# Or use in-memory storage (remove DATABASE_URL from .env)
```

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/disaster-response-platform/issues)
- **Documentation**: Check the `/docs` folder for detailed guides

## 🙏 Acknowledgments

- Indian disaster management authorities for data insights
- Open source community for excellent tools and libraries
- Emergency responders who inspired this platform

---

**Built with ❤️ for Indian disaster response coordination**
