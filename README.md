# Exxonim Monorepo

This repository is in an active admin migration.

Current product direction:

- `apps/public`: public website
- `apps/admin-next`: Material Kit based admin rewrite and intended future admin
- `apps/admin`: legacy admin kept temporarily during migration
- `packages/shared`: shared contracts, API helpers, auth/session primitives, utilities
- `packages/admin-core`: shared admin domain layer used by the new admin
- `material-kit-react`: temporary reference/template source; planned for removal after the new admin is complete

## Current Migration Status

The repo is not fully cut over yet.

Important reality today:

- the intended admin is `apps/admin-next`
- the legacy admin still exists in `apps/admin`
- some root scripts and deploy flow still target the legacy admin

This means the repository currently has both:

- target-state code
- transition-state code

If you are working on the future admin, use `apps/admin-next`.

## Workspace Layout

```text
apps/
  public/
  admin-next/
  admin/          # legacy, planned for removal
packages/
  shared/
  admin-core/
material-kit-react/  # temporary reference, planned for removal
scripts/
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

Run the future admin rewrite:

```bash
npm run dev:admin
```

Run the legacy admin only if you are working on the old surface during migration:

```bash
npm run dev:admin-legacy
```

You can still run the explicit new-admin alias if you want:

```bash
npm run dev:admin-next
```

Current development URLs:

- Public: `http://localhost:5173`
- Admin Next: `http://localhost:3039`
- Legacy Admin: `http://localhost:5174`

## Build Commands

Public app:

```bash
npm run build:public
```

Future admin rewrite:

```bash
npm run build:admin
```

Legacy admin:

```bash
npm run build:admin-legacy
```

Typecheck all workspaces:

```bash
npm run typecheck
```

## Deploy Status

The current deploy assembly script still packages the legacy admin.

Command:

```bash
npm run build:deploy
```

Current behavior:

- builds `apps/public`
- builds `apps/admin`
- assembles the root `dist/` artifact with the legacy admin mounted under `/admin/`

This is a transition-state behavior, not the intended final state.

Planned final state:

- `apps/public` served from `/`
- `apps/admin-next` served from `/admin/`
- `apps/admin` removed
- `material-kit-react` removed

## Preview

Preview the public production build:

```bash
npm run preview:public
```

Preview the legacy admin production build:

```bash
npm run preview:admin-legacy
```

Preview the future admin production build:

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

## Architecture Notes

### Public site

The public site is API-backed.

Main data sources include:

- pages
- blog/resources
- navigation
- pricing
- testimonials
- site settings

### Admin next

`apps/admin-next` is the intended admin platform and uses:

- `packages/admin-core` for shared admin routes, auth, services, and utilities
- `packages/shared` for shared contracts and API helpers

### Legacy admin

`apps/admin` is still present because the migration is not complete yet.

It should be treated as temporary.

### Template reference

`material-kit-react` is not the intended long-term product app.

It is kept temporarily as a migration/reference source and should be removed after the new admin no longer depends on it for comparison or extraction.

## Environment

Each app has its own env file pattern.

At minimum the frontend apps use:

- `VITE_API_URL`

Default API assumption in shared helpers:

- `http://localhost:8000/api/v1`

## Content API Notes

- Homepage content comes from `/api/v1/pages/home`
- Public blog/resources content comes from:
  - `/api/v1/blog/posts`
  - `/api/v1/blog/posts/:slug`
  - `/api/v1/blog/categories`
  - `/api/v1/blog/authors`
- Admin endpoints are under `/api/v1/admin/...`

## Project Documents

- `ADMIN_PANEL_FRONTEND_README.md`: original product blueprint
- `API_TRANSPARENCY.md`: backend/frontend API alignment reference
- `BLOG_SYSTEM_AUDIT.md`: blog-specific audit
- `PROJECT_AUDIT_TRAIL.md`: current repo audit
- `PROJECT_AUDIT_SOLUTIONS.md`: current solution plan based on the audit
- `PROJECT_ARCHITECTURE_DIAGRAM.md`: illustrated architecture and design map of the cleaned project state

## Recommended Working Rule

During migration:

- build new admin features in `apps/admin-next`
- avoid adding new product work to `apps/admin` unless it is a short-lived migration necessity
- keep shared admin logic in `packages/admin-core`
- remove template/legacy code once the replacement path is proven
