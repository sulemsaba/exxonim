# Project Audit Solutions

Date: 2026-04-04
Project: `exxonim`
Companion to: `PROJECT_AUDIT_TRAIL.md`

## Purpose

This file is the solution companion to the audit.

The audit states what is wrong.
This file states what to do next, in what order, and why.

## Primary Goal

Move the project from:

- target admin fails typecheck/build
- access and RBAC contracts are out of sync
- deploy still ships the legacy admin
- public shell is too API-fragile
- migration residue is still visible

To:

- `apps/admin-next` passes verification and is releasable
- frontend and backend agree on access and admin user contracts
- deploy packages `apps/admin-next` under `/admin/`
- the public site keeps a minimum usable shell during API trouble
- legacy and template surfaces can be removed safely

## Solution Principles

### 1. Restore a working baseline before promising cutover

Do not treat `apps/admin-next` as the shipped admin until:

- it passes typecheck
- it passes build
- it can survive normal dependency installation

### 2. Make access control contract-first, not UI-first

Do not leave a screen in place that implies backend support when the backend route family does not exist.

Pick one contract and make every layer follow it:

- shared routes
- admin services
- backend routers
- backend user schema
- frontend restrictions

### 3. Separate deploy cutover from developer naming

It is fine for `dev:admin` and `build:admin` to target `admin-next`.

It is not fine for the deploy artifact to keep shipping the legacy admin after those aliases change.

### 4. Separate runtime fallback from source of truth

The API should remain the source of truth.

But the public site still needs:

- bundled minimum shell data
- stale-cache fallback
- softer failure states for non-critical sections

### 5. Delete only after replacement exists

Remove legacy and template surfaces only when:

- replacement flows are real
- deploy no longer depends on them
- contributors will not need them to complete missing workflows

## Recommended Implementation Order

## Phase 1: Restore `apps/admin-next` Build Health

### Goal

Get the target admin back to a clean, repeatable verification state.

### Actions

1. Standardize package-manager ownership for `apps/admin-next`.

Recommended end state:

- the repo root `package-lock.json` and root npm workspace install are the source of truth
- `apps/admin-next` does not keep a drifted local `node_modules` tree

2. Remove nested React type drift inside `apps/admin-next`.

Current problem:

- the workspace declares React 18-compatible type versions
- the lock/install state currently includes nested React 19 type packages under `apps/admin-next/node_modules`

3. Move TypeScript incremental output out of `node_modules`.

Current problem:

- `apps/admin-next/tsconfig.json` writes `tsBuildInfoFile` into `node_modules/.tmp`

Recommended end state:

- use a writable cache path such as:
  - `./.cache/tsconfig.app.tsbuildinfo`
  - or another repo-owned cache directory outside `node_modules`

4. Re-run the release gates:

- `npm run typecheck`
- `npm run build:admin`

### Primary Files

- `apps/admin-next/package.json`
- `apps/admin-next/tsconfig.json`
- `package-lock.json`

### Why First

Because the rest of the migration plan is not trustworthy until the intended admin builds successfully.

## Phase 2: Align Admin Access and RBAC Contracts

### Goal

Make the Access Roles area either fully real or intentionally absent until the backend is ready.

### Recommended End State

- backend exposes one consistent access API family
- shared frontend routes match that API family
- login and `me` payloads include a real role
- missing role is never treated as full admin by default

### Actions

1. Choose the short-term contract path.

Recommended path:

- add backend support for:
  - `/admin/users`
  - `/admin/users/{id}`
  - `/admin/users/{id}/role`
  - `/admin/users/{id}/status`
  - `/admin/roles`

Temporary fallback path if backend work must wait:

- point the frontend to `/admin/staff`
- hide role-management controls
- remove the impression that full user management exists today

2. Align the admin user payload shape.

Current mismatch:

- frontend contracts expect `role`, `full_name`, and `last_login_at`
- backend model/schema do not currently store or return those fields

Recommended direction:

- add the missing fields if real RBAC and user management are product requirements
- otherwise trim the frontend contracts and UI to the actual backend shape

3. Remove the unsafe frontend fallback.

Current problem:

- missing role falls back to `'admin'`

Recommended end state:

- missing role becomes `unknown`, `limited`, or another explicitly restricted state

4. Verify the whole flow end-to-end.

Verification checklist:

- login response returns the expected admin fields
- `/admin/access/roles/` loads without `404`
- editor and author accounts actually see restricted screens

### Primary Files

- `packages/shared/src/api/routes.ts`
- `packages/admin-core/src/services/adminAccessRolesService.ts`
- `apps/admin-next/src/sections/admin/view/admin-workspace-view.tsx`
- `/home/msaba/Desktop/exxonim_backend/app/models/admin_user.py`
- `/home/msaba/Desktop/exxonim_backend/app/schemas/admin.py`
- `/home/msaba/Desktop/exxonim_backend/app/routers/admin.py`

### Why Second

Because the current UI presents an access model that the backend does not yet support.

