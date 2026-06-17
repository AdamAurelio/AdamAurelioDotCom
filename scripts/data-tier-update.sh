#!/usr/bin/env bash
#
# data-tier-update.sh — change-aware refresh for the on-prem data tier
# (Postgres + API) on the Synology NAS. The counterpart to qa-update.sh.
#
# Rebuilds nas_data_tier/docker-compose.data.yml ONLY when the data tier
# actually changed (something under nas_data_tier/ moved), the stack isn't
# running (self-heal), or you pass --force. A branch move that only touched the
# website does NOT churn the database/volume. Safe by hand or on a timer.
#
# Usage:
#   ./scripts/data-tier-update.sh           # rebuild only if nas_data_tier/ changed
#   ./scripts/data-tier-update.sh --force   # rebuild regardless
#
# Config (env overrides):
#   DATA_BRANCH    branch the data tier tracks   (default: main)
#   COMPOSE_FILE   compose file                  (default: nas_data_tier/docker-compose.data.yml)
#   WATCH_PATH     path that triggers a rebuild  (default: nas_data_tier)
#
# NOTE: run this from a checkout dedicated to DATA_BRANCH. If the website QA
# agent (qa-update.sh, tracking `qa`) shares this checkout, the two will fight
# over the working tree — give the data tier its own clone (or its own repo).
set -euo pipefail

DATA_BRANCH="${DATA_BRANCH:-main}"
COMPOSE_FILE="${COMPOSE_FILE:-nas_data_tier/docker-compose.data.yml}"
WATCH_PATH="${WATCH_PATH:-nas_data_tier}"
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_DIR"

# shellcheck source=scripts/lib/refresh-common.sh
. "$SCRIPT_DIR/lib/refresh-common.sh"

# Secrets must exist before the stack can boot (compose uses ${VAR:?} guards).
if [ ! -f "$REPO_DIR/nas_data_tier/.env" ]; then
  rc_log "ERROR: nas_data_tier/.env missing. Run scripts/nas-bootstrap.sh first."
  exit 1
fi

rc_acquire_lock "$REPO_DIR/.data-tier-update.lock"
rc_detect_compose || exit 1
rc_fetch "$DATA_BRANCH"

REBUILD=0
if [ "$FORCE" -eq 1 ]; then
  rc_log "--force given. Rebuilding data tier @ ${RC_LOCAL:0:7}."
  REBUILD=1
elif [ "$RC_LOCAL" != "$RC_REMOTE" ]; then
  if rc_paths_changed "$RC_LOCAL" "$RC_REMOTE" "$WATCH_PATH"; then
    rc_log "Data-tier change ${RC_LOCAL:0:7} -> ${RC_REMOTE:0:7}. Syncing + rebuilding."
    rc_sync_checkout "$DATA_BRANCH"
    REBUILD=1
  else
    rc_log "Branch moved but $WATCH_PATH/ unchanged. Syncing checkout, no rebuild."
    rc_sync_checkout "$DATA_BRANCH"
    rc_compose_running "$COMPOSE_FILE" || REBUILD=1 # self-heal if it's down
  fi
elif ! rc_compose_running "$COMPOSE_FILE"; then
  rc_log "Data tier not running. Rebuilding current commit ${RC_LOCAL:0:7} (self-heal)."
  REBUILD=1
else
  rc_log "Already up to date (${RC_LOCAL:0:7}) and running. Nothing to do."
fi

[ "$REBUILD" -eq 1 ] || exit 0

# Build from inside nas_data_tier so it reads nas_data_tier/.env automatically.
(cd "$REPO_DIR/nas_data_tier" && rc_compose_up "$(basename "$COMPOSE_FILE")")
rc_log "Data tier updated — API on 127.0.0.1:3001."
(cd "$REPO_DIR/nas_data_tier" && $RC_COMPOSE -f "$(basename "$COMPOSE_FILE")" ps 2>/dev/null) || true
