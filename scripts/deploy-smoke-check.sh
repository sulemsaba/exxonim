#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command curl
require_command awk
require_command mktemp

if [[ -z "${SMOKE_ADMIN_EMAIL:-}" || -z "${SMOKE_ADMIN_PASSWORD:-}" ]]; then
  echo "Set SMOKE_ADMIN_EMAIL and SMOKE_ADMIN_PASSWORD before running deploy smoke checks." >&2
  exit 1
fi

COOKIE_JAR="$(mktemp)"
trap 'rm -f "${COOKIE_JAR}"' EXIT

echo "Checking public site..."
curl -fsS "${PUBLIC_SITE_URL}" >/dev/null

echo "Checking admin shell..."
curl -fsS "${ADMIN_SITE_URL}" >/dev/null

echo "Checking health endpoints..."
curl -fsS "${BACKEND_HTTP_URL}/health/live" >/dev/null
curl -fsS "${BACKEND_HTTP_URL}/health/ready" >/dev/null

echo "Logging into admin..."
curl -fsS \
  -c "${COOKIE_JAR}" \
  -H "Content-Type: application/json" \
  -X POST \
  "${BACKEND_HTTP_URL}/api/v1/admin/auth/login" \
  -d "{\"email\":\"${SMOKE_ADMIN_EMAIL}\",\"password\":\"${SMOKE_ADMIN_PASSWORD}\"}" >/dev/null

CSRF_TOKEN="$(awk -v cookie_name="${VITE_ADMIN_CSRF_COOKIE_NAME}" '$6 == cookie_name { print $7 }' "${COOKIE_JAR}" | tail -n 1)"
if [[ -z "${CSRF_TOKEN}" ]]; then
  echo "Unable to read CSRF cookie from the login response." >&2
  exit 1
fi

echo "Checking notifications and reports..."
curl -fsS -b "${COOKIE_JAR}" "${BACKEND_HTTP_URL}/api/v1/admin/notifications" >/dev/null
curl -fsS -b "${COOKIE_JAR}" "${BACKEND_HTTP_URL}/api/v1/admin/reports/operations" >/dev/null

echo "Checking a protected admin write..."
curl -fsS \
  -b "${COOKIE_JAR}" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_TOKEN}" \
  -X POST \
  "${BACKEND_HTTP_URL}/api/v1/admin/notifications/mark-all-read" \
  -d '{"category": null}' >/dev/null

echo "Smoke checks passed."
echo "Manual follow-up: confirm the public fallback shell still renders if CMS-backed content APIs are temporarily unavailable."
