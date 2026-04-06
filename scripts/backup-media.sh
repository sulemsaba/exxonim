#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command tar
require_command mkdir

BACKUP_ROOT="${ROOT_DIR}/backups/media"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_PATH="${1:-${BACKUP_ROOT}/exxonim-media-${TIMESTAMP}.tar.gz}"

mkdir -p "$(dirname -- "${OUTPUT_PATH}")"
mkdir -p "${MEDIA_ROOT}"

echo "Creating media backup at ${OUTPUT_PATH}"
tar -czf "${OUTPUT_PATH}" -C "${MEDIA_ROOT}" .

echo "Media backup completed."
