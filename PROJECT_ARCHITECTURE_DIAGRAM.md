# Exxonim Architecture, Runtime, and Deployment Guide

Date: 2026-04-05
Project: `exxonim`
State: verified against the frontend repo in `exxonim/`, the sibling backend repo in `../exxonim_backend/`, and the local runtime confirmed on April 4, 2026, with the documentation consolidated on April 5, 2026.

## Verified Runtime On 2026-04-04

The local stack was started again and the following runtime was confirmed:

- Public frontend: `http://127.0.0.1:5173`
- Admin frontend: `http://127.0.0.1:3039`
- Backend API: `http://127.0.0.1:8000`
- Local PostgreSQL: `127.0.0.1:5433`

The following API responses were also verified as working on this Linux machine:

- `GET /api/v1/pages/home`
- `GET /api/v1/site-settings/brand`
- `GET /api/v1/site-settings/footer`
- `GET /api/v1/site-settings/company_info`
- `GET /api/v1/navigation/`
- `GET /api/v1/blog/posts`

That matters because it proves the public site is not using hardcoded content only. It is actively reading content from the backend and the database-backed API.

## 1. Executive Summary

Plain summary in one paragraph:

This project is a content platform split into two major parts: a frontend monorepo and a separate backend API. The frontend monorepo contains the public website, the new admin panel, the legacy admin still being phased out, and shared frontend packages. The backend is a FastAPI application connected to PostgreSQL. The public site reads content from the API. The admin writes content to the API, and the backend persists that content in PostgreSQL. Local development works only when the database, backend, and frontend apps are all running. The frontend deploy assembly is now aligned to package `apps/admin-next`, but the rest of the roadmap should be read as local-first application work plus future deployment handoff requirements, not as a claim that this project is already being operated as a fully hardened production platform today.

## 2. Why This Architecture Exists

This architecture is trying to solve four different problems at once:

1. The public website needs marketing pages, SEO, and content updates.
2. The admin needs a protected workspace for editing content and managing operational data.
3. Shared frontend code should not be duplicated between the public and admin apps.
4. Data must live in a real database, not only in frontend files.

That is why the project is split the way it is.

### Why each main piece exists

| Piece | Why it exists |
| --- | --- |
| `apps/public` | Public marketing website for visitors. |
| `apps/admin-next` | Future admin panel for managing content and operations. |
| `apps/admin` | Legacy admin kept temporarily during migration. |
| `packages/shared` | Shared API routes, base URL logic, HTTP helpers, auth/session primitives, and shared contracts. |
| `packages/admin-core` | Shared admin-specific logic so the new admin is not full of duplicated service code. |
| `../exxonim_backend` | The actual API and persistence layer. This is where the database logic lives. |
| PostgreSQL | Durable storage for pages, blog posts, settings, navigation, jobs, testimonials, pricing, media, and admin-side data. |
| Alembic | Controlled database schema migration. |
| Public prerendering | Better SEO and faster first paint for public routes. |

### Why use a separate backend at all

Because the frontend should not be the system of record.

If content only lived in React files:

- non-developers could not manage it safely
- content changes would require rebuilds every time
- there would be no real admin workflow
- there would be no proper database-backed persistence

The backend makes content editable, queryable, and durable.

## 3. Whole System At A Glance

```mermaid
flowchart LR
    Visitor[Public Visitor]
    Staff[Admin User]

    PublicApp[apps/public]
    AdminNext[apps/admin-next]
    LegacyAdmin[apps/admin]

    Shared[packages/shared]
    AdminCore[packages/admin-core]

    API[FastAPI backend<br/>../exxonim_backend]
    DB[(PostgreSQL<br/>localhost:5433)]

    Visitor --> PublicApp
    Staff --> AdminNext
    Staff -. migration only .-> LegacyAdmin

    PublicApp --> Shared
    AdminNext --> Shared
    AdminNext --> AdminCore
    LegacyAdmin --> Shared
    LegacyAdmin --> AdminCore
    AdminCore --> Shared

    Shared --> API
    API --> DB
```

## 4. Repository Shape

```text
Desktop/
├── exxonim/
│   ├── apps/
│   │   ├── public/               # Public website
│   │   ├── admin-next/           # Intended future admin
│   │   └── admin/                # Legacy admin
│   ├── packages/
│   │   ├── shared/               # Shared API/routes/contracts/base URL/auth helpers
│   │   └── admin-core/           # Shared admin domain/services/routes
│   ├── material-kit-react/       # Temporary reference source during migration
│   ├── scripts/                  # Build/deploy helper scripts
│   └── PROJECT_ARCHITECTURE_DIAGRAM.md
└── exxonim_backend/
    ├── app/
    │   ├── core/
    │   ├── crud/
    │   ├── models/
    │   ├── routers/
    │   └── schemas/
    ├── alembic/
    ├── scripts/
    ├── .env
    └── requirements.txt
```

## 5. The Core Architectural Idea

The clean mental model is this:

- the browser never talks to PostgreSQL directly
- the browser talks to the backend API
- the backend API talks to PostgreSQL
- the admin is the write surface
- the public site is mostly the read surface

That one idea explains almost everything in the system.

## 6. What Happens During Local Development

Local development is not "start one thing and it works."

It is a chain:

1. Ensure PostgreSQL is available.
2. Apply migrations and seed foundational data.
3. Start the backend API.
4. Start the public frontend.
5. Start the admin frontend.
6. Open the apps in the browser.

If one link is missing, the chain weakens.

### Local boot sequence

```mermaid
flowchart TD
    A[Start PostgreSQL on 5433]
    B[Load backend env]
    C[Run Alembic migrations]
    D[Start FastAPI on 8000]
    E[Start public Vite app on 5173]
    F[Start admin-next Vite app on 3039]
    G[Open browser]

    A --> B --> C --> D
    D --> E
    D --> F
    E --> G
    F --> G
```

### Why this startup order matters

- PostgreSQL must exist first because the backend depends on it.
- Alembic must run before real API usage so the tables and schema match the code.
- The backend must run before the frontends can load live content correctly.
- The frontends can technically start before the backend, but the public site will show loading and error states instead of real content.

### Local scripts that now support this flow

The repo now has non-Docker helper scripts for the normal local workflow:

- `./scripts/setup-db.sh`
- `./scripts/start-backend.sh`
- `./scripts/start-public.sh`
- `./scripts/start-admin.sh`
- `./scripts/dev.sh`

These matter more than any one machine's `systemctl` command because they express the project-level startup contract instead of assuming one specific workstation setup.

## 7. The Public Read Path, Step By Step

Let us follow one normal public page request.

Imagine a visitor opens the homepage.

### Read flow diagram

