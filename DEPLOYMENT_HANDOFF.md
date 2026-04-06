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
- `DOCUMENTS_ROOT`
- `VITE_API_URL`
- `VITE_ADMIN_CSRF_COOKIE_NAME`

## Required Application Commands

### Frontend monorepo

- install dependencies: `npm install`
- build deploy artifact: `npm run build:deploy`

### Backend

- run predeploy validation: `python -m app.cli.predeploy_check --strict`
- run migrations: `alembic upgrade head`
- seed roles and permissions: `python scripts/seed_roles_permissions.py`
- create first superuser: `python -m app.cli.superuser --email <email>`
- run overdue-notification scheduler task: `python scripts/emit_overdue_notifications.py`
- prune expired refresh sessions: `python scripts/prune_expired_refresh_sessions.py`
- run API: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Root helper scripts

The repo also provides local-first helper scripts:

- `./scripts/setup-db.sh`
- `./scripts/start-backend.sh`
- `./scripts/start-public.sh`
- `./scripts/start-admin.sh`
- `./scripts/dev.sh`
- `./scripts/create-superuser.sh`
- `./scripts/predeploy-check.sh`
- `./scripts/deploy-smoke-check.sh`

## Deployment Checklist

- PostgreSQL is available before the backend starts.
- Alembic migrations are applied.
- the predeploy validation command passes before boot
- roles and permissions are seeded
- the first superuser is created by CLI
- the deployed admin is `apps/admin-next`, not `apps/admin`
- the public site serves from `/`
- the admin serves from `/admin/`
- the API is reachable behind the chosen reverse proxy
- the overdue notification task is scheduled at the chosen cadence and is safe to rerun because overdue dedupe is per request/admin/day
- SSL is enabled before real external use
- database backups are planned before production use
- restore drills are practiced against staging or a local rehearsal environment
- the release checklist in `docs/release-checklist.md` is part of the handoff packet

## Smoke Test Checklist

After deployment, verify:

- the public homepage loads
- the admin login loads at `/admin/`
- `GET /health/live` returns `200`
- `GET /health/ready` returns `200`
- admin login works for the CLI-created superuser
- at least one protected admin write succeeds
- in-app notifications load in the admin bell and `/admin/notifications/`
- read-only reporting loads at `/admin/reports/`
- privacy requests load at `/admin/privacy-requests/`
- a new request submission emits `request.submitted`
- assigning a request emits `request.assigned` for the assignee
- a pending review submission emits `content.pending_review` for reviewers
- a governance change emits either `security.admin_role_changed` or `security.admin_status_changed`
- notification links land on the intended filtered screen, including `/admin/consultations/?search=...` and `/admin/access/roles/?search=...`
- the public shell still renders during temporary backend-content failure
- public policy pages load at `/privacy/`, `/cookies/`, and `/data-rights/`

## Notification Runbook

- Keep Group 5 notifications in-app only. Do not configure push, email, SMS, or other multi-channel delivery here.
- The scheduled operational task for this phase is `python scripts/emit_overdue_notifications.py`.
- Schedule it often enough for the team’s SLA expectations. Hourly is a reasonable starting point unless operations chooses a different cadence.
- The overdue emitter is designed to be rerun safely because the dedupe key is per request, recipient, and calendar day.
- The active event set for smoke verification is:
  - `request.submitted`
  - `request.inbound_message`
  - `request.assigned`
  - `request.overdue`
  - `content.pending_review`
  - `security.suspicious_login`
  - `security.admin_role_changed`
  - `security.admin_status_changed`
- `report.generated` remains reserved only

## Privacy and Retention Runbook

- Policy versions are tracked through the `policy_versions` site setting.
- Public policy pages should stay truthful to real browser and storage behavior.
- Consent logging is browser-scoped and stored in `privacy_consent_logs`.
- Privacy requests are handled internally through `/admin/privacy-requests/`.
- Refresh-session cleanup should be run regularly with `python scripts/prune_expired_refresh_sessions.py`.
- Reference `docs/data-retention-matrix.md` when discussing retention and cleanup behavior.

## Release and Rollback

- Standardize every release using `docs/release-checklist.md`.
- Use `./scripts/predeploy-check.sh` before deploy and `./scripts/deploy-smoke-check.sh` immediately after deploy.
- Frontend-only regressions should roll back by redeploying the previous frontend artifact.
- Risky backend releases should capture DB and media backups before changes are applied.
- Migration failures should follow the stated rollback stance for the release: restore-from-backup or forward-fix.

## Log Review Loop

Review these areas during releases and routine operations:

- auth failures
- 5xx errors
- overdue scheduler runs
- backup job results
- privacy-request backlog

## Not Covered Here

This document intentionally does not prescribe:

- exact package-install commands
- exact server folder layout
- exact `nginx` file paths
- exact `systemd` unit names
- one exact backup vendor or cron layout

Those details belong to the server operator.
