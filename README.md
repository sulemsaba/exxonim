# Exxonim Monorepo

Exxonim now uses a workspace split with two frontend apps and one shared package:

- `apps/public`: public website with Vite client build, SSR entry, and prerender output
- `apps/admin`: admin panel served from `/admin/`
- `packages/shared`: shared API contracts, low-level HTTP helpers, auth session primitives, and generic utilities

The public site and admin panel still target the same backend API. Content remains API-backed; the old static content files are no longer part of the architecture.

Additional scope documentation:

- `ADMIN_PANEL_FRONTEND_README.md`: admin panel modules, public frontend capabilities, and recommended UI expansion areas

## Workspace Layout

```text
apps/
  public/
  admin/
packages/
  shared/
scripts/
  build-deploy.mjs
  preview-deploy.mjs
```

## Local Development

Install dependencies once at the repo root:

```bash
npm install
```

Run the public site:

```bash
npm run dev:public
```

Run the admin app:

```bash
npm run dev:admin
```

Expected development URLs:

- Public: `http://localhost:5173`
- Admin: `http://localhost:5174`

Each app has its own env example:

- `apps/public/.env.example`
- `apps/admin/.env.example`

Both define `VITE_API_URL`.

## Quality Checks

Typecheck every workspace:

```bash
npm run typecheck
```

Build the public app:

```bash
npm run build:public
```

Build the admin app:

```bash
npm run build:admin
```

Assemble the production deploy artifact:

```bash
npm run build:deploy
```

This produces a root `dist/` directory where:

- the public app is served from `/`
- the admin app is mounted under `/admin/`

## Preview

Preview the public production build:

```bash
npm run preview:public
```

Preview the admin production build:

```bash
npm run preview:admin
```

Preview the assembled deploy artifact:

```bash
npm run preview:deploy
```

## Public Routes

- `/`
- `/about/`
- `/services/`
- `/request-consultation/`
- `/track-consultation/`
- `/resources/`
- `/resources/:slug/`
- `/faq/`
- `/career/`
- `/contact/`
- `/support/`
- `/terms/`
- `/privacy/`

## Deployment Notes

- Deploy the generated root `dist/` directory.
- The admin build uses `base: '/admin/'`, so admin assets resolve under `/admin/assets/...`.
- The public build still generates `404.html`, `sitemap.xml`, and `robots.txt`.
- If the backend runs cross-origin in development, allow both `http://localhost:5173` and `http://localhost:5174` in CORS.

# Deployment Checklist

Before deploying the homepage system, ensure the following:

1. **API Contract Verification**:
   - Confirm `/api/home` returns the correct structure as defined in `HomeApiResponse`.

2. **Fallback Validation**:
   - Ensure the fallback component matches the API shape and includes critical content (hero, contact, services).

3. **Cache Invalidation**:
   - Verify that the cache clears when the version changes.

4. **Timeouts**:
   - Ensure frontend timeouts trigger correctly (e.g., 2s loading cap).

5. **Global Fallback**:
   - Confirm the global fallback renders when all sections fail.

6. **Logs**:
   - Check that logs are not spamming during retries or errors.

7. **Feature Flags**:
   - Verify feature flag toggles work as expected.

8. **Performance**:
   - Ensure backend response time is within the acceptable range (<500ms ideal, <1s acceptable).

9. **Retry Policy**:
   - Confirm retry logic adheres to the defined limits (1 retry, total wait <6s).

10. **Critical Content Guarantee**:
    - Ensure the fallback always includes hero, contact method, and core services.

### Blogs on Homepage

To allow blogs to be visible on the homepage, the following components have been implemented:

#### Components Created

1. **[BlogsSection Component](nim/apps/public/src/components/BlogsSection.tsx)**:
   - Renders blog posts from the unified API response.
   - Displays posts in a responsive grid layout.
   - Includes title, excerpt, publication date, and "Read More" links.
   - Gracefully handles empty blog arrays.

2. **[Blogs Stylesheet](nim/apps/public/src/styles/blogs.css)**:
   - Provides responsive styling for the blogs section.
   - Includes hover effects, proper spacing, and mobile breakpoints.
   - Ensures visual consistency with the rest of the homepage.

3. **[Enhanced HomePage](nim/apps/public/src/pages/HomePageEnhanced.tsx)**:
   - Uses the unified `useHomeData` hook to fetch all homepage data.
   - Falls back to original page data if the new API is unavailable.
   - Renders the `BlogsSection` with data from `/api/home`.
   - Implements deterministic failure conditions.

#### Integration Steps

1. **Backend**:
   - The `/api/home` endpoint already includes a `blogPosts` array in the response.
   - Each blog post has `id`, `title`, `excerpt`, and `publishedAt` fields.

2. **Frontend**:
   - Import and use `BlogsSection` component with `blogPosts` from the API.
   - Import the stylesheet: `import '../styles/blogs.css'`.
   - The `useHomeData` hook handles caching and version-based invalidation.

3. **Fallback Handling**:
   - `BlogsSection` automatically returns `null` if the array is empty.
   - The enhanced HomePage gracefully degrades to the original structure.

4. **Testing**:
   - Verify that blogs render correctly when `/api/home` returns data.
   - Ensure empty blog arrays don't break the layout.
   - Test responsiveness on mobile and tablet viewports.