```mermaid
sequenceDiagram
    participant User as Browser
    participant Public as apps/public
    participant Query as React Query hooks
    participant Shared as packages/shared
    participant API as FastAPI
    participant DB as PostgreSQL

    User->>Public: Open /
    Public->>Query: usePage("home")
    Query->>Shared: build API request
    Shared->>API: GET /api/v1/pages/home
    API->>DB: SELECT from pages
    DB-->>API: row data
    API-->>Shared: JSON response
    Shared-->>Query: parsed content
    Query-->>Public: page data
    Public-->>User: render homepage
```

### What code is involved in that path

At a high level:

- `apps/public/src/app/App.tsx` decides which route component to render.
- A page such as `HomePage` calls hooks like `usePage("home")`.
- The hook uses React Query.
- The service calls shared API routes from `packages/shared`.
- Axios sends the request to the backend.
- The backend router reads from PostgreSQL through SQLAlchemy.

### Why this design is useful

Because it separates concerns:

- routing and rendering stay in React
- request orchestration stays in hooks/services
- backend business logic stays in FastAPI
- persistence stays in PostgreSQL

That separation is what makes the system maintainable.

## 8. The Admin Write Path, Step By Step

This is the most important answer for the question "does this save to the DB?"

Yes. The admin save flows are designed to persist to PostgreSQL through backend write endpoints.

### Write flow diagram

```mermaid
sequenceDiagram
    participant Admin as Admin Browser
    participant Frontend as apps/admin-next
    participant Core as packages/admin-core
    participant API as FastAPI admin routes
    participant ORM as SQLAlchemy session
    participant DB as PostgreSQL

    Admin->>Frontend: Edit page or setting
    Frontend->>Core: prepare payload
    Core->>API: POST/PUT /api/v1/admin/...
    API->>ORM: add/update model
    ORM->>DB: INSERT/UPDATE
    DB-->>ORM: commit success
    ORM-->>API: refreshed record
    API-->>Frontend: saved JSON
    Frontend-->>Admin: updated UI
```

### Why I can say "yes, it saves"

Because the backend admin routes are doing real database work:

- admin page create/update endpoints add models and commit
- admin site-settings endpoints add models and commit
- admin navigation, pricing, testimonials, jobs, media, and blog endpoints also use create/update/delete flows backed by commits

The public site is not inventing this data locally. It reads database-backed API content that the admin is meant to manage.

## 9. What Data Lives In The Database

From the backend models and routes, the database is storing at least these domains:

- pages
- site settings
- navigation items
- blog posts
- blog categories
- blog authors
- career jobs
- pricing plans
- testimonials
- media
- admin users
- consultations and status history

### Public-site-critical data

The public website especially depends on these:

- `pages`
- `site_settings`
- `navigation_items`
- `blog_posts`
- `pricing_plans`
- `testimonials`
- `career_jobs`

That means the public site is not only decorative frontend code. It is strongly API-backed.

## 10. Why Your Data Did Not Follow You From Windows To Linux

This is the key operational answer.

### Short answer

Your code moved through Git.
Your database did not.

### Cross-device reality diagram

```mermaid
flowchart LR
    WCode[Windows repo]
    WDB[(Windows local PostgreSQL)]
    Git[Git / remote repo]
    LCode[Linux repo]
    LDB[(Linux local PostgreSQL)]

    WCode --> Git --> LCode
    WDB -. does not travel with git .-> Git
    Git -. does not recreate database rows .-> LDB
```

### What Git moves

- source code
- config files that are committed
- docs
- build scripts

### What Git does not move

- your local PostgreSQL data directory
- your actual database rows
- your local uploads folder contents unless explicitly committed
- machine-specific environment state

### What this project is doing on Linux right now

The backend on this Linux machine is configured to use a local PostgreSQL database via:

- `.env` in `../exxonim_backend`
- host `127.0.0.1`
- port `5433`
- database name `Exxonim`

Also, the local PostgreSQL helper script stores the database cluster under:

- `${HOME}/.local/share/exxonim-postgres/data`

That is a machine-local storage location. It is not part of your Git push.

### Important extra detail

The repo examples are now aligned around the local database name `Exxonim`, which removes one source of confusion.

But the deeper cross-device reality is still the same:

- each machine can have its own local `.env`
- each machine can have its own local PostgreSQL cluster
- Git still does not move database rows between them

So two different devices can still end up talking to different local databases even if the codebase looks the same.

### What the verified data suggests

The Linux machine returned public content records with timestamps like:

- `2026-04-04T07:11:33...`

That strongly suggests this Linux machine has its own locally seeded data set created on April 4, 2026, rather than a synchronized copy of the Windows database.

### Therefore, why "nothing was there" on Linux

The most likely reasons are:

1. Windows had a local database with your content.
2. You pushed the code only.
3. Linux cloned or pulled the code, but not the Windows database.
4. Linux either had an empty DB, a different DB name, or a newly seeded DB with different content.

That is expected behavior when using local databases on separate machines.

### How to avoid this in the future

You have three real options:

1. Use one shared remote database for both devices.
2. Export/import the PostgreSQL database when moving machines.
3. Treat local DBs as disposable and rely on seed scripts for demo data only.

If you want the exact same content on Windows and Linux, option 1 or 2 is required.

## 11. Public Website Failure Analysis

This is where I will be blunt.

The public site currently depends heavily on the backend for:

- page bodies
- navigation
- brand settings
- footer settings
- company info
- blog content
- pricing
- testimonials
- jobs

That means backend or database failure affects not just one optional widget, but the public shell itself.

### Current failure behavior

From the current code:

- route pages show a `LoadingSpinner` while waiting for page data
- route pages show `ErrorMessage` when data is unavailable
- `Navigation` returns `null` while loading, and an error block when its APIs fail
- `Footer` shows a loading spinner, then an error block if its APIs fail
- some sections such as pricing/testimonials and jobs fail independently inside otherwise working pages

### Current behavior diagram

```mermaid
flowchart TD
    A[Visitor opens public page]
    B[Frontend starts]
    C[Requests page + nav + settings + sections]
    D{Backend and DB available?}
    E[Render real content]
    F[Show page-level spinner or error]
    G[Navigation may disappear or error]
    H[Footer may spinner or error]

    A --> B --> C --> D
    D -- Yes --> E
    D -- No --> F
    D -- No --> G
    D -- No --> H
```

### My critical judgment

Is it best for the public page to hide everything if the backend or DB is down?

No. Not for a public-facing marketing site.

A public site should degrade gracefully, not collapse structurally.

If the backend is down, visitors should still ideally get:

- brand identity
- top navigation
- contact information
- the main value proposition
- at least a cached or static version of core public pages

Right now the system is too dependent on live API availability for the shell itself.

### What is good in the current approach

- errors are at least explicit instead of silent
- failures are localized in several places instead of causing a total React crash
- the user usually sees some feedback rather than a blank white screen

### What is not good

- navigation disappearing while loading is not ideal for orientation
- footer failure removes confidence signals on a public site
- core marketing copy depends on live API responses
- the public shell is not resilient enough for backend outages

### Recommended public-site resilience model

For a stronger public product, I would recommend:

