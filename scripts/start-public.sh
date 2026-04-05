#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command npm

cd "${ROOT_DIR}"

export VITE_API_URL

echo "Starting public app on http://127.0.0.1:${PUBLIC_DEV_PORT}"
exec npm run dev:public
