#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

if [[ -f "${ROOT_DIR}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT_DIR}/.env"
  set +a
fi

BACKEND_DIR="${EXXONIM_BACKEND_DIR:-${ROOT_DIR}/../exxonim_backend}"

PUBLIC_DEV_PORT="${PUBLIC_DEV_PORT:-5173}"
ADMIN_DEV_PORT="${ADMIN_DEV_PORT:-3039}"
BACKEND_DEV_PORT="${BACKEND_DEV_PORT:-8000}"

POSTGRES_HOST="${POSTGRES_HOST:-127.0.0.1}"
POSTGRES_PORT="${POSTGRES_PORT:-5433}"
POSTGRES_ADMIN_USER="${POSTGRES_ADMIN_USER:-postgres}"
POSTGRES_ADMIN_PASSWORD="${POSTGRES_ADMIN_PASSWORD:-}"
POSTGRES_APP_USER="${POSTGRES_APP_USER:-app_user}"
POSTGRES_APP_PASSWORD="${POSTGRES_APP_PASSWORD:-strongpassword}"
POSTGRES_DB_NAME="${POSTGRES_DB_NAME:-Exxonim}"

BACKEND_HTTP_URL="${BACKEND_HTTP_URL:-http://127.0.0.1:${BACKEND_DEV_PORT}}"
PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-http://127.0.0.1:${PUBLIC_DEV_PORT}}"
ADMIN_SITE_URL="${ADMIN_SITE_URL:-http://127.0.0.1:${ADMIN_DEV_PORT}}"
DATABASE_URL="${DATABASE_URL:-postgresql+asyncpg://${POSTGRES_APP_USER}:${POSTGRES_APP_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB_NAME}}"
APP_ENV="${APP_ENV:-local}"
JWT_SECRET="${JWT_SECRET:-local-dev-change-me}"
JWT_ALGORITHM="${JWT_ALGORITHM:-HS256}"
ACCESS_TOKEN_EXPIRE_MINUTES="${ACCESS_TOKEN_EXPIRE_MINUTES:-15}"
REFRESH_TOKEN_EXPIRE_DAYS="${REFRESH_TOKEN_EXPIRE_DAYS:-7}"
COOKIE_SECURE="${COOKIE_SECURE:-false}"
COOKIE_DOMAIN="${COOKIE_DOMAIN:-}"
CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:${PUBLIC_DEV_PORT},http://127.0.0.1:${PUBLIC_DEV_PORT},http://localhost:${ADMIN_DEV_PORT},http://127.0.0.1:${ADMIN_DEV_PORT}}"
MEDIA_ROOT="${MEDIA_ROOT:-${BACKEND_DIR}/uploads}"
DOCUMENTS_ROOT="${DOCUMENTS_ROOT:-${BACKEND_DIR}/protected-documents}"
VITE_API_URL="${VITE_API_URL:-${BACKEND_HTTP_URL}/api/v1}"
VITE_ADMIN_CSRF_COOKIE_NAME="${VITE_ADMIN_CSRF_COOKIE_NAME:-exxonim_csrf_token}"
DEMO_ADMIN_EMAIL="${DEMO_ADMIN_EMAIL:-demo.admin@exxonim.local}"
DEMO_ADMIN_PASSWORD="${DEMO_ADMIN_PASSWORD:-Admin123!}"
DEMO_ADMIN_FULL_NAME="${DEMO_ADMIN_FULL_NAME:-Local Demo Admin}"

export BACKEND_DIR
export PUBLIC_DEV_PORT ADMIN_DEV_PORT BACKEND_DEV_PORT
export POSTGRES_HOST POSTGRES_PORT POSTGRES_ADMIN_USER POSTGRES_ADMIN_PASSWORD POSTGRES_APP_USER POSTGRES_APP_PASSWORD POSTGRES_DB_NAME
export BACKEND_HTTP_URL PUBLIC_SITE_URL ADMIN_SITE_URL DATABASE_URL
export APP_ENV JWT_SECRET JWT_ALGORITHM ACCESS_TOKEN_EXPIRE_MINUTES REFRESH_TOKEN_EXPIRE_DAYS
export COOKIE_SECURE COOKIE_DOMAIN CORS_ORIGINS MEDIA_ROOT DOCUMENTS_ROOT
export VITE_API_URL VITE_ADMIN_CSRF_COOKIE_NAME
export DEMO_ADMIN_EMAIL DEMO_ADMIN_PASSWORD DEMO_ADMIN_FULL_NAME

require_command() {
  local command_name="$1"

  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Missing required command: ${command_name}" >&2
    exit 1
  fi
}

ensure_backend_dir() {
  if [[ ! -d "${BACKEND_DIR}" ]]; then
    echo "Backend directory not found at ${BACKEND_DIR}." >&2
    echo "Set EXXONIM_BACKEND_DIR in .env if your backend lives elsewhere." >&2
    exit 1
  fi
}

ensure_backend_venv() {
  ensure_backend_dir
  require_command python3

  if [[ ! -x "${BACKEND_DIR}/.venv/bin/python" ]]; then
    echo "Creating backend virtual environment..."
    python3 -m venv "${BACKEND_DIR}/.venv"
    "${BACKEND_DIR}/.venv/bin/pip" install --upgrade pip
    "${BACKEND_DIR}/.venv/bin/pip" install -r "${BACKEND_DIR}/requirements.txt"
    return
  fi

  if ! "${BACKEND_DIR}/.venv/bin/python" -c "import PIL" >/dev/null 2>&1; then
    echo "Syncing backend dependencies..."
    "${BACKEND_DIR}/.venv/bin/pip" install -r "${BACKEND_DIR}/requirements.txt"
  fi
}
