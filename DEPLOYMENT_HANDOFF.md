# Exxonim Deployment Handoff

This document is for the future deployer.

It complements `PROJECT_ARCHITECTURE_DIAGRAM.md` by giving a practical handoff checklist for a server operator without turning the architecture guide into a machine-specific runbook.

## Purpose

Use this file when preparing a real deployment environment for Exxonim.

Use `PROJECT_ARCHITECTURE_DIAGRAM.md` for the deeper explanation of:

- architecture
- runtime flow
- RBAC
- publishing workflow
- public-site resilience

## Recommended Deployment Target

| Area | Recommendation |
| --- | --- |
| Target OS | Ubuntu LTS preferred |
| Reverse proxy | `nginx` recommended |
| Backend process manager | `systemd` recommended |
| Database | PostgreSQL required |
| TLS | Domain plus SSL required |
| Frontend routing | Public site at `/`, admin-next at `/admin/` |
| Health checks | `/health/live` and `/health/ready` must be reachable |

## Required Inputs

The deployer should receive:

- the frontend repo path
- the backend repo path
- the final domain names
- the environment variable set
- the API routing expectation
- the database connection details
- the first-superuser creation procedure

## Core Environment Variables

These values should be defined for deployment:

- `DATABASE_URL`
- `ADMIN_API_KEY`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `REFRESH_TOKEN_EXPIRE_DAYS`
- `CORS_ORIGINS`
- `PUBLIC_SITE_URL`
- `VITE_API_URL`
- `VITE_ADMIN_API_KEY`

## Required Application Commands

### Frontend monorepo

- install dependencies: `npm install`
- build deploy artifact: `npm run build:deploy`

### Backend

- run migrations: `alembic upgrade head`
- seed roles and permissions: `python scripts/seed_roles_permissions.py`
- create first superuser: `python -m app.cli.superuser --email <email>`
- run API: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Root helper scripts

The repo also provides local-first helper scripts:

- `./scripts/setup-db.sh`
- `./scripts/start-backend.sh`
- `./scripts/start-public.sh`
- `./scripts/start-admin.sh`
- `./scripts/dev.sh`
- `./scripts/create-superuser.sh`

## Deployment Checklist

- PostgreSQL is available before the backend starts.
- Alembic migrations are applied.
- roles and permissions are seeded
- the first superuser is created by CLI
- the deployed admin is `apps/admin-next`, not `apps/admin`
- the public site serves from `/`
- the admin serves from `/admin/`
- the API is reachable behind the chosen reverse proxy
- SSL is enabled before real external use
- database backups are planned before production use

## Smoke Test Checklist

After deployment, verify:

- the public homepage loads
- the admin login loads at `/admin/`
- `GET /health/live` returns `200`
- `GET /health/ready` returns `200`
- admin login works for the CLI-created superuser
- at least one protected admin write succeeds
- the public shell still renders during temporary backend-content failure

## Not Covered Here

This document intentionally does not prescribe:

- exact package-install commands
- exact server folder layout
- exact `nginx` file paths
- exact `systemd` unit names
- one exact backup vendor or cron layout

Those details belong to the server operator.
