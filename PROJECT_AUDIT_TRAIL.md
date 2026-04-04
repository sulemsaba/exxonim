# Project Audit Trail

Date: 2026-04-04
Project: `exxonim`
Scope: verification audit of the frontend monorepo in `/home/msaba/Desktop/exxonim` and the sibling backend repo in `/home/msaba/Desktop/exxonim_backend`

## Context Used For This Audit

This audit uses the currently verified product direction:

- `apps/public` is the public website
- `apps/admin-next` is the intended future admin
- `apps/admin` is temporary legacy
- `material-kit-react` is temporary reference code
- the backend is a separate FastAPI repo at `/home/msaba/Desktop/exxonim_backend`
- the frontend default API base is `http://localhost:8000/api/v1`

This matters because the current project risks are no longer only inside the frontend repo.
They now sit across:

- frontend build health
- frontend/backend contract alignment
- deploy cutover correctness
- runtime resilience

## Audit Method

This review was done in three passes:

1. Repo structure, scripts, docs, and entrypoints in the frontend monorepo.
2. Frontend/backend contract review across shared routes, admin services, and FastAPI routers.
3. Verification checks of the current target surfaces.

## Verification Checks Run

- `npm run typecheck`
  - failed in `@exxonim/admin-next`
- `npm run build:admin`
  - failed in `@exxonim/admin-next`
- `PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache python3 -m compileall app`
  - passed in `exxonim_backend`

## What Improved Since The Previous Audit

Some things are better than the last audit pass:

- root `dev:admin`, `build:admin`, and `preview:admin` aliases now point to `apps/admin-next`
- the root README now explains the migration direction more honestly
- the backend repo location is confirmed instead of only inferred from docs
- the backend code compiles cleanly at the Python syntax/import level

These improvements matter, but they do not remove the current release blockers.

## Assessment Benchmark

The project is assessed against this benchmark.

### 1. Migration Clarity

The repo should make the migration path obvious:

- one target admin
- one legacy admin
- one temporary reference area
- one clear backend location

### 2. Build and Release Health

The current target admin should be buildable and type-safe:

- `npm run typecheck` passes
- `npm run build:admin` passes
- deploy assembly packages the intended admin

### 3. Frontend/Backend Contract Alignment

The contracts used by the frontend should match the FastAPI backend:

- route names match
- payload fields match
- auth/RBAC assumptions are real, not aspirational

### 4. Functional Completeness of `apps/admin-next`

The new admin should cover the intended business platform:

- dashboard
- consultations
- blog
- pages
- jobs/careers
- settings
- navigation
- pricing
- testimonials
- access/roles

### 5. Fallback and Resilience

The public site should remain usable when the API is slow, partially unavailable, or unavailable:

- critical shell should have graceful fallback
- non-API visual sections should not disappear unnecessarily
- slow connections should not create avoidable hard failures

### 6. Repo Hygiene

The repo should make it easy to know:

- what is production-bound
- what is migration-only
- what is dead template code
- what is deployed today versus planned later

## Executive Verdict

The project direction is clearer than before, but the product is still not release-ready.

The biggest problems are now concrete and verifiable:

- `apps/admin-next` does not currently pass typecheck or build
- the Access Roles screen is wired to backend endpoints that do not exist
- role-based restriction logic depends on fields the backend does not store or return
- `build:deploy` still assembles the legacy admin
- the public shell still fails too hard when API data is unavailable

Overall state:

- direction: clearer
- build health: broken on the target admin
- frontend/backend alignment: incomplete
- new admin progress: meaningful but still incomplete
- public resilience: weak
- cleanup urgency: still high

## Current Intended Architecture

The intended architecture now appears to be:

- frontend repo: `/home/msaba/Desktop/exxonim`
  - `apps/public`
  - `apps/admin-next`
  - `apps/admin`
  - `packages/shared`
  - `packages/admin-core`
  - `material-kit-react`
- backend repo: `/home/msaba/Desktop/exxonim_backend`
  - FastAPI app in `app/main.py`
  - routers in `app/routers/*`
  - SQLAlchemy models in `app/models/*`
  - schemas in `app/schemas/*`
  - Alembic migrations in `alembic/`

This is a reasonable split.

The current problems are not about the split itself.
They are about truthfulness, contract alignment, and release readiness inside that split.

## Scorecard

| Area | Score | Notes |
| --- | --- | --- |
| Migration clarity | 8/10 | The target admin is clearer, and the backend location is now verified. |
| Build and release health | 2/10 | `apps/admin-next` fails typecheck/build, and deploy still packages the legacy admin. |
| Frontend/backend contract alignment | 4/10 | Access and RBAC contracts are materially out of sync. |
| `apps/admin-next` completeness | 5/10 | Real product panels exist, but pages and access workflows are not fully real yet. |
| Fallback and resilience | 4/10 | Navigation, footer, and core pages still fail hard on API problems. |
| Repo hygiene | 5/10 | Some cleanup happened, but legacy deploy logic and migration residue remain. |

## Main Findings

### 1. The target admin currently fails the verification gates

This is the highest-severity issue.

Evidence:

