# Exxonim Release Checklist

Use this checklist for every staging or production release.

## Before Deploy

- Run `./scripts/predeploy-check.sh`
- Confirm current backup status for database and media
- Confirm the migration plan and rollback stance for this release
- Confirm any required seed step, including roles and permissions
- Confirm the overdue-notification scheduler is still defined as expected

## Deploy

- Apply migrations with `alembic upgrade head`
- Run required seed scripts when permissions or roles changed
- Deploy backend and frontend artifacts

## After Deploy

- Run `./scripts/deploy-smoke-check.sh`
- Verify reports load in `/admin/reports/`
- Verify notifications load in `/admin/notifications/`
- Verify privacy requests load in `/admin/privacy-requests/`
- Confirm the public privacy, cookie, and data-rights pages render correctly

## Rollback Note

- Frontend-only regressions: redeploy the previous frontend artifact
- Risky backend releases: rely on current DB/media backups plus the documented rollback stance
- Migration failures: restore from backup or apply the planned forward-fix, as stated in the release note
