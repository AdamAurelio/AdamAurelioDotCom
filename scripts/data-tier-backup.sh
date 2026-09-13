#!/usr/bin/env bash
#
# data-tier-backup.sh — nightly pg_dump of the on-prem Postgres, with rotation.
#
# The data tier is the only stateful part of this project: the website is
# reproducible from Git, the database is not (ISO A.12.3). Run this from
# Synology Task Scheduler as `root` — see docs/AUTOMATION.md.
#
# Writes a compressed custom-format dump (restore with `pg_restore`), verifies
# the dump is actually readable before keeping it, then prunes dumps older than
# RETAIN_DAYS. A failed dump never replaces or deletes a good one.
#
# Usage:
#   ./scripts/data-tier-backup.sh
#
# Config (env overrides):
#   BACKUP_DIR    where dumps are written  (default: /volume1/backups/adamaurelio)
#   RETAIN_DAYS   days of dumps to keep    (default: 14)
#   DB_CONTAINER  postgres container name  (default: adamaurelio_db)
#   DB_USER       postgres role            (default: app)
#   DB_NAME       database name            (default: adamaurelio)
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/volume1/backups/adamaurelio}"
RETAIN_DAYS="${RETAIN_DAYS:-14}"
DB_CONTAINER="${DB_CONTAINER:-adamaurelio_db}"
DB_USER="${DB_USER:-app}"
DB_NAME="${DB_NAME:-adamaurelio}"

# Task Scheduler runs with a minimal PATH; Container Manager lives here.
PATH="$PATH:/usr/local/bin"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/refresh-common.sh
. "$SCRIPT_DIR/lib/refresh-common.sh"

rc_acquire_lock "${TMPDIR:-/tmp}/data-tier-backup.lock"

command -v docker >/dev/null 2>&1 || {
  rc_log "ERROR: docker is not available on PATH."
  exit 1
}

# Refuse to run against a stopped container. A truncated dump that silently
# replaced a good one would be worse than no dump at all.
if ! docker inspect -f '{{.State.Running}}' "$DB_CONTAINER" 2>/dev/null | grep -q true; then
  rc_log "ERROR: container '$DB_CONTAINER' is not running. Nothing was backed up."
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

dest="$BACKUP_DIR/${DB_NAME}_$(date +%F_%H%M%S).dump"
tmp="$dest.partial"
# Any early exit leaves no half-written file behind.
trap 'rm -f "$tmp"' EXIT

rc_log "Dumping '$DB_NAME' from '$DB_CONTAINER'..."
if ! docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -Fc "$DB_NAME" >"$tmp" 2>/tmp/pg_dump.err; then
  rc_log "ERROR: pg_dump failed: $(tr '\n' ' ' </tmp/pg_dump.err)"
  exit 1
fi

# A dump that can't be read back isn't a backup. Verify before we trust it.
if ! docker exec -i "$DB_CONTAINER" pg_restore --list >/dev/null 2>&1 <"$tmp"; then
  rc_log "ERROR: dump failed verification (pg_restore --list). Discarding it."
  exit 1
fi

mv "$tmp" "$dest"
trap - EXIT
chmod 600 "$dest"
rc_log "Backup OK: $dest ($(du -h "$dest" | cut -f1))"

# Prune old dumps. Only ever touches files matching our own naming pattern.
pruned=$(find "$BACKUP_DIR" -maxdepth 1 -type f -name "${DB_NAME}_*.dump" \
  -mtime "+$RETAIN_DAYS" -print -delete 2>/dev/null | wc -l)
kept=$(find "$BACKUP_DIR" -maxdepth 1 -type f -name "${DB_NAME}_*.dump" 2>/dev/null | wc -l)
rc_log "Pruned ${pruned// /} dump(s) older than ${RETAIN_DAYS}d; ${kept// /} kept."

# Restore drill (do this occasionally — an untested backup is a guess):
#   docker exec -i adamaurelio_db pg_restore -U app -d adamaurelio --clean < <dump>
