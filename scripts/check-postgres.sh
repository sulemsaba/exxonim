#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

START_IF_DOWN=0
if [[ "${1:-}" == "--start" ]]; then
  START_IF_DOWN=1
fi

ensure_backend_dir
require_command pg_isready
require_command psql
require_command pg_ctl
require_command initdb

if pg_isready -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -d postgres >/dev/null 2>&1; then
  echo "PostgreSQL is running on ${POSTGRES_HOST}:${POSTGRES_PORT}."
  exit 0
fi

if (( START_IF_DOWN )); then
  echo "PostgreSQL is not running. Starting the local Exxonim cluster..."
  "${BACKEND_DIR}/scripts/start-postgres.sh"

  if pg_isready -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -d postgres >/dev/null 2>&1; then
    echo "PostgreSQL started on ${POSTGRES_HOST}:${POSTGRES_PORT}."
    exit 0
  fi
fi

echo "PostgreSQL is not reachable on ${POSTGRES_HOST}:${POSTGRES_PORT}." >&2
echo "Run scripts/setup-db.sh or ${BACKEND_DIR}/scripts/start-postgres.sh to start the local cluster." >&2
exit 1
