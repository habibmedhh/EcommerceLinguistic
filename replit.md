# E-Commerce Platform - Ultra Modern Multi-language Store

## Overview

This is a comprehensive e-commerce platform featuring a modern multi-language interface (English, French, Arabic) with a complete admin panel, responsive design, and advanced order management system. The platform includes WhatsApp integration, SEO optimization, configurable store settings, and a modern UI with animations.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management and caching
- **Tailwind CSS** with **shadcn/ui** for modern, responsive styling
- **Framer Motion** for smooth animations and transitions
- **React Hook Form** for optimized form handling
- **Component-based architecture** with reusable UI components

### Backend Architecture
- **Node.js** with **Express** server framework
- **TypeScript** for backend type safety
- **Session-based authentication** for admin users
- **RESTful API** design with structured endpoints
- **Middleware-based architecture** for authentication and request handling
- **Error handling** and logging system

### Database Architecture
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Modular schema design** with relationships between entities

## Key Components

### Database Schema
- **users** - Basic user accounts
- **admins** - Administrative users with role-based access
- **adminSessions** - Session management for admin authentication
- **categories** - Multi-language product categories
- **products** - Multi-language product catalog with pricing
- **orders** - Customer orders with status tracking
- **orderItems** - Individual items within orders
- **promotions** - Marketing campaigns and discounts
- **settings** - Configurable store parameters

### Core Features
1. **Multi-language Support**: Complete i18n with English, French, and Arabic (RTL)
2. **Admin Dashboard**: Comprehensive management interface
3. **Product Management**: CRUD operations with multi-language content
4. **Order Processing**: Complete order lifecycle management
5. **Settings Management**: Configurable store appearance and functionality
6. **SEO Optimization**: Dynamic meta tags and structured data
7. **WhatsApp Integration**: Direct customer communication
8. **Analytics**: Sales tracking and performance metrics

### UI Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animation System**: Scroll-triggered animations and parallax effects
- **Notification System**: Real-time admin notifications
- **Modal System**: Product quick-view and order forms
- **Cart Management**: Persistent shopping cart with localStorage

## Data Flow

### Frontend Data Management
1. **TanStack Query** handles all API communications with caching
2. **Custom hooks** abstract data operations (useProducts, useOrders, etc.)
3. **Context providers** manage global state (i18n, cart)
4. **localStorage** persists cart data and user preferences

### API Communication
1. **RESTful endpoints** under `/api/` prefix
2. **Session-based authentication** for admin operations
3. **Error handling** with consistent response formats
4. **Caching strategy** to optimize performance

### Authentication Flow
1. **Admin login** creates server-side session
2. **Session validation** on protected routes
3. **Automatic logout** on session expiration
4. **Role-based access control** for different admin levels

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pooling
- **@radix-ui**: Headless UI components for accessibility
- **bcryptjs**: Password hashing for security
- **express-session**: Session management
- **drizzle-orm**: Type-safe database operations
- **zod**: Runtime type validation

### UI and Styling
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **framer-motion**: Animation library
- **lucide-react**: Modern icon library

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundling

## Deployment Strategy

### Build Process
1. **Frontend build**: Vite compiles React app to static assets
2. **Backend build**: ESBuild bundles Node.js server
3. **Database migration**: Drizzle applies schema changes
4. **Asset optimization**: Images and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Security key for session encryption
- **NODE_ENV**: Environment mode (development/production)

### Production Considerations
- **HTTPS enforcement** for secure sessions
- **Database connection pooling** for scalability
- **Static asset serving** through CDN
- **Error monitoring** and logging
- **Performance optimization** with caching

## Changelog

- July 04, 2025. Initial setup
- July 04, 2025. Fixed deployment errors:
  * Added robust static file serving fallback for production
  * Improved error handling for missing build assets
  * Created deployment setup script for directory structure
  * Fixed production environment detection
  * Enhanced session security for production mode
- July 04, 2025. Enhanced admin management system:
  * Added complete admin account modification (name, email, password, role)
  * Implemented admin account deletion with safety checks
  * Added automatic default admin account creation/activation
  * Protected default admin account from deletion/deactivation
  * Ensured system always has at least one active administrator
- July 04, 2025. Implemented secure first-time setup:
  * Created dedicated first installation page with form interface
  * Added automatic detection of empty database state
  * Implemented secure admin creation only when database is empty
  * Added redirect logic from login to setup page when needed
  * Enhanced user experience with guided initial configuration

## User Preferences

Preferred communication style: Simple, everyday language.