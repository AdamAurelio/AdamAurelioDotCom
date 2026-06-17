#!/usr/bin/env bash
#
# qa-update.sh — change-aware QA refresh for the Synology NAS.
#
# Fetches the QA branch and rebuilds the Docker image (nginx serving dist/ on
# :8080) ONLY when something changed: the branch moved, the container isn't
# running (self-heal after a reboot), or you pass --force. When nothing changed
# it exits 0 without touching the running container — so it's equally safe to
# run by hand or on a timer (Synology Task Scheduler).
#
# Usage:
#   ./scripts/qa-update.sh            # rebuild only if the QA branch moved
#   ./scripts/qa-update.sh --force    # rebuild even if unchanged
#
# Config (env overrides):
#   QA_BRANCH      branch QA tracks            (default: qa)
#   COMPOSE_FILE   compose file to use         (default: docker-compose.qa.yml)
set -euo pipefail

QA_BRANCH="${QA_BRANCH:-qa}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.qa.yml}"
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

# Resolve the repo root from this script's own location, so it works no matter
# what directory the scheduler invokes it from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_DIR"

# shellcheck source=scripts/lib/refresh-common.sh
. "$SCRIPT_DIR/lib/refresh-common.sh"

rc_acquire_lock "$REPO_DIR/.qa-update.lock"
rc_detect_compose || exit 1
rc_fetch "$QA_BRANCH"

# Decide whether to rebuild, and why.
if [ "$FORCE" -eq 1 ]; then
  rc_log "--force given. Rebuilding ${RC_LOCAL:0:7}."
elif [ "$RC_LOCAL" != "$RC_REMOTE" ]; then
  rc_log "Update found: ${RC_LOCAL:0:7} -> ${RC_REMOTE:0:7}. Syncing checkout."
  rc_sync_checkout "$QA_BRANCH"
elif ! rc_compose_running "$COMPOSE_FILE"; then
  rc_log "Container not running. Rebuilding current commit ${RC_LOCAL:0:7} (self-heal)."
else
  rc_log "Already up to date (${RC_LOCAL:0:7}) and container running. Nothing to do."
  exit 0
fi

rc_compose_up "$COMPOSE_FILE"
rc_log "QA updated — nginx serving on :8080."
$RC_COMPOSE -f "$COMPOSE_FILE" ps 2>/dev/null || true
