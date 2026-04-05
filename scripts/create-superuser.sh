#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

FORCE_FLAG=""
EMAIL=""
FULL_NAME=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)
      FORCE_FLAG="--force"
      shift
      ;;
    --email)
      EMAIL="${2:-}"
      shift 2
      ;;
    --full-name)
      FULL_NAME="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown option: $1" >&2
      echo "Usage: $0 [--email you@example.com] [--full-name \"Your Name\"] [--force]" >&2
      exit 1
      ;;
  esac
done

if [[ -z "${EMAIL}" ]]; then
  read -r -p "Superuser email: " EMAIL
fi

if [[ -z "${FULL_NAME}" ]]; then
  read -r -p "Full name (optional): " FULL_NAME
fi

read -r -s -p "Password: " PASSWORD
echo
read -r -s -p "Confirm password: " PASSWORD_CONFIRM
echo

if [[ "${PASSWORD}" != "${PASSWORD_CONFIRM}" ]]; then
  echo "Passwords do not match." >&2
  exit 1
fi

"${SCRIPT_DIR}/setup-db.sh"
ensure_backend_venv

cd "${BACKEND_DIR}"

export DATABASE_URL
export ADMIN_API_KEY
export JWT_SECRET
export JWT_ALGORITHM
export ACCESS_TOKEN_EXPIRE_MINUTES
export REFRESH_TOKEN_EXPIRE_DAYS
export CORS_ORIGINS
export PUBLIC_SITE_URL

.venv/bin/alembic upgrade head
PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache .venv/bin/python scripts/seed_roles_permissions.py

EXXONIM_SUPERUSER_EMAIL="${EMAIL}" \
EXXONIM_SUPERUSER_PASSWORD="${PASSWORD}" \
EXXONIM_SUPERUSER_FULL_NAME="${FULL_NAME}" \
PYTHONPYCACHEPREFIX=/tmp/exxonim_backend_pycache \
  .venv/bin/python -m app.cli.superuser ${FORCE_FLAG}
