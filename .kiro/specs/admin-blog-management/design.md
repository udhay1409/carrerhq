# Design Document

## Overview

The Admin Blog Management system will be a comprehensive frontend interface built with Next.js 15 and HeroUI components, providing full CRUD functionality for blog posts and categories. The system will integrate seamlessly with the existing blog API endpoints and follow the established project patterns for routing, styling, and component architecture.

The admin interface will be accessible at `/admin` routes and will provide a modern, responsive dashboard experience without authentication requirements. The design emphasizes performance through individual HeroUI component imports, accessibility compliance, and optimal user experience across all device sizes.

## Architecture

### Routing Structure

```
/admin
├── /admin/dashboard          # Main dashboard with statistics
├── /admin/blog              # Blog posts listing and management
├── /admin/blog/new          # Create new blog post
├── /admin/blog/[id]/edit    # Edit existing blog post
└── /admin/categories        # Category management
```

### Component Hierarchy

```
AdminLayout
├── ExpandableSidebar (with hover expand, mobile responsive, Lucide icons)
└── Page Content
    ├── AdminDashboard
    ├── AdminBlogList
    ├── AdminBlogForm (create/edit)
    └── AdminCategoryManager
```

### State Management

- **Local State**: React useState for form data, UI states, and temporary data
- **Server State**: Direct API calls with loading/error states, no external state management library needed
- **Form State**: Custom form handling with validation and error management

## Components and Interfaces

### Core Admin Components

#### 1. AdminLayout

**Location**: `src/components/admin/admin-layout.tsx`
**Purpose**: Provides consistent layout structure with expandable sidebar for all admin pages
**Dependencies**: Custom Sidebar component, Lucide React icons, Framer Motion
**Features**: Hover-to-expand sidebar, mobile responsive drawer, dark mode support

```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}
```

#### 1.1. ExpandableSidebar

**Location**: `src/components/ui/sidebar.tsx`
**Purpose**: Reusable expandable sidebar component with animations
**Dependencies**: Framer Motion, Lucide React icons, clsx, tailwind-merge
**Features**:

- Expands on hover (desktop)
- Mobile responsive with drawer overlay
- Dark mode support
- Smooth animations
- Icon-only collapsed state

**Admin Sidebar Links**:

- Dashboard (LayoutDashboard icon)
- Blog Posts (FileText icon)
- Categories (Tags icon)
- Settings (Settings icon)

````

#### 2. AdminDashboard

**Location**: `src/components/admin/admin-dashboard.tsx`
**Purpose**: Main dashboard with statistics and quick actions
**HeroUI Components**: `Card`, `Skeleton`, `Button`, `Chip`

```typescript
interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
}

interface RecentPost {
  id: string;
  title: string;
  author: string;
  date: string;
  published: boolean;
}
````

#### 3. AdminBlogList

**Location**: `src/components/admin/admin-blog-list.tsx`
**Purpose**: Table view of all blog posts with actions
**HeroUI Components**: `Table`, `Pagination`, `Input`, `Select`, `Button`, `Chip`, `Modal`

```typescript
interface BlogListProps {
  initialPosts?: BlogPost[];
  initialPagination?: PaginationInfo;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}
```

#### 4. AdminBlogForm

**Location**: `src/components/admin/admin-blog-form.tsx`
**Purpose**: Form for creating and editing blog posts
**HeroUI Components**: `Input`, `Textarea`, `Select`, `Button`, `Card`, `Switch`

```typescript
interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: BlogPost;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
}

interface BlogFormData {
  title: string;
  excerpt: string;
  content: BlogContent[];
  imageId: string;
  author: string;
  authorRole: string;
  authorImageId: string;
  category: string;
  readTime: string;
  published: boolean;
}

interface FormErrors {
  [key: string]: string | undefined;
}
```

#### 5. AdminCategoryManager

**Location**: `src/components/admin/admin-category-manager.tsx`
**Purpose**: Manage blog categories
**HeroUI Components**: `Card`, `Input`, `Button`, `Chip`, `Modal`

```typescript
interface CategoryManagerProps {
  initialCategories?: BlogCategory[];
}

interface CategoryWithStats extends BlogCategory {
  postCount: number;
}
```

#### 6. ContentEditor

**Location**: `src/components/admin/content-editor.tsx`
**Purpose**: Rich content editor for blog post content
**HeroUI Components**: `Card`, `Button`, `Input`, `Textarea`

```typescript
interface ContentEditorProps {
  content: BlogContent[];
  onChange: (content: BlogContent[]) => void;
}