1. Keep a static fallback shell inside the frontend repo.
2. Keep fallback brand settings, contact info, and navigation in the frontend.
3. Use live API data to enhance or replace that fallback when available.
4. Show a small degraded-mode banner when dynamic content is unavailable.
5. Let dynamic sections fail independently without removing the whole shell.

### Better outage strategy diagram

```mermaid
flowchart TD
    A[Visitor opens public page]
    B[Render static shell immediately]
    C[Try live API content]
    D{API available?}
    E[Hydrate with live content]
    F[Keep fallback shell]
    G[Show degraded-mode notice]
    H[Hide only failed dynamic modules]

    A --> B --> C --> D
    D -- Yes --> E
    D -- No --> F --> G --> H
```

That is the architecture I would trust more for production.

## 12. Loading-State Analysis

You also asked whether it is good to have more than one loading page.

The right answer is:

- yes, if each loading state has a different job
- no, if the user experiences loader-on-top-of-loader confusion

### What exists now

The public app currently has multiple layers of loading behavior:

1. `PageLoader`
   - global boot overlay in `App.tsx`
   - purely frontend-startup oriented
   - not directly tied to API readiness

2. `LoadingSpinner`
   - route-level and section-level data loading
   - used across many pages and components

3. Component-specific loading text
   - for example the jobs block in the career page

4. Local loading suppression logic
   - the spinner registry tries to prevent many concurrent spinners from all showing at once

### My judgment on the current design

It is a bit too fragmented.

The project does not have only "one loading page."
It has:

- a boot overlay
- route-level loading
- section-level loading
- some ad hoc inline loading

That is more than I would want on a polished public site.

### What would be better

I would simplify the model to two levels:

1. One boot-level loader for very first paint only.
2. One consistent section or route skeleton pattern for live data.

I would avoid:

- a global boot loader followed immediately by a second route spinner
- null navigation while waiting
- inconsistent mixes of spinners, text placeholders, and error cards

### Best-practice recommendation

For this project, the cleanest public UX would be:

- immediate shell render
- skeleton sections for content blocks
- persistent navigation and footer fallback
- small inline retry states for failed dynamic modules

That would feel more reliable and more professional.

## 13. Public SEO And Prerendering

The public site is not just a client-side toy app.

It also has a build-time prerendering layer.

### Why that exists

Because public marketing pages need:

- better SEO
- better share metadata
- better first load
- stable route HTML for crawlers

### How it works

The public app:

- builds a client bundle
- builds a server rendering entry
- prerenders routes into static HTML
- generates sitemap and robots files

### Prerendering flow

```mermaid
flowchart LR
    A[Build client bundle]
    B[Build server render entry]
    C[Resolve routes and SEO]
    D[Render HTML for routes]
    E[Write static files]
    F[Generate sitemap and robots]

    A --> B --> C --> D --> E --> F
```

### Important architectural consequence

Even the public build process depends on API-backed content for route SEO and page content decisions.

So this project is not purely static.
It is a database-backed public platform that also prerenders.

## 14. Deployment Alignment Update

This was one of the most important migration mismatches.

The root development aliases already pointed to `apps/admin-next`, and the deploy script has now been corrected to package `apps/admin-next` instead of the legacy admin.

### Historical mismatch diagram

```mermaid
flowchart LR
    RootBuild[Root build scripts]
    PublicBuild[Build apps/public]
    LegacyAdminBuild[Build apps/admin]
    Dist[dist/<br/>public at /<br/>legacy admin at /admin/]

    RootBuild --> PublicBuild
    RootBuild --> LegacyAdminBuild
    PublicBuild --> Dist
    LegacyAdminBuild --> Dist
```

### Correct deploy diagram

```mermaid
flowchart LR
    RootBuild[Root build scripts]
    PublicBuild[Build apps/public]
    NewAdminBuild[Build apps/admin-next]
    Dist[dist/<br/>public at /<br/>new admin at /admin/]

    RootBuild --> PublicBuild
    RootBuild --> NewAdminBuild
    PublicBuild --> Dist
    NewAdminBuild --> Dist
```

### Why this matters

This closes one real migration bug:

- developers build on `apps/admin-next`
- local development uses `apps/admin-next`
- deploy packaging now also uses `apps/admin-next`

That does not mean the full platform roadmap is complete. It only means the frontend deploy target is now aligned with the intended admin surface.

## 15. What "Launch" Means In This Project

There are really three meanings of launch here:

### 1. Local launch

Start the services on your machine so you can work.

That means:

- PostgreSQL
- backend
- public frontend
- admin frontend

### 2. Build launch

Generate production-ready frontend artifacts.

That means:

- build public app
- build admin app
- prerender public routes
- assemble deploy output

### 3. Real deployment launch

Serve the built public site and admin from a deployed environment backed by a persistent database.

That final step only becomes trustworthy when:

- the production database is stable
- the correct admin is deployed
- public fallback strategy is improved

## 16. The Best Practical Mental Model

If you remember only one diagram, remember this one:

```mermaid
flowchart LR
    AdminUser[Admin user edits content]
    AdminUI[Admin frontend]
    API[Backend API]
    DB[(PostgreSQL)]
    PublicUI[Public frontend]
    PublicVisitor[Public visitor]

    AdminUser --> AdminUI --> API --> DB
    DB --> API --> PublicUI --> PublicVisitor
```

That is the system.

The admin writes.
The database stores.
The public site reads.

## 17. Final Plain-English Takeaway

Here is the honest, plain-language conclusion.

- Yes, this project saves important content to PostgreSQL.
- No, pushing the repo from Windows to Linux does not move the database with it.
- Yes, this explains why code can appear on the second machine while the actual content does not.
- The current public site is visually strong, but architecturally too dependent on a live backend for basic shell content.
- It is acceptable to have more than one loading state, but the current public loading strategy is more fragmented than ideal.
- The frontend deploy packaging is now aligned to `apps/admin-next`, which removes one real migration mismatch.

If you want the system to feel production-strong, the next big improvements should be:

1. Move to a shared or exportable database workflow across devices.
2. Make the public shell resilient when the backend or DB is down.
3. Simplify loading states into a more intentional hierarchy.
4. Finish RBAC, publishing workflow, and audit foundations, then prepare a clean deployment handoff for the future Contabo deployer instead of treating production operations as "done now".

## 18. Realistic Action Plan For Current Stage

This section replaces the earlier "production now" tone with a more honest one.

Current operating reality:

- Exxonim is still being developed and verified locally first.
- Another person is expected to deploy it later to a Contabo server.
- Because of that, the plan should be split into:
  1. core app work
  2. public resilience work
  3. deployment handoff requirements
  4. post-launch hardening

This means the main document should describe what the application must become, while detailed server bootstrapping and operator-specific commands should be kept lighter here and moved into deployer-facing notes.

### Current status snapshot on 2026-04-05

