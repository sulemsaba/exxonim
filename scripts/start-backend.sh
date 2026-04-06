#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

"${SCRIPT_DIR}/setup-db.sh"
ensure_backend_venv

cd "${BACKEND_DIR}"

export DATABASE_URL
export APP_ENV
export JWT_SECRET
export JWT_ALGORITHM
export ACCESS_TOKEN_EXPIRE_MINUTES
export REFRESH_TOKEN_EXPIRE_DAYS
export COOKIE_SECURE
export COOKIE_DOMAIN
export CORS_ORIGINS
export PUBLIC_SITE_URL
export ADMIN_SITE_URL
export MEDIA_ROOT

.venv/bin/alembic upgrade head
PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache .venv/bin/python scripts/seed_roles_permissions.py

echo "Starting backend on ${BACKEND_HTTP_URL}"
exec env PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache \
  .venv/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port "${BACKEND_DEV_PORT}"
