# SystemOS React Components

Portable React + TypeScript components extracted from `systemos_blog_manager_rewrite_v3.html`.

## Files

- `SystemOSAdmin.tsx`: Full admin shell with sidebar, topbar, blog manager, and analytics dashboard.
- `SystemOSBlogManager.tsx`: Blog management screen with filters, table/card views, inline actions, modal editor, and preview.
- `SystemOSAnalyticsDashboard.tsx`: Analytics dashboard with hero metrics, line chart, top/worst posts, SEO, audience, insights, and actions.
- `SystemOSWorkspace.css`: Shared styling for the full UI.
- `sampleData.ts`: Starter sample posts.
- `types.ts`: Shared TypeScript models.
- `utils.ts`: Shared analytics, filtering, formatting, and storage helpers.
- `index.ts`: Exports.

## Basic Usage

```tsx
import { SystemOSAdmin, systemOSSamplePosts } from './systemos-react';

export function AdminPage() {
  return (
    <SystemOSAdmin
      initialPosts={systemOSSamplePosts}
      persistToLocalStorage={false}
    />
  );
}
```

## Standalone Screens

```tsx
import { useState } from 'react';
import {
  SystemOSAnalyticsScreen,
  SystemOSBlogScreen,
  systemOSSamplePosts,
} from './systemos-react';

export function BlogPage() {
  const [posts, setPosts] = useState(systemOSSamplePosts);

  return <SystemOSBlogScreen posts={posts} onPostsChange={setPosts} theme="dark" />;
}

export function AnalyticsPage() {
  return <SystemOSAnalyticsScreen posts={systemOSSamplePosts} theme="dark" />;
}
```

## Production Integration Guide

### Files that need real API wiring

- `SystemOSAdmin.tsx`: In this demo it can persist posts and theme to `localStorage`. In the real project, keep the theme logic if you want, but replace post loading and post updates with your API or data-fetching layer.
- `SystemOSBlogManager.tsx`: This is the main CRUD screen. It expects a `posts` array and an `onPostsChange` handler. In production, those values should come from your backend data source, not from `sampleData.ts`.
- `SystemOSAnalyticsDashboard.tsx`: Right now the analytics cards and charts are derived locally from the post list through `utils.ts`. That is fine for previewing the UI, but real analytics should come from your analytics API, reporting tables, or tracking service.
- `sampleData.ts`: Demo-only seed data for local preview. This file should not be used as a source of truth in production.
- `utils.ts`: Contains preview analytics calculations, sorting, filtering, pagination, SEO estimation, and helper formatting. The UI helpers can stay, but the analytics math is mock logic unless you intentionally want client-side derived estimates.

### Files that are mostly safe to keep as-is

- `SystemOSWorkspace.css`: Shared styling only.
- `types.ts`: Shared model definitions. You may extend these to match your real backend response shape.
- `SystemOSFrame.tsx`, `SystemOSBlogScreen.tsx`, `SystemOSAnalyticsScreen.tsx`, `index.ts`: Composition and exports only.

### Data that should come from the database

- Blog post records:
  `id`, `title`, `slug`, `category`, `author`, `status`, `updated`, `scheduledFor`, `publishedAt`, `readTime`, `views`, `excerpt`, `cover`, `body`, `note`, `metaTitle`, `metaDescription`, `seo`
- Recommended constraints:
  `slug` should be unique, `id` should be stable, and date values should be returned as ISO strings.
- Internal-only field:
  `note` is written as an internal editorial note and usually should not be exposed on the public blog.

### Data that should ideally come from analytics or reporting APIs

- Views over time
- Unique visitors
- Bounce rate
- Average read time
- Scroll depth
- Completion rate
- New vs returning visitors
- Device split
- Country split
- Trending vs dropping post signals

### Important implementation notes

- The current analytics screen is visually accurate, but the numbers are simulated from post data. Replace those calculations if you want trustworthy business reporting.
- The `seo` field can be stored in the database, but you may also prefer to compute it on the backend when a post is saved or published.
- The `views` field in the current demo is used for display and mock analytics. In production, views are usually tracked separately from the core posts table.
- If your API already has separate author and category tables, map them into the current string fields or update the types/components to use richer objects.
- The modal editor currently saves the entire post object at once. If your backend uses partial updates, wrap `onPostsChange` with mutation logic and refetch or optimistically update the local list.
- If you use server-side rendering, keep the `localStorage` behavior disabled by passing `persistToLocalStorage={false}`.

### Suggested backend endpoints

- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PATCH /posts/:id`
- `DELETE /posts/:id` or a soft-delete/archive endpoint
- `GET /analytics/overview`
- `GET /analytics/traffic?range=7|30|90`
- `GET /analytics/top-posts?range=7|30|90`
- `GET /analytics/seo`
- `GET /analytics/audience?range=7|30|90`

## Notes

- The CSS is scoped under the `.systemos-admin` root so it can live inside a larger app without taking over the full page.
- The full shell imports `SystemOSWorkspace.css` directly.
- `SystemOSFrame`, `SystemOSBlogScreen`, and `SystemOSAnalyticsScreen` also import the shared CSS, so they are the easiest drop-in entry points if you do not want the full shell.
- If you mount `SystemOSBlogManager` or `SystemOSAnalyticsDashboard` directly, wrap them in a `.systemos-admin` container or use `SystemOSFrame`.
- Analytics actions are wired to the blog manager screen, so `Optimize low SEO posts`, `View trending posts`, and `Create similar post` all route into usable flows.
- Local storage persistence is optional through `persistToLocalStorage`.