| Item | Status in the current system |
| --- | --- |
| Deploy packages `apps/admin-next` | Done. The deploy assembly now packages `apps/admin-next`. |
| Health endpoints | Done in the backend. `/health/live` and `/health/ready` exist. |
| Temporary write protection before full RBAC | Done in the backend as a temporary guard. |
| RBAC foundations | Done foundationally in the backend and admin UI. Roles, permissions, protected routes, and permission-aware UI are in place. |
| Publishing workflow foundations | Done foundationally for pages, blog posts, and testimonials. More polish is still possible. |
| Basic audit logging | Done foundationally in the backend. Retention and archival are not yet the focus. |
| Legacy admin freeze | Partially done. Deprecation work started, but full removal is later. |
| Public fallback shell and graceful degradation | Partially done. Fallback shell and degraded-mode behavior exist; broader cached last-known-good coverage can still improve. |
| Non-Docker local startup scripts | Done. Root scripts now exist for DB setup, backend, public, admin, full dev startup, and superuser creation. |
| Detailed production operations | Not the current focus. This should now be treated as deployment handoff material for the future Contabo deployer. |

### What Stays In The Main Document

These items still matter now and should stay visible in the architecture plan:

- RBAC
  - keep roles, backend permission checks, role-aware UI, and basic user management
- Health endpoints
  - keep `/health/live` and `/health/ready`
- Legacy-admin cutover
  - keep the principle that legacy admin should stop growing and `admin-next` should become the only real admin surface
- Public-site resilience
  - keep the requirement that homepage, navigation, footer, and other shell-critical content must not collapse just because backend or DB is down
- Basic audit logging
  - keep who changed what, when, and which record was affected

### What Changes From The Earlier Draft

These items should be rewritten, not removed:

- Production deployment becomes deployment handoff requirements
  - the document should no longer sound like the current developer is personally operating the final production server today
- Audit-log archival automation moves to future hardening
  - basic audit logging matters now; retention automation is not a launch blocker while the project is still local-first
- Sentry and external uptime monitoring move to post-launch hardening
  - they remain good ideas, but they should not slow down application correctness
- Ubuntu + nginx + systemd remain recommended assumptions
  - but they should be presented as recommended handoff targets, not fixed commands that assume one exact server layout

### What Is Postponed For Now

These items should not dominate the main architecture document yet:

- detailed server bootstrap commands
- monthly or automated audit-log archival flows
- external uptime monitoring before the app is publicly reachable
- a full observability stack as a pre-launch blocker

### Priority Order

If priorities need to be stated plainly, the practical order should be:

1. application correctness
2. public resilience
3. deployment handoff readiness
4. post-launch hardening

## 19. Core App Work

This is the work that matters even before any Contabo deployment happens.

### Application correctness priorities

| Priority | Task | Why it stays important now |
| --- | --- | --- |
| 1 | Finalize roles and permission matrix | RBAC is an application design concern, not only a server concern. |
| 2 | Keep backend permission enforcement | Frontend hiding is only convenience; backend must decide access. |
| 3 | Keep first-superuser bootstrap path | A secure CLI bootstrap flow is required in local, staging, and production. |
| 4 | Keep basic audit logging | Multiple staff users require accountability even before production hardening. |
| 5 | Continue legacy-admin cutover | Two admins create confusion and split effort. |

### Recommended role model

- `superuser`: full platform access, including role and user management
- `administrator`: operational administration, settings, and publishing control
- `editor`: create and edit drafts, then submit for review
- `reviewer`: approve or reject submitted content
- `viewer`: read-only back-office access

If a dedicated `publisher` role is needed later, it can be added as a separate permission grouping, but it should not complicate the current stage unnecessarily.

### Core design principles that still apply

- Backend enforces every permission.
- Publishing workflow applies to public content.
- Audit logs are append-only and never user-editable.
- Fine-grained permissions should remain possible even if the first version is role-led.
- No Docker is required for the local development model.

## 20. Public Resilience Work

This remains one of the most important product concerns.

The public site should not become blank just because backend or DB is unavailable.

### Public resilience priorities

| Priority | Task | Intended result |
| --- | --- | --- |
| 1 | Keep fallback shell for homepage, nav, footer, and brand | Visitors always see a coherent public shell. |
| 2 | Add or improve cached last-known-good content | Previously successful content can still be shown during outages. |
| 3 | Keep graceful fallback for blog basics and core public pages | Public content should degrade, not disappear. |
| 4 | Keep health endpoints | Local testing and future deployment checks become easier immediately. |
| 5 | Keep cleaner loading hierarchy | Avoid loader-on-loader confusion and maintain shell stability. |

### Practical resilience direction

- render a shell immediately
- keep fallback navigation, footer, and company basics in the frontend
- hydrate with live API content when available
- preserve last-known-good content where practical
- let dynamic sections fail independently instead of collapsing the whole page

## 21. Deployment Handoff Requirements

This is the right framing for server work at the current stage.

It should not read as:

- "we are personally running the final production platform right now"

It should read as:

- "these are the requirements the future Contabo deployer should satisfy"

The standalone operational checklist also lives in `DEPLOYMENT_HANDOFF.md`.

### Recommended deployment target

| Area | Requirement |
| --- | --- |
| Target OS | Ubuntu LTS preferred |
| Reverse proxy | `nginx` recommended |
| Backend process manager | `systemd` recommended |
| Database | PostgreSQL required |
| TLS | Domain plus SSL required |
| Health checks | `/health/live` and `/health/ready` must be reachable |
| Frontend deploy target | Public site at `/`, `admin-next` at `/admin/` |
| Database migrations | Alembic upgrade required during deployment |
| Admin bootstrap | First superuser must be created by CLI, not public signup |
| Backups | Database backup strategy must exist before real production usage |

### Required environment inputs

The deployer should receive or define these values before deployment:

- `APP_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `REFRESH_TOKEN_EXPIRE_DAYS`
- `COOKIE_SECURE`
- `COOKIE_DOMAIN`
- `CORS_ORIGINS`
- `PUBLIC_SITE_URL`
- `ADMIN_SITE_URL`
- `MEDIA_ROOT`
- `VITE_API_URL`
- `VITE_ADMIN_CSRF_COOKIE_NAME`

For local-first root scripts, these values may also be relevant:

- `EXXONIM_BACKEND_DIR`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_ADMIN_USER`
- `POSTGRES_ADMIN_PASSWORD`
- `POSTGRES_APP_USER`
- `POSTGRES_APP_PASSWORD`
- `POSTGRES_DB_NAME`
- `PUBLIC_DEV_PORT`
- `ADMIN_DEV_PORT`
- `BACKEND_DEV_PORT`
- `BACKEND_HTTP_URL`

### Required application-level handoff items

The deployer should receive a short, practical checklist:

- environment variable list
- backend repo path and frontend repo path
- build commands
- backend run command
- migration command
- role/permission seed command
- first-superuser creation command
- health endpoints
- public URL, admin URL, and API routing expectations
- DB backup expectation

