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
#
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

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Single-instance lock (atomic mkdir) so an overlapping timer tick can't collide
# with an in-progress build. Released on any exit.
LOCK_DIR="$REPO_DIR/.qa-update.lock"
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  log "Another qa-update run is in progress (lock: $LOCK_DIR). Exiting."
  exit 0
fi
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

# Compose v2 ("docker compose") vs legacy v1 ("docker-compose").
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  log "ERROR: neither 'docker compose' nor 'docker-compose' is available."
  exit 1
fi

# True if at least one service container is running. On any uncertainty returns
# true, so a flaky status check can never trigger a needless rebuild loop.
qa_running() {
  local ids
  ids="$($COMPOSE -f "$COMPOSE_FILE" ps -q 2>/dev/null)" || return 0
  [ -z "$ids" ] && return 1   # nothing created => definitely not running
  docker inspect -f '{{.State.Running}}' $ids 2>/dev/null | grep -q true && return 0
  return 1
}

log "Checking origin/$QA_BRANCH for updates..."
git fetch --quiet origin "$QA_BRANCH"

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$QA_BRANCH")"

# Decide whether to rebuild, and why.
if [ "$FORCE" -eq 1 ]; then
  log "--force given. Rebuilding ${LOCAL:0:7}."
elif [ "$LOCAL" != "$REMOTE" ]; then
  log "Update found: ${LOCAL:0:7} -> ${REMOTE:0:7}. Syncing checkout."
  # The NAS checkout is a serving mirror — never hand-edited — so hard-reset to
  # match remote exactly. This keeps an unattended run from ever getting stuck.
  git checkout --quiet "$QA_BRANCH"
  git reset --hard --quiet "origin/$QA_BRANCH"
elif ! qa_running; then
  log "Container not running. Rebuilding current commit ${LOCAL:0:7} (self-heal)."
else
  log "Already up to date (${LOCAL:0:7}) and container running. Nothing to do."
  exit 0
fi

log "Building and (re)starting the QA container..."
$COMPOSE -f "$COMPOSE_FILE" up -d --build

# Drop dangling images left by the rebuild so they don't accumulate on the NAS.
docker image prune -f >/dev/null 2>&1 || true

log "QA updated — nginx serving on :8080."
$COMPOSE -f "$COMPOSE_FILE" ps 2>/dev/null || true
