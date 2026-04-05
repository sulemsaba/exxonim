#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

"${SCRIPT_DIR}/setup-db.sh"

backend_cmd="${SCRIPT_DIR}/start-backend.sh"
public_cmd="${SCRIPT_DIR}/start-public.sh"
admin_cmd="${SCRIPT_DIR}/start-admin.sh"

if command -v concurrently >/dev/null 2>&1; then
  exec concurrently \
    --names backend,public,admin \
    --prefix "[{name}]" \
    --prefix-colors blue,green,magenta \
    --kill-others-on-fail \
    "${backend_cmd}" \
    "${public_cmd}" \
    "${admin_cmd}"
fi

echo "concurrently is not installed. Falling back to native bash process management."

pids=()

"${backend_cmd}" &
pids+=($!)

"${public_cmd}" &
pids+=($!)

"${admin_cmd}" &
pids+=($!)

cleanup() {
  for pid in "${pids[@]}"; do
    kill "${pid}" >/dev/null 2>&1 || true
  done
  wait >/dev/null 2>&1 || true
}

trap cleanup INT TERM EXIT

wait -n "${pids[@]}"
status=$?
cleanup
exit "${status}"
