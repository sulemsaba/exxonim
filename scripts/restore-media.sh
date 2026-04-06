#!/usr/bin/env bash
set -euo pipefail

source "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"

require_command find
require_command mkdir
require_command tar

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup-file.tar.gz> [--force]" >&2
  exit 1
fi

BACKUP_PATH="$1"
FORCE_RESTORE="${2:-}"

if [[ ! -f "${BACKUP_PATH}" ]]; then
  echo "Backup file not found: ${BACKUP_PATH}" >&2
  exit 1
fi

if [[ "${FORCE_RESTORE}" != "--force" ]]; then
  echo "Refusing to overwrite ${MEDIA_ROOT} without --force." >&2
  exit 1
fi

mkdir -p "${MEDIA_ROOT}"
find "${MEDIA_ROOT}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

echo "Restoring media backup from ${BACKUP_PATH}"
tar -xzf "${BACKUP_PATH}" -C "${MEDIA_ROOT}"

echo "Media restore completed."
