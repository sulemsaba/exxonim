# Exxonim Monorepo

Exxonim is a split-platform product with:

- a public website in `apps/public`
- the primary admin application in `apps/admin-next`
- a legacy admin in `apps/admin` that is being retired
- shared frontend packages in `packages/shared` and `packages/admin-core`
- a separate FastAPI backend in the sibling repo `../exxonim_backend`

This repository is local-first today. The public site, the new admin, and the backend integration are actively being completed and hardened before final server deployment.

## Core Project Documents

The main project documents are:

- `README.md`
- `PROJECT_ARCHITECTURE_DIAGRAM.md`

Useful supporting documents are also available:

- `DEPLOYMENT_HANDOFF.md`
- `docs/permission-matrix.md`
- `apps/admin/DEPRECATED.md`

Use them like this:

- `README.md`: quick orientation
- `PROJECT_ARCHITECTURE_DIAGRAM.md`: full architecture and planning reference
- `DEPLOYMENT_HANDOFF.md`: deployer checklist and server-facing handoff requirements
- `docs/permission-matrix.md`: standalone RBAC reference
- `apps/admin/DEPRECATED.md`: legacy-admin migration rule

## Current Product State

- `apps/public` is the customer-facing website.
- `apps/admin-next` is the primary admin surface and the only place new admin features should be built.
- `apps/admin` still exists for transition purposes, but it is deprecated for normal feature work.
- `material-kit-react` remains only as a temporary migration reference and should not be treated as the product app.

## Workspace Layout

```text
apps/
  public/
  admin-next/
  admin/          # deprecated legacy admin
packages/
  shared/
  admin-core/
scripts/
material-kit-react/  # temporary reference during migration
```

## Local Development

Install frontend dependencies at the repo root:

```bash
npm install
```

The repo includes non-Docker helper scripts for coordinated local startup:

- `./scripts/setup-db.sh`
- `./scripts/start-backend.sh`
- `./scripts/start-public.sh`
- `./scripts/start-admin.sh`
- `./scripts/dev.sh`
- `./scripts/create-superuser.sh`

Recommended local flow:

1. Ensure the sibling backend repo `../exxonim_backend` has its Python environment and `.env` configured.
2. Run `./scripts/setup-db.sh` if the local PostgreSQL cluster or DB user/database needs to be prepared.
3. Run `./scripts/dev.sh` to start the backend, public app, and admin app together.

If you need individual processes instead:

```bash
npm run dev:public
npm run dev:admin
npm run dev:admin-legacy
```

Current local URLs:

- Public site: `http://localhost:5173`
- Admin Next: `http://localhost:3039`
- Legacy Admin: `http://localhost:5174`
- Backend API: `http://localhost:8000`

## Build And Preview

Build the public site:

```bash
npm run build:public
```

Build the primary admin:

```bash
npm run build:admin
```

Build the deploy artifact:

```bash
npm run build:deploy
```

The deploy build now assembles:

- `apps/public` at `/`
- `apps/admin-next` at `/admin/`

Preview commands:

```bash
npm run preview:public
npm run preview:admin
npm run preview:admin-legacy
npm run preview:deploy
```

## Working Rules

- Build new admin features in `apps/admin-next`.
- Treat `apps/admin` as legacy and limit changes there to short-lived migration or critical fixes.
- Keep shared admin logic in `packages/admin-core`.
- Keep shared public/API contracts in `packages/shared`.
- Prefer meaningful, descriptive filenames and remove throwaway exports, temporary notes, and stray audit files instead of letting them accumulate.
- Keep durable project documentation in the core docs above rather than scattering product decisions across throwaway notes and one-off audits.

## API And Content Notes

The public site is API-backed. Its visible content comes from backend-managed domains such as:

- pages
- blog/resources
- navigation
- pricing
- testimonials
- site settings

The admin writes through backend routes under `/api/v1/admin/...`, and the public site reads from public API routes under `/api/v1/...`.

## Environment

At minimum, the frontend apps depend on:

- `VITE_API_URL`

The default API base used by shared frontend helpers is:

- `http://localhost:8000/api/v1`

For the full environment, RBAC, workflow, and deployment handoff details, use the architecture guide plus the supporting docs listed above.