interface ContentBlock {
  id: string;
  type: "heading" | "paragraph";
  text: string;
}
```

### Page Components

#### 1. Admin Dashboard Page

**Location**: `src/app/admin/dashboard/page.tsx`
**Purpose**: Server component that fetches dashboard data

#### 2. Admin Blog Pages

**Location**: `src/app/admin/blog/page.tsx` (list)
**Location**: `src/app/admin/blog/new/page.tsx` (create)
**Location**: `src/app/admin/blog/[id]/edit/page.tsx` (edit)

#### 3. Admin Category Page

**Location**: `src/app/admin/categories/page.tsx`

### Utility Components

#### 1. LoadingStates

**Location**: `src/components/admin/loading-states.tsx`
**Purpose**: Consistent loading skeletons
**HeroUI Components**: `Skeleton`, `Card`

#### 2. EmptyStates

**Location**: `src/components/admin/empty-states.tsx`
**Purpose**: Empty state illustrations and messages
**HeroUI Components**: `Card`, `Button`

#### 3. ConfirmationModal

**Location**: `src/components/admin/confirmation-modal.tsx`
**Purpose**: Reusable confirmation dialogs
**HeroUI Components**: `Modal`, `Button`

## Data Models

### Extended Blog Post Interface

```typescript
interface AdminBlogPost extends BlogPost {
  stats?: {
    views?: number;
    lastModified: Date;
  };
}
```

### Form Validation Schema

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

interface FormValidationSchema {
  [fieldName: string]: ValidationRule;
}
```

### API Response Types

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
```

## Error Handling

### Error Boundary Strategy

- **Global Error Boundary**: Catches unhandled errors in admin routes
- **Component-Level Error Handling**: Form validation, API call failures
- **User-Friendly Messages**: Clear, actionable error messages

### Error Types

```typescript
interface AdminError {
  type: "validation" | "api" | "network" | "permission";
  message: string;
  field?: string;
  code?: string;
}
```

### Error Display Components

- **Toast Notifications**: For success/error feedback using HeroUI Toast
- **Inline Validation**: Form field errors
- **Error Pages**: For critical failures

## Testing Strategy

### Unit Testing

- **Component Testing**: React Testing Library for all admin components
- **Form Validation**: Test all validation rules and error states
- **API Integration**: Mock API responses for different scenarios

### Integration Testing

- **User Workflows**: Complete CRUD operations
- **Navigation**: Route transitions and state persistence
- **Responsive Design**: Mobile and desktop layouts

### Test Files Structure

```
src/components/admin/__tests__/
├── admin-layout.test.tsx
├── admin-dashboard.test.tsx
├── admin-blog-list.test.tsx
├── admin-blog-form.test.tsx
└── admin-category-manager.test.tsx
```

### Testing Utilities

```typescript
// Test helpers for admin components
interface AdminTestUtils {
  renderWithAdminLayout: (component: React.ReactElement) => RenderResult;
  mockBlogPost: (overrides?: Partial<BlogPost>) => BlogPost;
  mockApiResponse: <T>(data: T) => Promise<T>;
}
```

## Performance Optimizations

### Code Splitting

- **Route-based splitting**: Each admin page loads independently
- **Component lazy loading**: Heavy components loaded on demand
- **HeroUI individual imports**: Only import used components

### Bundle Optimization

```typescript
// Individual HeroUI imports pattern
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

// Sidebar component imports
import { LayoutDashboard, FileText, Tags, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
```

### Data Fetching Strategy

- **Server Components**: Initial data fetching on server
- **Client-side updates**: Optimistic updates for better UX
- **Caching**: Leverage Next.js caching for API responses

## Accessibility Compliance

### WCAG 2.1 AA Standards

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Clear focus indicators

### Accessibility Features

- **Skip Links**: Navigation shortcuts
- **Live Regions**: Dynamic content announcements
- **Form Labels**: Proper form field associations
- **Error Announcements**: Screen reader error notifications

## Responsive Design

### Breakpoint Strategy

```css
/* Mobile First Approach */
@media (min-width: 640px) {
  /* sm */
}
@media (min-width: 768px) {
  /* md */
}
@media (min-width: 1024px) {
  /* lg */
}
@media (min-width: 1280px) {
  /* xl */
}
```

### Mobile Optimizations

- **Touch-friendly**: Minimum 44px touch targets
- **Drawer Navigation**: Collapsible sidebar on mobile
- **Responsive Tables**: Horizontal scroll or card layout
- **Form Optimization**: Single-column layout on mobile

## Security Considerations

### Input Validation

- **Client-side validation**: Immediate user feedback
- **Server-side validation**: Security and data integrity
- **XSS Prevention**: Proper content sanitization

### API Security

- **CSRF Protection**: Built-in Next.js CSRF protection
- **Input Sanitization**: Clean all user inputs
- **Rate Limiting**: Prevent abuse of admin endpoints

## Integration Points

### Existing API Endpoints

- **GET /api/blog**: List blog posts with filtering
- **POST /api/blog**: Create new blog post
- **PUT /api/blog/[id]**: Update existing blog post
- **DELETE /api/blog/[id]**: Delete blog post
- **GET /api/blog/categories**: List categories
- **POST /api/blog/categories**: Create category

### File Upload Integration

- **Image Upload**: Integrate with existing `/api/upload` endpoint
- **Cloudinary Integration**: Leverage existing image management
- **File Validation**: Size and type restrictions

### Navigation Integration

- **Main Navbar**: Add admin link for authorized users
- **Breadcrumbs**: Consistent navigation context
- **Deep Linking**: Shareable URLs for admin pages
