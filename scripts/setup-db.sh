#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command psql
"${SCRIPT_DIR}/check-postgres.sh" --start

psql_base=(
  psql
  -h "${POSTGRES_HOST}"
  -p "${POSTGRES_PORT}"
  -U "${POSTGRES_ADMIN_USER}"
  -d postgres
  -v ON_ERROR_STOP=1
)

role_exists="$("${psql_base[@]}" -tAc "SELECT 1 FROM pg_roles WHERE rolname = '${POSTGRES_APP_USER}'")"

if [[ "${role_exists}" != "1" ]]; then
  "${psql_base[@]}" -c "CREATE ROLE \"${POSTGRES_APP_USER}\" LOGIN PASSWORD '${POSTGRES_APP_PASSWORD}';"
else
  "${psql_base[@]}" -c "ALTER ROLE \"${POSTGRES_APP_USER}\" WITH LOGIN PASSWORD '${POSTGRES_APP_PASSWORD}';"
fi

db_exists="$("${psql_base[@]}" -tAc "SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB_NAME}'")"

if [[ "${db_exists}" != "1" ]]; then
  "${psql_base[@]}" -c "CREATE DATABASE \"${POSTGRES_DB_NAME}\" OWNER \"${POSTGRES_APP_USER}\";"
fi

"${psql_base[@]}" -c "GRANT ALL PRIVILEGES ON DATABASE \"${POSTGRES_DB_NAME}\" TO \"${POSTGRES_APP_USER}\";"

echo "Database is ready:"
echo "  DATABASE_URL=${DATABASE_URL}"