### Recommended handoff commands

These are application commands, not a full server runbook:

- full local dev startup: `./scripts/dev.sh`
- DB setup: `./scripts/setup-db.sh`
- backend only: `./scripts/start-backend.sh`
- public only: `./scripts/start-public.sh`
- admin only: `./scripts/start-admin.sh`
- first superuser: `./scripts/create-superuser.sh`
- deploy build artifact: `npm run build:deploy`

The future server operator may wrap these in `systemd`, `nginx`, or other hosting conventions, but those wrapper details should not dominate this architecture guide.

### Deployment smoke test checklist

After deployment, the deployer should verify:

- the public homepage loads from `/`
- the admin login loads from `/admin/`
- the backend responds normally
- `GET /health/live` returns `200`
- `GET /health/ready` returns `200`
- login works for the first CLI-created superuser
- at least one protected admin write succeeds for an authorized user
- the public shell still renders if dynamic backend content is temporarily unavailable

## 22. Post-Launch Hardening

These items are still valuable, but they should follow first real deployment rather than block it.

### Move these here instead of "must-have now"

- Sentry or similar error tracking
- external uptime monitoring such as UptimeRobot
- audit-log archival automation and long-term retention tooling
- deeper observability and structured monitoring stack
- full legacy-admin removal after stable cutover

### Audit-log retention stance at the current stage

The target can still be:

- keep audit logs for 1 year

But the implementation stance right now should be:

- keep audit logs in the database
- review volume later
- archive only when volume becomes a real operational issue

That makes retention a future hardening concern, not a blocker for current application correctness.

## 23. Detailed Permission Reference

This section mirrors the standalone permission reference in `docs/permission-matrix.md`.

It is the documentation-level reference for which roles are supposed to do what. The backend remains the real enforcement layer.

Legend:

- `✓` allowed
- `✗` not allowed

### Role principles

- `superuser` can do everything, including role and permission administration.
- `administrator` manages operations, settings, publishing, and normal admin governance.
- `editor` creates and updates draft content, then submits it for review.
- `reviewer` approves or rejects submitted public content.
- `viewer` has read-only back-office access where read access is granted.

### Permission matrix

| Permission Code | Module | Action | Superuser | Administrator | Editor | Reviewer | Viewer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dashboard.read` | Dashboard | View the admin dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| `page.read` | Pages | View page records in admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| `page.create` | Pages | Create a page draft | ✓ | ✓ | ✓ | ✗ | ✗ |
| `page.edit_own_draft` | Pages | Edit a draft page you created | ✓ | ✓ | ✓ | ✗ | ✗ |
| `page.edit_any_draft` | Pages | Edit any draft page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `page.submit_review` | Pages | Submit a page for review | ✓ | ✓ | ✓ | ✗ | ✗ |
| `page.approve` | Pages | Approve a page in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `page.reject` | Pages | Reject a page in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `page.publish` | Pages | Publish or unpublish a page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `page.archive` | Pages | Archive a page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `page.delete` | Pages | Delete a page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.read` | Blog posts | View blog post records in admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| `blog_post.create` | Blog posts | Create a blog post draft | ✓ | ✓ | ✓ | ✗ | ✗ |
| `blog_post.edit_own_draft` | Blog posts | Edit a draft blog post you created | ✓ | ✓ | ✓ | ✗ | ✗ |
| `blog_post.edit_any_draft` | Blog posts | Edit any draft blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.submit_review` | Blog posts | Submit a blog post for review | ✓ | ✓ | ✓ | ✗ | ✗ |
| `blog_post.approve` | Blog posts | Approve a blog post in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `blog_post.reject` | Blog posts | Reject a blog post in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `blog_post.publish` | Blog posts | Publish or unpublish a blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.archive` | Blog posts | Archive a blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.delete` | Blog posts | Delete a blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_category.read` | Blog categories | View blog categories | ✓ | ✓ | ✓ | ✓ | ✓ |
| `blog_category.manage` | Blog categories | Create, update, or delete categories | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_author.read` | Blog authors | View blog authors | ✓ | ✓ | ✓ | ✓ | ✓ |
| `blog_author.manage` | Blog authors | Create, update, or delete authors | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.read` | Testimonials | View testimonial records in admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| `testimonial.create` | Testimonials | Create a testimonial draft | ✓ | ✓ | ✓ | ✗ | ✗ |
| `testimonial.edit_own_draft` | Testimonials | Edit a draft testimonial you created | ✓ | ✓ | ✓ | ✗ | ✗ |
| `testimonial.edit_any_draft` | Testimonials | Edit any draft testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.submit_review` | Testimonials | Submit a testimonial for review | ✓ | ✓ | ✓ | ✗ | ✗ |
| `testimonial.approve` | Testimonials | Approve a testimonial in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `testimonial.reject` | Testimonials | Reject a testimonial in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `testimonial.publish` | Testimonials | Publish or unpublish a testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.archive` | Testimonials | Archive a testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.delete` | Testimonials | Delete a testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `media.read` | Media | View the media library | ✓ | ✓ | ✓ | ✓ | ✓ |
| `media.create` | Media | Upload or create media | ✓ | ✓ | ✓ | ✓ | ✗ |
| `media.update` | Media | Update media metadata | ✓ | ✓ | ✓ | ✓ | ✗ |
| `media.delete` | Media | Delete media | ✓ | ✓ | ✗ | ✗ | ✗ |
| `navigation.read` | Navigation | View navigation items | ✓ | ✓ | ✓ | ✓ | ✓ |
| `navigation.create` | Navigation | Create a navigation item | ✓ | ✓ | ✗ | ✗ | ✗ |
| `navigation.update` | Navigation | Update a navigation item | ✓ | ✓ | ✗ | ✗ | ✗ |
| `navigation.delete` | Navigation | Delete a navigation item | ✓ | ✓ | ✗ | ✗ | ✗ |
| `pricing.read` | Pricing | View pricing plans | ✓ | ✓ | ✓ | ✓ | ✓ |
| `pricing.create` | Pricing | Create a pricing plan | ✓ | ✓ | ✗ | ✗ | ✗ |
| `pricing.update` | Pricing | Update a pricing plan | ✓ | ✓ | ✗ | ✗ | ✗ |
| `pricing.delete` | Pricing | Delete a pricing plan | ✓ | ✓ | ✗ | ✗ | ✗ |
| `job.read` | Careers | View job openings | ✓ | ✓ | ✓ | ✓ | ✓ |
| `job.create` | Careers | Create a job opening | ✓ | ✓ | ✗ | ✗ | ✗ |
| `job.update` | Careers | Update a job opening | ✓ | ✓ | ✗ | ✗ | ✗ |
| `job.delete` | Careers | Delete a job opening | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.read` | Site settings | View site settings | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.create` | Site settings | Create a site setting | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.update` | Site settings | Update a site setting | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.delete` | Site settings | Delete a site setting | ✓ | ✓ | ✗ | ✗ | ✗ |
| `consultation.read` | Consultations | View consultation records | ✓ | ✓ | ✗ | ✗ | ✗ |
| `consultation.update` | Consultations | Update consultation status or assignee | ✓ | ✓ | ✗ | ✗ | ✗ |
| `user.read` | Users | View admin users | ✓ | ✓ | ✗ | ✗ | ✗ |
| `user.manage` | Users | Create, update, activate, or deactivate users | ✓ | ✓ | ✗ | ✗ | ✗ |
| `role.read` | Roles | View roles and role-permission mappings | ✓ | ✓ | ✗ | ✗ | ✗ |
| `role.manage` | Roles | Create roles and change role-permission mappings | ✓ | ✗ | ✗ | ✗ | ✗ |
| `audit_log.read` | Audit log | View append-only audit history | ✓ | ✓ | ✗ | ✗ | ✗ |

### Workflow notes

- Publishing workflow applies to `page`, `blog_post`, and `testimonial`.
- Public API routes should expose only `published` records.
- `edit_own_draft` applies only when the current user created the record and the record is still in an editable workflow state.
- `role.manage` stays restricted to `superuser` so the permission model remains tightly controlled.

## 24. Plain-English Operational Interpretation

If someone asks, "What should this document be used for now?" the honest answer is:

- use it to guide core application work
- use it to guide public-site resilience work
- use it to prepare a clean deployment handoff for the future Contabo deployer
- do not use it as proof that the current developer is already operating a fully hardened production platform today

That is the realistic and useful posture for Exxonim at this stage.

## 25. Requested Technical Evidence Appendix

This appendix answers a more technical due-diligence style request.

Every statement below is one of three things:

- directly measured on the local runtime on April 5, 2026
- directly inspected from the frontend repo and the sibling backend repo
- clearly marked as inference or not currently available

### 25.1 Availability Snapshot

| Requested item | Current answer |
| --- | --- |
| Public deployed URL | No public deployed URL is referenced in the checked-in repo materials. The only verified runtime URLs are local development URLs. |
| Public local URL | Canonical dev port is `5173`, but during this evidence pass Vite moved to `5174` because `5173` was already occupied locally. |
| Lighthouse report | Not currently available in the repo. No checked-in Lighthouse report was found, and the `lighthouse` CLI is not installed on this machine. |
| Bundle analyzer output | Not currently available. No analyzer plugin or checked-in analyzer report was found. |
| Full-page screenshots or screen recordings | Not currently available as checked-in project artifacts. |
| Reverse-proxy or `nginx` config | Not currently checked into this repo. The project contains deployment guidance, but not an actual `nginx` or proxy config file. |
| Explicit threat model document | Not currently found in the repo. |
| Checked-in ERD | Not currently found. An inferred ERD is included later in this appendix instead. |

### 25.2 Lighthouse, Public URL, and Frontend Runtime Evidence

Actual Lighthouse scores are not available today.

The honest reason is simple:

- no deployed public URL was found in the repo
- no checked-in Lighthouse JSON or HTML report was found
- the `lighthouse` CLI is not installed locally

What is available instead:

- local public runtime verified previously at `http://127.0.0.1:5173`
- local public runtime also observed at `http://127.0.0.1:5174` during this pass because Vite auto-shifted when `5173` was already in use

