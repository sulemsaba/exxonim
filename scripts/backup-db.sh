#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command pg_dump
require_command mkdir

BACKUP_ROOT="${ROOT_DIR}/backups/db"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_PATH="${1:-${BACKUP_ROOT}/exxonim-db-${TIMESTAMP}.dump}"

mkdir -p "$(dirname -- "${OUTPUT_PATH}")"

echo "Creating PostgreSQL backup at ${OUTPUT_PATH}"
PGPASSWORD="${POSTGRES_APP_PASSWORD}" pg_dump \
  --format=custom \
  --file="${OUTPUT_PATH}" \
  --host="${POSTGRES_HOST}" \
  --port="${POSTGRES_PORT}" \
  --username="${POSTGRES_APP_USER}" \
  "${POSTGRES_DB_NAME}"

echo "Database backup completed."
