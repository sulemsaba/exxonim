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

# Content API Notes

- Homepage content comes from `/api/v1/pages/home`, not a dedicated `/api/home` endpoint.
- Public blog content comes from:
  - `/api/v1/blog/posts`
  - `/api/v1/blog/posts/:slug`
  - `/api/v1/blog/categories`
  - `/api/v1/blog/authors`
- The public `Resources` page keeps its hero/top-rail/grid layout in the frontend, but it relies on admin-controlled editorial fields:
  - `featured_slot`
  - `featured_on_home`
- If no explicit hero/top-rail posts are assigned, the public blog falls back to newest published posts so valid content is never hidden.
