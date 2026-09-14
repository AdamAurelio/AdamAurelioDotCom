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
#
# Sourcing this file has one side effect: rc_ensure_path() runs immediately, so
# the package-installed git and docker are on PATH even under the bare
# environment a scheduled task gets. See that function for why.

rc_log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Put the DSM package binaries on PATH.
#
# Synology's Task Scheduler and cron run with a minimal PATH —
# /usr/bin:/bin:/usr/sbin:/sbin — which contains neither the Git Server package's
# git nor Container Manager's docker. An agent started that way dies on its first
# git call, and because the scheduler discards output unless the task redirects
# it, the failure is invisible: the NAS simply stops updating and keeps serving a
# stale build. That is exactly how this repo's QA mirror went a month without a
# fetch while looking healthy.
#
# Idempotent, and it never shadows a binary that already resolves: entries are
# only prepended when the directory exists and is not already on PATH.
rc_ensure_path() {
  local candidates=(
    /usr/local/bin                                # Container Manager symlinks
    /var/packages/ContainerManager/target/usr/bin # Container Manager (DSM 7.2+)
    /var/packages/Docker/target/usr/bin           # Docker package (older DSM)
    /opt/bin                                      # Entware
  )

  # Package binaries live under whichever volume hosts @appstore, which is not
  # always volume1. An unmatched glob stays literal, so the -d test filters it.
  local d
  for d in /volume*/@appstore/Git/bin /usr/local/git/bin; do
    [ -d "$d" ] && candidates+=("$d")
  done

  for d in "${candidates[@]}"; do
    [ -d "$d" ] || continue
    case ":$PATH:" in
      *":$d:"*) ;; # already present
      *) PATH="$d:$PATH" ;;
    esac
  done
  export PATH
}

# Applied at source time so both agents get it without having to remember the
# call. Every helper below assumes it has already run.
rc_ensure_path

# Fail with a specific, actionable message when a required binary is missing.
# "command not found" in a scheduler log that nobody reads is how this class of
# problem stays hidden. Args: binary names.
rc_require() {
  local bin
  for bin in "$@"; do
    command -v "$bin" >/dev/null 2>&1 && continue
    rc_log "ERROR: required command '$bin' not found."
    rc_log "       PATH=$PATH"
    rc_log "HINT:  if it is installed somewhere else, add that directory to"
    rc_log "       rc_ensure_path() in scripts/lib/refresh-common.sh."
    return 1
  done
}

# Resolve compose v2 ("docker compose") vs legacy v1 into RC_COMPOSE, and prove
# the daemon is actually usable before any caller depends on it.
rc_detect_compose() {
  rc_require docker || return 1

  if docker compose version >/dev/null 2>&1; then
    RC_COMPOSE="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    RC_COMPOSE="docker-compose"
  else
    rc_log "ERROR: neither 'docker compose' nor 'docker-compose' is available."
    return 1
  fi

  # The client resolves fine without daemon access, so check reachability here
  # rather than letting it surface later as something misleading: by design
  # rc_compose_running() treats an errored `ps` as "running" so a flaky check
  # can't cause a rebuild loop, which means a permissions failure would read as
  # a cheerful "Nothing to do" instead of an error.
  if ! docker info >/dev/null 2>&1; then
    rc_log "ERROR: the Docker daemon is not reachable as user '$(id -un)'."
    rc_log "HINT:  these agents must run as root. In Task Scheduler, the task's"
    rc_log "       User must be 'root'; by hand, use sudo."
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
