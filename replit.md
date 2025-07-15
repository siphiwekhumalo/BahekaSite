# Replit.md - Baheka Tech Website

## Overview

This is a modern, full-stack web application for Baheka Tech, a software solutions company. The application is built with React/TypeScript on the frontend and Express.js on the backend, using PostgreSQL as the database with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

- Removed cybersecurity and AI & data analytics services per user request
- Added UI/UX Design & Engineering as a new service offering
- Replaced Digital Banking Platform portfolio project with B-One Trading Platform
- Updated blog posts and categories to reflect new service focus
- Updated service icons and mappings throughout the application
- **Careers page removed**: Completely eliminated careers page from navigation and routing
- **Portfolio updates**: "Learning Management System" → "EduConnect LMS", "Enterprise Cloud Migration" → "WizData (data scraping/sourcing platform)"
- **Migration completed**: Successfully migrated from Replit Agent to Replit environment
- Fixed email service to work without SENDGRID_API_KEY (graceful fallback)
- Added comprehensive README.md for local development setup
- Verified project runs cleanly in Replit environment with proper security practices
- **AWS Lambda and S3 Integration**: Complete serverless setup with hybrid deployment support
- Added Lambda functions for contact forms, file uploads, and image processing
- Implemented S3 integration with presigned URLs and automatic image optimization
- Created deployment scripts and comprehensive AWS documentation
- **Production EC2 Deployment**: Complete production infrastructure setup
- Created comprehensive EC2 deployment scripts with SSL, monitoring, and security
- Added Terraform infrastructure as code and Docker containerization options
- Implemented enterprise-grade monitoring, backups, and maintenance tools
- **Ready for Production**: Full deployment guide and automated scripts created
- **Domain-Specific Configuration**: All scripts configured for bahekatechfirm.com deployment
- **One-Click Deployment**: Created comprehensive deployment script for easy execution
- **Netlify Integration**: Complete serverless deployment setup with custom domain configuration
- **DNS Management**: AWS Route 53 integration for bahekatechfirm.com domain resolution
- **Email Configuration**: Updated all email addresses to use info@bahekatech.com for consistent branding
- **SendGrid Integration**: Configured SendGrid API key for production-ready email notifications

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and animations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reloading with Vite middleware integration

### Key Design Decisions
1. **Monorepo Structure**: Frontend (`client/`), backend (`server/`), and shared code (`shared/`) in one repository
2. **Type Safety**: Full TypeScript implementation with shared types between frontend and backend
3. **Modern UI**: Component-based architecture with shadcn/ui for consistent design
4. **Database-First**: Drizzle schema as the source of truth for data models

## Key Components

### Frontend Structure
- **Pages**: Home, About, Services, Portfolio, Careers, Blog, Contact
- **Components**: Reusable UI components in `client/src/components/`
- **Sections**: Page-specific sections like Hero, Services, Portfolio
- **Layout**: Header with navigation and Footer
- **Forms**: Contact form with validation and submission

### Backend Structure
- **Routes**: API endpoints in `server/routes.ts`
- **Storage**: Data access layer with in-memory fallback (`server/storage.ts`)
- **Schema**: Database schema and validation in `shared/schema.ts`

### Database Schema
```sql
-- Users table (basic user management)
users: id, username, password

-- Contact submissions (form submissions)
contact_submissions: id, firstName, lastName, email, service, message, createdAt, status
```

### API Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact/submissions` - Get all contact submissions (admin)
- `GET /api/contact/submissions/:id` - Get specific submission
- `PUT /api/contact/submissions/:id/status` - Update submission status

## Data Flow

1. **Contact Form Submission**:
   - User fills out contact form on frontend
   - Form data validated using Zod schema
   - POST request to `/api/contact` endpoint
   - Backend validates and stores submission
   - Success/error response sent back to frontend

2. **Page Navigation**:
   - Client-side routing with Wouter
   - Single-page application with dynamic content loading
   - Smooth transitions with Framer Motion

3. **Data Management**:
   - TanStack Query for server state caching
   - Optimistic updates for better UX
   - Error boundary handling

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form, Hookform resolvers
- **Validation**: Zod for schema validation
- **Animations**: Framer Motion
- **State Management**: TanStack React Query
- **Routing**: Wouter
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend Dependencies
- **Server**: Express.js
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Validation**: Zod, drizzle-zod
- **Session**: connect-pg-simple (for PostgreSQL sessions)
- **Development**: tsx for TypeScript execution

### Development Dependencies
- **Build Tools**: Vite, esbuild
- **TypeScript**: Full TypeScript support
- **PostCSS**: For CSS processing
- **Replit Integration**: Replit-specific plugins and error handling

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` starts both frontend and backend
- **Hot Reloading**: Vite provides instant feedback for frontend changes
- **TypeScript Checking**: `npm run check` for type validation
- **Database**: `npm run db:push` to sync schema changes

### Production Options

#### Option 1: Traditional EC2 Deployment (Recommended)
- **Complete Setup**: Automated scripts for EC2 instance configuration
- **Production Features**: NGINX, PM2, SSL certificates, monitoring
- **Security**: Firewall, fail2ban, security headers, database isolation
- **Monitoring**: Health checks, automated backups, log rotation
- **Scaling**: Easy vertical scaling, load balancer ready

#### Option 2: Serverless AWS Lambda
- **Lambda Functions**: Contact forms, file uploads, image processing
- **S3 Integration**: Secure file storage with presigned URLs
- **API Gateway**: RESTful API management with CORS
- **Cost Efficient**: Pay-per-request pricing model

#### Option 3: Containerized Deployment
- **Docker**: Multi-stage builds for optimization
- **Docker Compose**: Complete stack with PostgreSQL and NGINX
- **Kubernetes Ready**: Easy migration to container orchestration

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public/`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Single Command**: `npm run build` handles both frontend and backend
- **Deployment**: Multiple deployment options with automated scripts

### Database Management
- **Migrations**: Drizzle Kit manages database schema changes
- **Environment**: `DATABASE_URL` environment variable required
- **Provider**: Neon Database for serverless PostgreSQL hosting

### Key Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance**: Optimized images, code splitting, and caching
- **Accessibility**: ARIA labels and keyboard navigation support
- **Error Handling**: Comprehensive error boundaries and validation
- **Type Safety**: End-to-end TypeScript for better developer experience

The application serves as a professional company website with contact form functionality, showcasing Baheka Tech's services and portfolio while providing a solid foundation for future feature expansion.