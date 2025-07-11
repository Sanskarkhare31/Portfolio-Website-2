# Portfolio Application

## Overview

This is a full-stack portfolio application built with React, Express.js, and PostgreSQL. It features a public portfolio view and an admin interface for content management. The application uses Replit Authentication for secure admin access and allows portfolio owners to manage their profile information and showcase projects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL storage
- **File Uploads**: Multer for handling image uploads

### Database Design
- **Users Table**: Stores user authentication data (required for Replit Auth)
- **Profiles Table**: Contains portfolio profile information
- **Projects Table**: Stores project details and metadata
- **Sessions Table**: Handles session persistence (required for Replit Auth)

## Key Components

### Authentication System
- Uses Replit's OpenID Connect for secure authentication
- Session-based authentication with PostgreSQL session storage
- Mandatory user and session tables for Replit Auth compliance
- Automatic user profile creation and updates

### Content Management
- Admin interface for editing profile information
- Project CRUD operations with image upload support
- File upload handling with validation (images only, 5MB limit)
- Real-time content updates using TanStack Query

### UI Components
- Complete shadcn/ui component library integration
- Responsive design with mobile-first approach
- Modal dialogs for editing content
- Toast notifications for user feedback
- File upload component with drag-and-drop support

### Public Portfolio View
- Clean, professional portfolio display
- Project showcase with filtering capabilities
- Contact form integration
- SEO-friendly structure

## Data Flow

1. **Authentication Flow**:
   - User accesses admin login
   - Redirects to Replit OIDC provider
   - Upon successful auth, creates/updates user record
   - Establishes session and redirects to admin dashboard

2. **Content Management Flow**:
   - Admin accesses protected routes
   - CRUD operations on profile and projects
   - File uploads processed and stored locally
   - Database updates trigger UI refresh via TanStack Query

3. **Public View Flow**:
   - Public users access portfolio without authentication
   - Data fetched from API endpoints
   - Graceful loading states and error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **multer**: File upload handling
- **connect-pg-simple**: PostgreSQL session store

### Authentication Dependencies
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management

### UI Dependencies
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- Express server with TypeScript compilation via tsx
- Environment variables for database and authentication configuration
- Local file storage for uploaded images

### Production Build
- Vite builds optimized frontend bundle
- esbuild compiles server code for production
- Static file serving for client assets and uploads
- Database migrations via Drizzle Kit

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit application identifier
- `ISSUER_URL`: OpenID Connect issuer endpoint

### File Structure
- `/client`: React frontend application
- `/server`: Express.js backend
- `/shared`: Shared TypeScript types and schemas
- `/uploads`: Local file storage for images
- `/migrations`: Database migration files

The application is designed to be deployed on Replit but can be adapted for other hosting platforms with minimal configuration changes.