So the correct answer is:

- actual Lighthouse scores: not available yet
- deployed public URL: not available from the checked-in repo materials
- local development URL: available and verified

### 25.3 Measured Backend Response Times

These timings were measured locally on April 5, 2026 using one-shot `curl` requests against the running backend.

Important interpretation notes:

- these are local development measurements, not production measurements
- these are not load-test numbers
- they are still useful as a rough snapshot of relative endpoint cost

| Endpoint | Total time | Time to first byte | HTTP code | Notes |
| --- | --- | --- | --- | --- |
| `GET /api/v1/blog/posts` | `0.038599s` | `0.038458s` | `200` | Slowest sampled endpoint in this pass. |
| `GET /api/v1/site-settings/company_info` | `0.023614s` | `0.023466s` | `200` | Second-slowest sampled endpoint in this pass. |
| `GET /api/v1/testimonials/` | `0.018314s` | `0.018207s` | `200` | Moderate among the sampled public endpoints. |
| `GET /api/v1/navigation/` | `0.017906s` | `0.017773s` | `200` | Fast enough locally, but shell-critical. |
| `GET /api/v1/pages/home` | `0.014568s` | `0.014444s` | `200` | Homepage page-content lookup. |
| `GET /api/v1/pricing/plans` | `0.013568s` | `0.013326s` | `200` | Fast local response. |
| `GET /api/v1/site-settings/brand` | `0.013377s` | `0.013250s` | `200` | Fast local response. |
| `GET /api/v1/site-settings/footer` | `0.013261s` | `0.013166s` | `200` | Fast local response. |

Plain-English conclusion:

- the sampled endpoints are all locally fast
- among the endpoints tested, blog listing is the slowest one today
- the more important issue for the public experience is resilience and fallback behavior, not raw local endpoint latency

### 25.4 Security Header Snapshot

#### Public dev server header snapshot

Observed on the local public Vite server during this pass:

```text
HTTP/1.1 200 OK
Vary: Origin
Content-Type: text/html
Cache-Control: no-cache
Etag: W/"d70-iFLpem2E2/C7jfG9/1RsVJtpKFc"
Date: Sun, 05 Apr 2026 05:48:48 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

#### Backend header snapshot

Observed on `GET /health/live`:

```text
HTTP/1.1 200 OK
date: Sun, 05 Apr 2026 05:49:07 GMT
server: uvicorn
content-length: 18
content-type: application/json
```

#### Important nuance about health checks

`/health/live` is currently a `GET` endpoint.

That means:

- `GET /health/live` returns `200`
- `HEAD /health/live` returns `405 Method Not Allowed`

So any future uptime checker or proxy health probe should use `GET`, not `HEAD`, unless the route behavior is changed.

#### Security-header conclusion

From the local responses captured above, these common security headers were not observed:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

That does not automatically mean the future deployed site will lack them, because they may be added later at the reverse-proxy layer.

But the honest codebase-level conclusion right now is:

- they are not evidenced in the application responses captured during this pass
- there is no checked-in `nginx` or reverse-proxy config showing them either

### 25.5 Threat Model and the Meaning of "Cannot Be Reversed"

No explicit threat-model document was found in this repo.

So the best honest answer is an inferred one.

#### What the current codebase appears to defend against

The current application design clearly tries to address:

- accidental admin mistakes
- unauthorized admin actions
- role overreach between staff users
- opportunistic abuse of admin write endpoints
- content mistakes before publication

Evidence for that:

- JWT-based admin authentication
- backend-enforced RBAC permission checks
- temporary `X-API-Key` protection on admin write routes
- audit logging of important actions
- draft, review, publish workflow for public content

#### What the current codebase does not yet clearly evidence

The repo does not currently demonstrate a posture built around:

- nation-state adversaries
- advanced persistent attackers
- hardened reverse-proxy security policy
- WAF rules
- rate limiting
- immutable external audit storage
- cryptographic tamper-proof historical content records
- anti-reversing or code-obfuscation controls

So if someone asks for a realistic present-day threat model, the most honest answer is:

- the current system looks designed more for authenticated staff governance and normal web risk reduction than for high-end adversarial environments

#### What "cannot be reversed" could mean

That phrase can mean two very different things, and they should not be confused.

**Meaning 1: frontend code cannot be reverse-engineered**

That is not what this repo currently implements.

There is no evidence here of:

- code obfuscation
- anti-debugging measures
- special frontend hardening meant to prevent reverse engineering

The frontend is a normal Vite-built React application.

**Meaning 2: historical content changes cannot be secretly tampered with**

This repo partially addresses that, but not fully.

What exists now:

- audit log records
- workflow status tracking
- reviewer and publisher separation in the permission model

What does not yet exist:

- cryptographically signed history
- WORM storage
- external immutable log sink
- database-level immutability guarantees beyond application behavior

So the precise answer is:

- if "cannot be reversed" means frontend obfuscation, then no, that is not present
- if it means historical integrity and accountability, then the project has foundations for that, but not a fully tamper-proof design

### 25.6 Frontend Package, Build, and Deploy Surface

#### Package roles

| Package | Role in the system | Notable scripts or behavior |
| --- | --- | --- |
| Root `package.json` | Workspace orchestrator for the monorepo | Runs the public app, new admin, typechecks, and deploy assembly with `build:deploy`. |
| `apps/public/package.json` | Public marketing site | Vite dev on `5173`, client build, SSR build, and prerender step. |
| `apps/admin-next/package.json` | Main admin interface | Vite dev on `3039`, TypeScript build, ESLint, Prettier, and MUI-heavy admin app dependencies. |
| `packages/shared/package.json` | Shared low-level API helpers | Minimal shared dependency surface around `axios`. |
| `packages/admin-core/package.json` | Shared admin logic | Auth context, admin API client, routes, services, and admin UI helpers. |

#### Important repo-level observations

- the root monorepo uses `npm` workspaces
- `apps/admin-next` still declares `yarn@1.22.22` metadata in its own `package.json`
- practical repo orchestration is currently done from the root with `npm`, not with a repo-wide Yarn setup

#### Public build and prerender flow

The public app build is more than a plain SPA build.

It does all of the following:

- TypeScript project build
- client bundle build
- SSR bundle build from `src/app/entry-server.tsx`
- prerender pass through `apps/public/scripts/prerender.mjs`
- sitemap and `robots.txt` generation

#### Deploy assembly

The root deploy builder now does the correct thing:

- builds `@exxonim/public`
- builds `@exxonim/admin-next`
- copies public output into root `dist/`
- copies admin-next output into `dist/admin/`

That means the deploy artifact now aligns with the intended admin surface.

#### Reverse-proxy config status

No checked-in `nginx`, reverse-proxy, or systemd config was found in the repo.

What exists instead:

- deployment guidance
- handoff expectations
- build commands

What does not exist yet:

- a checked-in production proxy config
- a checked-in TLS/header policy
- a checked-in systemd service definition

### 25.7 Public App Entry, Routing, Shell, and Loading/Error Structure

#### Public entry and route structure

The public app entry is local and custom rather than framework-heavy.

Key points:

- `src/app/main.tsx` bootstraps hydration and initial rendering
- `src/app/App.tsx` is the main public shell and route switch
- the public app does not use React Router for its main page routing
- `src/app/usePublicRouter.ts` intercepts same-origin public links and keeps the shell mounted during internal navigation
- `src/app/entry-server.tsx` handles server-side rendering for prerender

#### Shell-critical components

The main persistent shell is built around:

- `Navigation`
- `Footer`
- `ShellStatusNotice`

That means the app is now trying to preserve orientation even when dynamic content is degraded.

#### Loading and error components

The current loading and error surface is split across these responsibilities:

- `PageLoader`
  - initial boot overlay
- `LoadBoundary`
  - route or section skeleton/error boundary
- `ErrorMessage`
  - generic fallback error presentation
- `ShellStatusNotice`
  - degraded-mode messaging for shell-level fallback use

This is important because the public-site loading model is no longer just "spinner everywhere."
It now tries to distinguish:

- shell availability
- page-content loading
- section-level degradation

### 25.8 React Query, API Client, Base URL Logic, Caching, and Retry

This is the area that needed the most precise wording.

#### Shared base URL and HTTP client behavior

The public and admin stacks both build on the shared API utilities.

Current shared behavior:

- base URL resolves from `VITE_API_URL`
- fallback base URL is `http://localhost:8000/api/v1`
- Axios client default timeout is `5000ms`

#### React Query defaults in the public app

The public query client currently sets:

- `staleTime = 5 minutes`
- `refetchOnWindowFocus = false`

There is no global `retry: false` at the query-client level.

That distinction matters.

#### What normal page and content queries do

Normal public queries such as:

- `usePage`
- `useBlogPosts`
- `useNavigation`

all do this pattern:

- read cached `initialData`
- then call service functions that use `fetchWithFallback`
- keep React Query's normal retry behavior because they do not override `retry`

That means:

- if local cached content exists, these queries can render immediately from last-known-good data
- if the network request fails, the service layer can still fall back to cached or default content
- but the query itself still behaves like a normal React Query query from a retry perspective

#### What shell-critical queries do differently

`usePublicShell` handles:

- navigation
- brand
- footer
- company info

Those queries explicitly set:

- `retry: false`

That means the shell-critical path is intentionally different from normal page queries.

The current design choice is:

- fail fast on shell fetches
- degrade immediately to cached or built-in fallback shell content
- avoid long retry-driven uncertainty for navigation and footer essentials

#### Cache storage model

The public cache helper stores content under the localStorage prefix:

- `exxonim-public-content`

The helper records:

- a cache key
- a cached timestamp
- the cached value

This is not a full stale-while-revalidate engine with cache expiry rules.
It is better described as:

- local last-known-good persistence with graceful fallback

### 25.9 Backend Main, Middleware, CORS, JWT, and Route Guards

#### FastAPI application surface

The backend `main.py` currently does these core things:

- creates the FastAPI app
- applies `CORSMiddleware`
- includes the main API router at `/api/v1`
- includes the top-level health router
- mounts `/uploads` as static files from the backend uploads directory

#### CORS

CORS is driven by an environment variable string and expanded into a list.

Current behavior from code:

- `allow_origins = settings.cors_origins`
- `allow_credentials = True`
- `allow_methods = ["*"]`
- `allow_headers = ["*"]`

This is flexible for local development, but it is not the same thing as a hardened production header policy.