- `npm run typecheck` fails in `@exxonim/admin-next`
- `npm run build:admin` fails in `@exxonim/admin-next`
- `apps/admin-next/package.json` declares React 18-compatible type packages
- `package-lock.json` still contains a nested `apps/admin-next/node_modules/@types/react` at `19.x`
- `apps/admin-next/tsconfig.json` writes incremental build info into `node_modules/.tmp`

Impact:

- the intended admin cannot be trusted as the default release target
- CI or local verification will fail unpredictably depending on install state
- the repo can say admin-next is the future, but it is not currently in a releasable state

Assessment:

- This is a release-blocking issue.

### 2. The Access Roles screen is wired to backend endpoints that do not exist

Evidence:

- `packages/shared/src/api/routes.ts` defines:
  - `/admin/users`
  - `/admin/users/:id`
  - `/admin/users/:id/role`
  - `/admin/users/:id/status`
  - `/admin/roles`
- `packages/admin-core/src/services/adminAccessRolesService.ts` calls those endpoints
- `apps/admin-next/src/sections/admin/view/admin-workspace-view.tsx` loads those services for the Access Roles panel
- the backend currently exposes `/admin/staff`, not the `/admin/users` and `/admin/roles` family

Impact:

- `/admin/access/roles/` is not actually backed by the current backend
- the screen is structurally present in the new admin, but it is contract-broken at runtime
- this makes the admin look more complete than it really is

Assessment:

- This is a high-severity frontend/backend contract failure.

### 3. Role-based restrictions are not backed by real backend user data

Evidence:

- shared frontend contracts expect `role`, `full_name`, and `last_login_at` on admin users
- the backend `AdminUser` model currently stores:
  - `id`
  - `email`
  - `hashed_password`
  - `is_active`
- the backend `AdminUserOut` schema does not expose a `role`
- `apps/admin-next/src/sections/admin/view/admin-workspace-view.tsx` falls back to `'admin'` when `admin.role` is missing

Impact:

- editor/author restrictions are not trustworthy in the current UI
- a missing role is effectively treated as full admin access in the frontend
- this is dangerous because it looks like RBAC exists while the data contract is incomplete

Assessment:

- This is a high-severity authorization UX issue.

### 4. Deploy assembly still packages the legacy admin

There is progress here, but the cutover is incomplete.

Evidence:

- root `dev:admin`, `build:admin`, and `preview:admin` now point to `apps/admin-next`
- `scripts/build-deploy.mjs` still builds `@exxonim/admin`
- the current deploy artifact still mounts the legacy admin under `/admin/`

Impact:

- local development now suggests `admin-next` is the default
- deployment still says otherwise
- this split is risky because contributors can reasonably assume the target admin is already the shipped admin

Assessment:

- This is still a high-severity release alignment issue.

### 5. `apps/admin-next` is real product work, but pages are not fully migrated yet

The good news:

- `apps/admin-next` is not just a shell
- it uses `@exxonim/admin-core`
- it covers real Exxonim workspaces such as:
  - blog
  - consultations
  - jobs/careers
  - settings
  - navigation
  - pricing
  - testimonials

The remaining gap:

- page create/edit routes are still pending
- some page routes show JSON payloads instead of real editors

Concrete evidence:

- `apps/admin-next/src/sections/admin/view/admin-workspace-view.tsx`
  - `New page editor pending.`
  - `Page editor pending.`

Assessment:

- `apps/admin-next` is a legitimate target, but not yet a complete replacement for the legacy admin.

### 6. Some admin-next copy still presents the product as a study or rewrite

Examples still present:

- `Material Kit powered study workspace`
- `Exxonim Admin Study`
- `Material Kit rewrite`

Impact:

- the new admin still feels transitional
- this confuses product maturity and polish
- it makes the migration feel less finished than it needs to

Assessment:

- This is a medium-severity completeness issue.

### 7. The public site is still too fragile at runtime when the API is unavailable

Evidence:

- `Navigation.tsx` returns an error state if navigation or key site settings fail
- `Footer.tsx` returns an error state if its site settings fail
- core pages like `HomePage.tsx`, `AboutPage.tsx`, `ServicesPage.tsx`, and others block on page record success instead of falling back to a minimum shell

Impact:

- API failure can collapse the site shell, not just the dynamic content
- low-connectivity users get hard failure states too quickly
- the public experience is still more brittle than a marketing site should be

Assessment:

- This remains a serious resilience issue.

### 8. The backend repo is real and syntactically healthy, but it still has some contract drift and dead code

Verified positive state:

- `exxonim_backend` exists as a separate repo
- `app/main.py` mounts `/api/v1`
- the mounted router set includes:
  - health
  - admin
  - blog
  - jobs
  - pages
  - navigation
  - pricing
  - testimonials
  - site settings
  - media
- Python compile verification passed

Remaining issue:

- `app/routers/home.py` exists, but it is not included in `app/routers/__init__.py`

Impact:

- backend structure is more real than it looked in the last audit
- but there is still some code-to-runtime drift that should be cleaned up

Assessment:

- This is a low-to-medium severity backend hygiene issue.

## Short Conclusion

The repo is now easier to understand than it was in the previous audit, but the next problems are more serious because they are not mostly documentation problems anymore.

The project now needs:

1. a working `admin-next` build
2. a real access/RBAC contract
3. a deploy cutover that matches the repo defaults
4. better public fallbacks for API failure

Until those are done, the migration is directionally correct but operationally incomplete.
