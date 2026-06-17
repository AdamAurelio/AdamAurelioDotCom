#!/usr/bin/env bash
#
# refresh-common.sh — shared helpers for the NAS pull-based self-update agents
# (scripts/qa-update.sh, scripts/data-tier-update.sh). SOURCE this file; do not
# execute it. Functions are prefixed `rc_` and set a few `RC_*` globals.
#
# The model (see ADR-0005): the NAS reaches out to GitHub, pulls, and rebuilds.
# Each agent runs in a checkout dedicated to the branch it tracks — do not point
# two agents that track different branches at the same checkout (they would fight
# over the working tree).

rc_log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Resolve compose v2 ("docker compose") vs legacy v1 into RC_COMPOSE.
rc_detect_compose() {
  if docker compose version >/dev/null 2>&1; then
    RC_COMPOSE="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    RC_COMPOSE="docker-compose"
  else
    rc_log "ERROR: neither 'docker compose' nor 'docker-compose' is available."
    return 1
  fi
}

# Single-instance lock via atomic mkdir; auto-released on EXIT. A concurrent run
# (e.g. an overlapping timer tick) exits 0 without touching anything.
# Arg: lock directory path.
rc_acquire_lock() {
  local lock_dir="$1"
  if ! mkdir "$lock_dir" 2>/dev/null; then
    rc_log "Another run is in progress (lock: $lock_dir). Exiting."
    exit 0
  fi
  # shellcheck disable=SC2064 -- expand $lock_dir now, not at trap time.
  trap "rmdir '$lock_dir' 2>/dev/null || true" EXIT
}

# Fetch a branch; export old/new HEAD as RC_LOCAL / RC_REMOTE. Arg: branch.
rc_fetch() {
  local branch="$1"
  rc_log "Checking origin/$branch for updates..."
  git fetch --quiet origin "$branch"
  RC_LOCAL="$(git rev-parse HEAD)"
  RC_REMOTE="$(git rev-parse "origin/$branch")"
}

# Hard-reset the checkout to origin/<branch>. The NAS checkout is a serving
# mirror — never hand-edited — so an unattended run can't get stuck on a
# conflict. Arg: branch.
rc_sync_checkout() {
  local branch="$1"
  git checkout --quiet "$branch"
  git reset --hard --quiet "origin/$branch"
}

# True if any path under the given pathspec(s) changed between two refs.
# Args: old new pathspec...
rc_paths_changed() {
  local old="$1" new="$2"
  shift 2
  [ -n "$(git diff --name-only "$old" "$new" -- "$@")" ]
}

# True if at least one service container for the compose file is running. Returns
# true on any uncertainty so a flaky check can't trigger a needless rebuild loop.
# Arg: compose file (relative to CWD). Uses RC_COMPOSE.
rc_compose_running() {
  local compose_file="$1" ids
  ids="$($RC_COMPOSE -f "$compose_file" ps -q 2>/dev/null)" || return 0
  [ -z "$ids" ] && return 1 # nothing created => definitely not running
  docker inspect -f '{{.State.Running}}' $ids 2>/dev/null | grep -q true && return 0
  return 1
}

# Build + (re)start the stack, then drop dangling images so they don't pile up
# on the NAS. Arg: compose file.
rc_compose_up() {
  local compose_file="$1"
  rc_log "Building and (re)starting: $compose_file"
  $RC_COMPOSE -f "$compose_file" up -d --build
  docker image prune -f >/dev/null 2>&1 || true
}

# Poll an HTTP endpoint until it answers 2xx, or give up. Args: url [retries] [sleep_s].
rc_wait_http() {
  local url="$1" retries="${2:-20}" gap="${3:-3}" i
  for ((i = 1; i <= retries; i++)); do
    if curl -sf "$url" >/dev/null 2>&1; then
      rc_log "OK: $url"
      return 0
    fi
    sleep "$gap"
  done
  rc_log "WARN: $url did not become healthy after $((retries * gap))s."
  return 1
}
