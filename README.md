# BISM ALLAH ALRAHMAN ALRAHIM
# AMALI Learning Management System

## Overview

AMALI is a comprehensive multi-tenant SaaS Learning Management System that unifies Student Information Systems (SIS), billing, adaptive learning, AI tutoring, gamification, and analytics into a single platform.

## Features

- **Multi-Role System**: Support for Student, Teacher, Parent, and Admin views with role switching
- **Admin Dashboard**: Comprehensive dashboard with sections for Overview, Admissions, Academics, Billing, Users, Reports, and Settings
- **Authentication**: Secure OpenID Connect integration with Replit Auth
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Modern Stack**: React 18, TypeScript, Tailwind CSS, Express.js

## Technology Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack React Query for state management
- Tailwind CSS with Radix UI components
- React Hook Form with Zod validation

### Backend
- Node.js with Express.js
- TypeScript
- Drizzle ORM with PostgreSQL
- OpenID Connect authentication
- Session management with PostgreSQL store

### Infrastructure
- PostgreSQL (Neon serverless)
- Google Cloud Storage for file uploads
- Replit platform for development and deployment

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Access the application at http://localhost:5000

## Project Structure

- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared types and schemas
- `drizzle/` - Database migrations and schema

## Role System

The application supports four primary roles:

- **Student**: Access to courses, assignments, and progress tracking
- **Teacher**: Course management, grading, and student insights
- **Parent**: Child progress monitoring and communication
- **Admin**: System administration, user management, and analytics

## Admin Dashboard Features

- **Overview**: System statistics and organization metrics
- **Admissions**: Application management and enrollment tracking
- **Academics**: Course and curriculum management
- **Billing**: Subscription and payment management
- **Users**: User account and SSO management
- **Reports**: Analytics and performance reporting
- **Settings**: System configuration and preferences

## Database Schema

The system uses a comprehensive PostgreSQL schema covering:

- Multi-tenant organizations
- Role-based user management
- Course structures with units and lessons
- Assignment and submission tracking
- Progress monitoring and analytics
- Session management

## Authentication

The application uses OpenID Connect with Replit's authentication system for secure user management and multi-tenant access control.

## Development

This project follows modern full-stack development practices:

- Type safety throughout with TypeScript
- Component-based architecture with React
- RESTful API design
- Database migrations with Drizzle
- Responsive design with Tailwind CSS

## License

MIT License - see LICENSE file for details
