# Disaster Response Hub - Architecture Documentation

## Overview

This is a full-stack disaster response platform built with React, Express, and PostgreSQL. The application enables real-time monitoring and coordination of disaster relief efforts through social media integration, location services, and resource management. It combines modern web technologies with AI-powered features for efficient disaster response coordination.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, TanStack Query for state management, shadcn/ui components
- **Backend**: Express.js with TypeScript, serving both API endpoints and static files
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time**: WebSocket integration for live updates
- **AI Integration**: Google Gemini API for location extraction and image verification
- **Development**: Vite for fast development and building

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom disaster response color scheme
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **API Layer**: RESTful endpoints organized in `/api` routes
- **Authentication**: Mock authentication system (placeholder for real auth)
- **Services**: Modular services for Gemini AI, geocoding, social media monitoring, and WebSocket
- **Storage**: Abstracted storage interface with in-memory implementation

### Database Schema
- **Users**: Authentication and role management (admin/contributor)
- **Disasters**: Main disaster records with location, tags, and audit trails
- **Reports**: User-submitted reports with verification status
- **Resources**: Location-based resources (shelters, hospitals, food centers)
- **Social Media Posts**: Aggregated social media content with priority classification
- **Cache**: General-purpose caching for API responses

## Data Flow

1. **Disaster Creation**: Users create disaster records → AI extracts location → Geocoding service gets coordinates → Real-time updates via WebSocket
2. **Social Media Monitoring**: Background service monitors social platforms → Classifies posts by priority → Updates feeds in real-time
3. **Resource Discovery**: Location-based queries find nearby resources → Distance calculations → Interactive mapping
4. **Report Verification**: Users submit reports → AI-powered image verification → Status updates propagated via WebSocket

## External Dependencies

### Required APIs
- **Google Gemini API**: AI-powered location extraction and content analysis
- **Geocoding Services**: Google Maps API (primary), Mapbox API (secondary), OpenStreetMap Nominatim (fallback)

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **Vite**: Development server and build tool
- **ESBuild**: Server-side bundling for production

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling

## Deployment Strategy

The application is configured for Replit deployment with:
- **Auto-scaling**: Configured for automatic scaling based on demand
- **Build Process**: Vite builds client assets, ESBuild bundles server code
- **Environment**: Node.js 20 with PostgreSQL 16
- **Port Configuration**: Internal port 5000 mapped to external port 80

Production deployment involves:
1. Building client assets to `dist/public`
2. Bundling server code to `dist/index.js`
3. Database migrations via Drizzle Kit
4. Environment variable configuration for API keys

## Changelog

- June 19, 2025: Initial setup with disaster response platform
- June 19, 2025: Enhanced with Grok AI integration for location extraction
- June 19, 2025: Updated resource mapping with authentic Indian emergency resources (Mumbai, Delhi, Chennai, Bangalore, Kolkata) replacing New York mock data
- June 19, 2025: Fixed nearby resources system to show real-time emergency facilities based on Indian city coordinates

## User Preferences

Preferred communication style: Simple, everyday language.