#### Auth model

The current backend auth model is:

- JWT bearer auth for admins
- bcrypt password hashing through `passlib`
- access token and refresh token generation with `python-jose`
- stateless refresh tokens rather than a server-side session store

Default auth timings from env examples:

- access token expiry: `15` minutes
- refresh token expiry: `7` days

#### Guard chain for admin writes

The admin write path is currently protected by two layers:

1. authenticated admin identity
2. temporary `X-API-Key` write protection

Then the RBAC layer applies permission checks such as:

- `require_permission("page.read")`
- `require_permission("media.create")`
- route-local permission assertions for workflow and ownership-specific behavior

That means the backend is now the real authority for who may perform write actions.

### 25.10 One Real CRUD Module End to End: Pages

The pages module is a good end-to-end example because it connects:

- public reads
- admin writes
- workflow rules
- permission checks
- audit logging

#### Public read side

The public page flow is:

1. `usePage(slug)`
2. `pageService.getPageBySlug(slug)`
3. request to `GET /api/v1/pages/{slug}`
4. backend `crud/page.py`
5. database read from `pages`

Important public rule:

- public reads expose published content only
- the CRUD layer still contains compatibility logic for legacy `is_published` data

#### Admin write side

The admin side for pages includes:

- page listing
- create
- update
- delete
- submit for review
- approve
- reject
- publish
- archive

#### Data model fields that matter

The `Page` model now stores workflow-aware metadata including:

- `status`
- `created_by_id`
- `updated_by_id`
- `submitted_at`
- `submitted_by_id`
- `reviewed_at`
- `reviewed_by_id`
- `published_at`
- `published_by_id`

#### Permission model for pages

The permission model distinguishes between:

- read
- create
- edit own draft
- edit any draft
- submit for review
- approve
- reject
- publish
- archive
- delete

That separation is exactly why the permission matrix matters.

#### Workflow logic

The workflow layer enforces the legal state changes among:

- `draft`
- `pending_review`
- `published`
- `rejected`
- `archived`

So the system is no longer just "update a page row however you want."
It is moving toward explicit editorial governance.

### 25.11 Media Upload and Storage Path Logic

The media module currently uses local filesystem storage.

#### What happens on upload

When an admin uploads media:

- the request hits `POST /api/v1/admin/media/upload`
- only `image/*` uploads are accepted
- the file is stored under the backend `uploads/` directory
- the stored filename is a generated UUID plus the original file suffix
- a database record is created in the `media` table
- the returned URL is built from `request.base_url` plus `/uploads/<filename>`

#### Current storage shape

That means today the media system is:

- local filesystem-backed
- exposed directly by FastAPI static serving
- not using S3 or other object storage

#### Important deployment implication

Because media URLs are built from `request.base_url`, correct public media URLs in a reverse-proxy deployment will depend on proper forwarded host and scheme handling.

That is worth noting because no checked-in proxy configuration is currently present to prove that behavior end to end.

### 25.12 Environment Example Files

Only example files were inspected here, not real secrets.

#### Root `.env.example`

The root example defines the cross-repo local development contract, including:

- application environment mode
- backend directory location
- PostgreSQL host, port, users, password, and database name
- public, admin, and backend dev ports
- backend base URL, public site URL, and admin site URL
- `DATABASE_URL`
- JWT settings
- cookie settings
- CORS origins
- media storage root
- `VITE_API_URL`
- `VITE_ADMIN_CSRF_COOKIE_NAME`

#### `apps/admin-next/.env.example`

The admin-next example is intentionally small:

- `VITE_API_URL`
- `VITE_ADMIN_CSRF_COOKIE_NAME`

That fits the current architecture because the admin app mainly needs:

- API base URL
- CSRF cookie name for the cookie-based admin session model

#### Backend `.env.example`

The backend example defines:

- `APP_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- access and refresh token lifetimes
- cookie settings
- `CORS_ORIGINS`
- `PUBLIC_SITE_URL`
- `ADMIN_SITE_URL`
- `MEDIA_ROOT`

### 25.13 Requested Artifacts Not Currently Present

The following requested artifacts are not currently part of the checked-in project materials:

- Lighthouse report
- bundle analyzer output
- full-page screenshots
- screen recordings
- checked-in production `nginx` config
- checked-in proxy or CDN header policy
- formal threat-model document
- checked-in ERD file

That does not mean the project cannot produce them later.
It means they are not current source-of-truth artifacts in the repo today.

### 25.14 Current Database Schema and Inferred ERD

No standalone ERD file was found, but the backend models clearly imply this schema family:

- `admin_users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `audit_logs`
- `pages`
- `blog_posts`
- `blog_categories`
- `blog_authors`
- `testimonials`
- `navigation_items`
- `site_settings`
- `pricing_plans`
- `career_jobs`
- `consultations`
- `consultation_status_history`
- `media`

#### Inferred ERD

This diagram is inferred from the current SQLAlchemy models. It is useful for orientation, but it is not a separately maintained official ERD artifact.

```mermaid
erDiagram
    ADMIN_USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    ROLES ||--o{ ROLE_PERMISSIONS : grants
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : maps
    ADMIN_USERS ||--o{ AUDIT_LOGS : creates

    ADMIN_USERS ||--o{ PAGES : creates_or_updates
    ADMIN_USERS ||--o{ BLOG_POSTS : creates_or_updates
    ADMIN_USERS ||--o{ TESTIMONIALS : creates_or_updates

    BLOG_CATEGORIES ||--o{ BLOG_POSTS : classifies
    BLOG_AUTHORS ||--o{ BLOG_POSTS : authors

    ADMIN_USERS {
        int id
        string email
        string hashed_password
        bool is_active
    }

    ROLES {
        int id
        string code
        string name
    }

    PERMISSIONS {
        int id
        string code
        string module
        string action
    }

    AUDIT_LOGS {
        int id
        int actor_id
        string action
        string target_type
        string target_id
        jsonb old_value
        jsonb new_value
    }

    PAGES {
        int id
        string slug
        string title
        string status
        jsonb content
    }

    BLOG_POSTS {
        int id
        string slug
        string title
        string status
    }

    TESTIMONIALS {
        int id
        string client_name
        string status
    }
```

### 25.15 Deep Technical Takeaway

If these findings are summarized very plainly, the current technical position is:

- the application architecture is real and substantial, not a mock frontend
- the public site is API-backed but now has meaningful fallback foundations
- the admin system has real RBAC and workflow foundations rather than only visual hiding
- the deploy target is now aligned to `admin-next`
- the codebase still lacks some of the external artifacts that a later deployer, auditor, or buyer would eventually want

Those missing external artifacts are mostly in the category of:

- production hardening evidence
- deployment packaging evidence
- observability evidence
- formal documentation artifacts

That is consistent with the current stage of the project:

- locally verified
- architecturally serious
- not yet fully documented as a publicly operated hardened production platform