## Phase 3: Finish The Remaining `apps/admin-next` Parity Gaps

### Goal

Remove the remaining prototype feel from the new admin.

### Actions

1. Replace pending page create/edit states with real editors.

Current gap:

- page create/edit routes are mapped
- page routes still show notices or raw payload JSON

2. Replace migration wording in user-facing admin copy.

Current examples:

- `study workspace`
- `Material Kit rewrite`

3. Remove or implement placeholder UI.

Concrete candidates:

- `apps/admin-next/src/layouts/components/searchbar.tsx`
- any remaining unused template-driven surfaces that survived cleanup

### Primary Files

- `apps/admin-next/src/sections/admin/view/admin-workspace-view.tsx`
- `apps/admin-next/src/pages/admin.tsx`
- `apps/admin-next/src/pages/sign-in.tsx`
- `apps/admin-next/src/sections/auth/sign-in-view.tsx`

### Why Third

Because the new admin should stop looking transitional before it becomes the actual shipped admin.

## Phase 4: Correct The Release Path

### Goal

Make deployment behavior match the repo defaults.

### Actions

1. Switch `scripts/build-deploy.mjs` to package `apps/admin-next` after Phase 1 is green.

2. Keep explicit legacy aliases while `apps/admin` still exists.

Recommended temporary state:

- `dev:admin` -> `admin-next`
- `build:admin` -> `admin-next`
- `preview:admin` -> `admin-next`
- `dev:admin-legacy` -> legacy admin
- `build:admin-legacy` -> legacy admin

3. Add a small release checklist near deploy docs.

Minimum checks:

- `npm run build:admin`
- `npm run build:deploy`
- confirm `/admin/` artifact comes from `apps/admin-next`

### Primary Files

- `scripts/build-deploy.mjs`
- `package.json`
- `README.md`

### Why Fourth

Because the repo should not advertise one target while shipping another.

## Phase 5: Add Public Runtime Fallbacks

### Goal

Keep the public shell usable when the API is slow or unavailable.

## Recommended Fallback Model

Use a three-level strategy:

1. live API data
2. last known cached data
3. bundled minimum fallback content

## What Should Have Bundled Minimum Fallback

These are important enough to justify local fallback content:

- brand/logo references
- company name and primary phone
- primary navigation
- footer links and CTA
- minimum shell copy for:
  - home
  - about
  - services
  - contact

## What Can Stay More API-Dependent

These can degrade more softly:

- blog freshness
- article detail freshness
- jobs freshness
- testimonials freshness
- admin analytics

## Suggested Structure

```text
apps/public/src/fallback/
  brand.ts
  company.ts
  navigation.ts
  footer.ts
  pages/
    home.ts
    about.ts
    services.ts
    contact.ts
```

## Priority Components To Refactor

- `apps/public/src/components/Navigation.tsx`
- `apps/public/src/components/Footer.tsx`
- `apps/public/src/pages/HomePage.tsx`
- `apps/public/src/pages/AboutPage.tsx`
- `apps/public/src/pages/ServicesPage.tsx`
- `apps/public/src/pages/ContactPage.tsx`

### Why Fifth

Because this is where real users feel API instability most directly.

## Phase 6: Improve Weak-Internet and Runtime Behavior

### Goal

Reduce avoidable failure on slow or unstable networks.

### Actions

1. Tune API timeout policy.

Suggested direction:

- public GETs: `10_000` to `15_000ms`
- admin: `8_000` to `12_000ms` depending on endpoint class

2. Add retry and backoff for safe public GET requests.

3. Debounce request-driven admin search.

Concrete candidate:

- `apps/admin-next/src/sections/admin/view/admin-consultation-panels.tsx`

4. Persist a small critical public cache.

Good candidates:

- navigation
- footer
- brand settings
- company info

5. Simplify decorative effects more aggressively for reduced-motion or slower-device scenarios.

### Why Sixth

Because performance and resilience improvements are most valuable after the core build and contract problems are fixed.

## Phase 7: Retire Dead Surfaces

### Goal

Finish the cleanup only after the replacement path is real.

### Actions

1. Remove `apps/admin` after:

- admin-next covers required workflows
- deploy packages admin-next
- the team no longer depends on legacy screens

2. Remove `material-kit-react` after it is no longer used as a migration reference.

3. Remove or intentionally mount backend code that is currently dead.

Current candidate:

- `/home/msaba/Desktop/exxonim_backend/app/routers/home.py`

### Why Last

Because cleanup should reduce confusion, not remove the last working path before parity exists.

## Exit Criteria

Treat the migration as operationally healthy only when all of these are true:

- `npm run typecheck` passes
- `npm run build:admin` passes
- `/admin/access/roles/` loads without backend route errors
- login and `me` return the role data the frontend actually relies on
- role-restricted screens behave correctly for non-admin accounts
- `npm run build:deploy` packages `apps/admin-next` under `/admin/`
- the public navigation and footer remain usable during API failure
