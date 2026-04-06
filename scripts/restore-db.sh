#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command createdb
require_command dropdb
require_command pg_restore

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup-file.dump>" >&2
  exit 1
fi

BACKUP_PATH="$1"
if [[ ! -f "${BACKUP_PATH}" ]]; then
  echo "Backup file not found: ${BACKUP_PATH}" >&2
  exit 1
fi

if [[ -n "${POSTGRES_ADMIN_PASSWORD}" ]]; then
  export PGPASSWORD="${POSTGRES_ADMIN_PASSWORD}"
fi

echo "Recreating database ${POSTGRES_DB_NAME}"
dropdb \
  --if-exists \
  --host="${POSTGRES_HOST}" \
  --port="${POSTGRES_PORT}" \
  --username="${POSTGRES_ADMIN_USER}" \
  "${POSTGRES_DB_NAME}"

createdb \
  --host="${POSTGRES_HOST}" \
  --port="${POSTGRES_PORT}" \
  --username="${POSTGRES_ADMIN_USER}" \
  --owner="${POSTGRES_APP_USER}" \
  "${POSTGRES_DB_NAME}"

echo "Restoring PostgreSQL backup from ${BACKUP_PATH}"
PGPASSWORD="${POSTGRES_APP_PASSWORD}" pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --host="${POSTGRES_HOST}" \
  --port="${POSTGRES_PORT}" \
  --username="${POSTGRES_APP_USER}" \
  --dbname="${POSTGRES_DB_NAME}" \
  "${BACKUP_PATH}"

echo "Database restore completed."
