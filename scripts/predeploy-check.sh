#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

ensure_backend_dir
if [[ ! -x "${BACKEND_DIR}/.venv/bin/python" ]]; then
  echo "Backend virtual environment not found at ${BACKEND_DIR}/.venv/bin/python" >&2
  echo "Create it first, then rerun this check." >&2
  exit 1
fi

for required_script in \
  "${ROOT_DIR}/scripts/backup-db.sh" \
  "${ROOT_DIR}/scripts/restore-db.sh" \
  "${ROOT_DIR}/scripts/backup-media.sh" \
  "${ROOT_DIR}/scripts/restore-media.sh" \
  "${ROOT_DIR}/scripts/deploy-smoke-check.sh"; do
  if [[ ! -f "${required_script}" ]]; then
    echo "Missing required operational script: ${required_script}" >&2
    exit 1
  fi
done

(
  cd "${BACKEND_DIR}"
  PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache \
    APP_ENV="${APP_ENV}" \
    DATABASE_URL="${DATABASE_URL}" \
    JWT_SECRET="${JWT_SECRET}" \
    COOKIE_SECURE="${COOKIE_SECURE}" \
    COOKIE_DOMAIN="${COOKIE_DOMAIN}" \
    CORS_ORIGINS="${CORS_ORIGINS}" \
    PUBLIC_SITE_URL="${PUBLIC_SITE_URL}" \
    ADMIN_SITE_URL="${ADMIN_SITE_URL}" \
    MEDIA_ROOT="${MEDIA_ROOT}" \
    DOCUMENTS_ROOT="${DOCUMENTS_ROOT}" \
    ./.venv/bin/python -m app.cli.predeploy_check --strict
)

echo "Predeploy script checks passed."
