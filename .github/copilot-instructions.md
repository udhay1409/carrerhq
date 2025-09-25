# AI Agent Instructions for Career HQ NextJS Project

## Project Overview

Career HQ is a Study Abroad Platform built with Next.js App Router. The platform helps students find universities and courses across different countries for international education.

## Core Architecture

### Key Components

- `/src/app/*` - Next.js 13+ app router pages and layouts
- `/src/components/*` - Reusable React components
- `/src/models/*` - Mongoose models for data entities
- `/src/lib/*` - Utility functions and core services
- `/src/types/*` - TypeScript type definitions
- `/scripts/*` - Data seeding and testing utilities

### Data Flow

1. MongoDB is the primary database (see `src/lib/mongodb.ts` for connection pattern)
2. Models follow a strict schema pattern (`src/models/*`)
3. API routes in `src/app/api/*` handle data operations
4. Client components use custom hooks for data fetching

## Development Workflow

### Environment Setup

1. Requires MongoDB URI in `.env`
2. Uses TurboPack for development (`next dev --turbopack`)
3. HeroUI components for UI elements

### Key Commands

```bash
npm run dev        # Start development server with TurboPack
npm run build      # Build production bundle
npm run seed:blog  # Seed blog content
npm run seed:education  # Seed education data
```

### Data Management

- Use `scripts/seed-*.js` for seeding test data
- Data validation utilities in `src/hooks/useDataValidation.ts`
- Structured data helpers in `src/lib/structured-data.ts`

## Project-Specific Patterns

### File Naming

- React components: PascalCase (`BlogCard.tsx`, `UniversityCard.tsx`)
- Utilities: camelCase (`blogUtils.ts`, `cloudinaryUtils.ts`)
- Pages: kebab-case route names in app directory

### Component Conventions

- Use `@heroui/*` components for consistent UI
- Implement error boundaries at page level
- Handle loading states with skeleton components

### Data Model Structure

Example from `Course.ts`:

```typescript
interface ICourse extends Document {
  universityId: ObjectId;
  countryId: ObjectId;
  programName: string;
  studyLevel: string;
  // ... other fields
}
```

### API Patterns

- RESTful endpoints under `/api/*`
- MongoDB connection caching (see `mongodb.ts`)
- Consistent error handling through error.tsx boundaries

## Common Tasks

1. Adding new education data: Use seed scripts in `/scripts`
2. Creating new pages: Add to `/src/app` following Next.js 13+ conventions
3. Adding UI components: Place in `/src/components` with proper TypeScript types
