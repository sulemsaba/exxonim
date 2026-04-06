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
export DOCUMENTS_ROOT

.venv/bin/alembic upgrade head
PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache .venv/bin/python scripts/seed_roles_permissions.py
PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache .venv/bin/python scripts/seed_local_defaults.py
PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache .venv/bin/python scripts/create_admin.py \
  --email "${DEMO_ADMIN_EMAIL}" \
  --password "${DEMO_ADMIN_PASSWORD}" \
  --full-name "${DEMO_ADMIN_FULL_NAME}" \
  --role administrator \
  --upsert

cat <<EOF
Local demo admin is ready.
  Email: ${DEMO_ADMIN_EMAIL}
  Password: ${DEMO_ADMIN_PASSWORD}
  Role: administrator

Optional local smoke-check exports:
  export SMOKE_ADMIN_EMAIL="${DEMO_ADMIN_EMAIL}"
  export SMOKE_ADMIN_PASSWORD="${DEMO_ADMIN_PASSWORD}"
EOF
