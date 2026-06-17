#!/usr/bin/env bash
#
# nas-bootstrap.sh — one-command, idempotent first-time setup on the Synology NAS.
#
# Brings up the QA website (nginx :8080) and the on-prem data tier (Postgres +
# API :3001) from a fresh checkout. Generates the data-tier secrets on first run
# (never overwrites an existing .env), then health-checks both stacks. Re-running
# is safe: it leaves an existing .env alone and just (re)applies the compose
# state.
#
# Usage (on the NAS, from the repo root):
#   ./scripts/nas-bootstrap.sh
#
# Config (env overrides):
#   NAS_BOOTSTRAP_WEB_ONLY=1   skip the data tier (website only)
#   ALLOWED_ORIGIN=...         override the API's allowed browser origin
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_DIR"

# shellcheck source=scripts/lib/refresh-common.sh
. "$SCRIPT_DIR/lib/refresh-common.sh"

WITH_DATA=1
[ "${NAS_BOOTSTRAP_WEB_ONLY:-0}" = "1" ] && WITH_DATA=0

rc_detect_compose || exit 1

# ── 1. Data-tier secrets (.env) — generate once, never clobber ────────────────
ENV_FILE="$REPO_DIR/nas_data_tier/.env"
ENV_EXAMPLE="$REPO_DIR/nas_data_tier/.env.example"
if [ "$WITH_DATA" = "1" ]; then
  if [ -f "$ENV_FILE" ]; then
    rc_log "nas_data_tier/.env already exists — leaving it untouched."
  else
    rc_log "Generating nas_data_tier/.env with fresh secrets..."
    command -v openssl >/dev/null 2>&1 || {
      rc_log "ERROR: openssl is required to generate secrets."
      exit 1
    }
    pw="$(openssl rand -base64 32)"
    key="$(openssl rand -base64 32)"
    origin="${ALLOWED_ORIGIN:-https://adamaurelio.com}"
    # base64 has no | & or \\, so it's safe as the sed replacement / delimiter.
    sed -e "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${pw}|" \
      -e "s|^API_KEY=.*|API_KEY=${key}|" \
      -e "s|^ALLOWED_ORIGIN=.*|ALLOWED_ORIGIN=${origin}|" \
      "$ENV_EXAMPLE" >"$ENV_FILE"
    chmod 600 "$ENV_FILE"
    rc_log "Wrote nas_data_tier/.env (secrets generated; ALLOWED_ORIGIN=${origin})."
  fi
fi

# ── 2. Website QA stack (nginx :8080) ─────────────────────────────────────────
rc_log "Bringing up the QA website (docker-compose.qa.yml)..."
$RC_COMPOSE -f docker-compose.qa.yml up -d --build

# ── 3. Data tier (Postgres + API :3001) ───────────────────────────────────────
if [ "$WITH_DATA" = "1" ]; then
  rc_log "Bringing up the data tier (nas_data_tier/docker-compose.data.yml)..."
  (cd nas_data_tier && $RC_COMPOSE -f docker-compose.data.yml up -d --build)
fi

# ── 4. Health checks ──────────────────────────────────────────────────────────
rc_log "Waiting for health endpoints..."
rc_wait_http "http://localhost:8080/health" || true
[ "$WITH_DATA" = "1" ] && { rc_wait_http "http://127.0.0.1:3001/health" || true; }

# ── 5. Next steps (the one thing that can't be scripted from the CLI) ──────────
cat <<'EOF'

────────────────────────────────────────────────────────────────────────────
Bootstrap complete.

  Website : http://<nas-ip>:8080   (health: /health)
  Data API: http://127.0.0.1:3001  (health: /health, loopback only by design)

To keep these fresh automatically, add Synology Task Scheduler entries
(Control Panel → Task Scheduler → Create → Scheduled Task → User-defined
script), user `root`, every 5–10 minutes:

  /volume1/path/to/AdamAurelioDotCom/scripts/qa-update.sh         >> /var/log/qa-update.log 2>&1
  /volume1/path/to/AdamAurelioDotCom/scripts/data-tier-update.sh  >> /var/log/data-tier-update.log 2>&1

Both are change-aware, so most ticks do nothing. See docs/AUTOMATION.md.
────────────────────────────────────────────────────────────────────────────
EOF
