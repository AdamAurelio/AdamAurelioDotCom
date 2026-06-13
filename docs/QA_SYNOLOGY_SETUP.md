# QA Setup (Synology NAS)

Run the production-style build on your Synology NAS using Docker. This serves
the exact static output that goes to AWS, behind nginx — a realistic QA mirror.

**Cost:** effectively just the electricity the NAS already uses.

## Prerequisites

- A Synology NAS that supports **Container Manager** (formerly "Docker") — most
  x86/Plus models do. Install it from the **Package Center**.
- SSH enabled (Control Panel → Terminal & SNMP → Enable SSH) **or** use the
  Container Manager UI.
- The repo available on the NAS (clone via Git Server, or copy the folder).

## What runs

`docker-compose.qa.yml` builds the `Dockerfile` (Node builds the site → nginx
serves `dist/`) and publishes it on host port **8080**.

## Option A — SSH / command line (recommended)

```bash
# On the NAS, in the repo directory:
sudo docker compose -f docker-compose.qa.yml up -d --build
```

Then open **http://<your-nas-ip>:8080**.

Check it:
```bash
curl http://localhost:8080/health      # -> healthy
sudo docker compose -f docker-compose.qa.yml ps
sudo docker compose -f docker-compose.qa.yml logs -f web
```

Update to the latest code:
```bash
git pull
sudo docker compose -f docker-compose.qa.yml up -d --build
```

Stop it:
```bash
sudo docker compose -f docker-compose.qa.yml down
```

## Option B — Container Manager UI

1. Container Manager → **Project** → **Create**.
2. Set the path to the repo folder and select `docker-compose.qa.yml`.
3. Build and run. The project maps port 8080 → container 80.

## Option C — Web Station (no Docker)

If your NAS model doesn't support Container Manager (common on ARM / J-series /
value models), serve the built site with **Web Station** instead. Web Station
does *not* build the site — you build `dist/` yourself, then point Web Station at
it. Use the **Apache** backend so SPA routing works via `.htaccess`.

**Install (Package Center):** Web Station, **Apache HTTP Server 2.4**, and
**Node.js v20**. Enable SSH (Control Panel → Terminal & SNMP).

1. **Build `dist/` on the NAS** (over SSH, in the repo dir):
   ```bash
   npm ci
   npm run build      # if `npm` isn't on PATH, use the full package path:
                      # /var/packages/Node.js_v20/target/usr/local/bin/npm
   ```
   If native deps fail to build on the NAS, build on your PC and copy `dist/` over.

2. **Place the files under the `web` shared folder** (Web Station only serves
   document roots there):
   ```bash
   mkdir -p /volume1/web/adamaurelio
   cp -r dist/* /volume1/web/adamaurelio/
   ```

3. **Add SPA routing + the prod security headers** — create
   `/volume1/web/adamaurelio/.htaccess`. The header values **must match
   `infra/response-headers-policy.json`** (the parity check enforces this):
   ```apache
   # SPA history fallback — any non-file path serves index.html
   RewriteEngine On
   RewriteBase /
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [L]

   <IfModule mod_headers.c>
     Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
     Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
     Header always set X-Frame-Options "DENY"
     Header always set X-Content-Type-Options "nosniff"
     Header always set Referrer-Policy "strict-origin-when-cross-origin"
     Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
     <FilesMatch "\.(js|css|svg|woff2?)$">
       Header set Cache-Control "public, max-age=31536000, immutable"
     </FilesMatch>
     <FilesMatch "index\.html$">
       Header set Cache-Control "no-cache, no-store, must-revalidate"
     </FilesMatch>
   </IfModule>
   ```

4. **Wire it up in Web Station:**
   - **Web Service → Create** — backend **Apache HTTP Server 2.4**, document root
     `web/adamaurelio`.
   - **Web Portal → Create → Port-based** — link the service, port **8080**
     (matches the Docker setup; pick another if it's taken).

5. Open **http://<nas-ip>:8080** and verify per *Verifying a QA build* below.

**Rebuilding after code changes:** re-run steps 1–2 (`npm run build`, then
re-copy `dist/*`). Unlike Docker there's no `--build` one-liner, and there's no
`/health` endpoint (that was only for the container — not needed here).

## Updating QA with one command (`scripts/qa-update.sh`)

The everyday refresh — pull the QA branch, rebuild, restart nginx — is wrapped in
`scripts/qa-update.sh` so you don't have to remember the flags. It's
**change-aware**: it only rebuilds when the branch actually moved (or the
container isn't running, or you pass `--force`), so the same script is safe to
run by hand *or* on a timer.

```bash
# On the NAS, from the repo root:
./scripts/qa-update.sh           # rebuild only if the QA branch moved
./scripts/qa-update.sh --force   # rebuild regardless

# The script tracks the `qa` branch by default; override per-run:
QA_BRANCH=dev ./scripts/qa-update.sh
```

> The NAS checkout is a **serving mirror** — never commit or edit on it. The
> script hard-resets to `origin/<QA_BRANCH>` so an unattended run can't get stuck
> on a conflict.

### Optional: auto-pull on a timer (the "pull agent")

To make QA update itself, run that same script on a schedule — no inbound ports,
no GitHub runner, nothing reaching *into* your network. **Control Panel → Task
Scheduler → Create → Scheduled Task → User-defined script**:

- **User:** `root` (so it can drive Docker)
- **Schedule:** every 5–10 minutes
- **Run command:**
  ```
  /volume1/path/to/AdamAurelioDotCom/scripts/qa-update.sh >> /var/log/qa-update.log 2>&1
  ```

Because the script is change-aware, most ticks do nothing (and cost nothing); it
only rebuilds after you push to the QA branch. Tail `/var/log/qa-update.log` to
see what each run did.

> Trade-off: a timer gives you hands-off freshness but gives up QA's "I test
> exactly the build I choose, when I choose" control. If you prefer deliberate
> promotion, just run the script by hand and skip the scheduled task.

## Accessing from your network

- Local: `http://<nas-ip>:8080`.
- To reach it by hostname, add a DNS/hosts entry, or use Synology's reverse
  proxy (Control Panel → Login Portal → Advanced → Reverse Proxy) to map e.g.
  `qa.adamaurelio.com` → `localhost:8080` with a Let's Encrypt cert.

## HTTPS with Let's Encrypt

DSM issues and **auto-renews** Let's Encrypt certs for you. This gets you
`https://qa.adamaurelio.com` terminating at the NAS and proxying to the :8080
site — and it makes the `Strict-Transport-Security` header actually take effect,
so the parity check can fully pass.

**Prerequisite — the NAS must be reachable on port 80.** Let's Encrypt validates
by hitting the NAS over the public internet:

- **DNS:** point a hostname at the NAS. If your home IP is dynamic, set up
  **Synology DDNS** (Control Panel → External Access → DDNS) to get e.g.
  `yourname.synology.me`, then add `qa.adamaurelio.com` CNAME → that DDNS name.
- **Router:** forward TCP **80** and **443** to the NAS. Port 80 must stay open
  for issuance *and* every renewal.

**Get the certificate:**
1. Control Panel → **Security → Certificate → Add → Add a new certificate → Get a
   certificate from Let's Encrypt**.
2. Domain: `qa.adamaurelio.com`; enter your email. DSM requests, installs, and
   auto-renews it (~30 days before expiry).

> A Synology `*.synology.me` DDNS hostname can get a cert with **no** port-80
> forwarding (Synology validates it for you). A custom domain like
> `qa.adamaurelio.com` needs port 80 reachable from the internet.

**Attach it (reverse proxy — recommended):**
1. Control Panel → **Login Portal → Advanced → Reverse Proxy → Create**:
   - Source: `https://qa.adamaurelio.com:443`
   - Destination: `http://localhost:8080`
2. Control Panel → **Security → Certificate → Settings** → set the Let's Encrypt
   cert for that reverse-proxy service.

> ⚠️ Opening ports 80/443 to a home NAS exposes it to the internet. Keep DSM
> patched, enable the firewall + auto-block, and restrict which services are
> reachable.

> **Prod uses a different mechanism — not Let's Encrypt.** CloudFront only serves
> certs from AWS Certificate Manager (ACM); see `PROD_AWS_SETUP.md`. The ACM cert
> auto-renews on its own — Let's Encrypt is a **QA-only** concern.

### Automating renewal (and the Namecheap angle)

There are two validation methods, and they fail differently:

- **HTTP-01 (DSM's built-in flow, above).** DSM auto-renews ~30 days before
  expiry, but **every renewal re-hits the NAS on port 80 from the internet.** If
  your home IP changes, DDNS lapses, or the port-80 forward breaks, renewals
  fail silently and the cert eventually expires. Fine for a low-stakes QA box you
  keep an eye on.
- **DNS-01 (recommended for hands-off).** Proves domain control by writing a TXT
  record instead of answering on port 80, so **the NAS needs no inbound ports
  open at all.** This is the robust path.

**Where DNS-01 writes the record depends on who hosts your DNS — not who you
registered with.** Your domain is registered at **Namecheap**, but prod
delegates DNS to **Route 53**. That delegation is what you should lean on:

| DNS host | DNS-01 via | Notes |
|----------|-----------|-------|
| **Route 53** (recommended — you're already using it for prod) | `acme.sh --dns dns_aws` | One DNS provider for both certs; clean IAM scoping. |
| Namecheap | `acme.sh --dns dns_namecheap` | Works, **but** Namecheap's API is gated: your account must have 20+ domains, **or** $50+ balance, **or** $50+ spent in 2 years, **and** you must allowlist your public IP. Many personal accounts don't qualify. |

So: keep DNS on Route 53 and use the AWS path. acme.sh runs on the NAS, renews
unattended via cron, and installs the renewed cert into DSM so the reverse proxy
picks it up.

**One-time setup (SSH on the NAS):**

```bash
# 1. Install acme.sh
curl https://get.acme.sh | sh -s email=adam.aurelio@gmail.com

# 2. Give it a least-privilege AWS key scoped to ONLY this hosted zone's records
#    (route53:ListHostedZones, GetChange, ChangeResourceRecordSets). Do NOT reuse
#    the deploy role from infra/terraform — that one can't touch DNS by design.
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."

# 3. Issue via DNS-01 (no open ports needed)
~/.acme.sh/acme.sh --issue --dns dns_aws -d qa.adamaurelio.com

# 4. Deploy into DSM so the reverse proxy uses it, and auto-redeploy on renewal
export SYNO_Username="admin-user"; export SYNO_Password="..."
~/.acme.sh/acme.sh --deploy -d qa.adamaurelio.com --deploy-hook synology_dsm
```

acme.sh adds its own cron entry, so renewal (~every 60 days) and the DSM
redeploy are automatic from here. Verify the renewal path without waiting two
months: `~/.acme.sh/acme.sh --renew -d qa.adamaurelio.com --force`.

## Verifying a QA build

- All routes load: `/`, `/resume`, `/about`, `/services`, `/contact`.
- **Refresh on a deep link** (e.g. reload while on `/resume`) still works — this
  confirms the nginx SPA history fallback is correct.
- `/health` returns `healthy`.

## Matching prod exactly (parity)

QA's job is to reproduce prod's *observable behavior*, not its infrastructure —
the NAS can't run CloudFront/S3. The build artifact is already identical (both
come from the same `vite build`), so the only thing that can drift is the
**serving layer**, whose config is hand-maintained in three separate places:

- **prod** — `infra/response-headers-policy.json` (CloudFront Response Headers
  Policy) + the distribution's custom error responses,
- **QA (Docker)** — `nginx.conf`,
- **QA (Web Station)** — the Apache `.htaccess`.

Don't trust that these stay in sync by eye — **verify it**. The parity check
diffs the *live* QA and prod responses (security headers, SPA deep-link
fallback, cache policy) and exits non-zero on any drift:

```powershell
# From the repo root on your Windows dev machine:
./scripts/qa-parity-check.ps1
# Point it at a QA box that isn't on HTTPS yet:
./scripts/qa-parity-check.ps1 -QaUrl http://<nas-ip>:8080
```

Quick manual version (bash, e.g. over SSH) — just the security headers:

```bash
diff <(curl -sI https://qa.adamaurelio.com | grep -iE 'content-security|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy' | sort) \
     <(curl -sI https://adamaurelio.com    | grep -iE 'content-security|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy' | sort)
```

An empty diff means QA mirrors prod.

### Known, accepted differences

These differ by design — they are *not* fidelity bugs:

- **SPA fallback mechanism** — prod serves `index.html` via CloudFront custom
  error responses (403/404 → `/index.html`, 200); QA uses nginx `try_files` /
  the Apache rewrite. The browser-visible result (deep links load with status
  200) is identical, which is what the parity check asserts.
- **Compression** — CloudFront serves brotli **and** gzip; the QA nginx/Apache
  config serves gzip only. Same bytes, one fewer encoding offered.
- **HSTS needs HTTPS** — `Strict-Transport-Security` only appears when QA is
  served over HTTPS (via the Let's Encrypt reverse proxy). Over plain
  `http://<nas-ip>:8080` the parity check will correctly flag HSTS as missing.

## Notes

- The port (8080) is set in `docker-compose.qa.yml` — change the left side of
  `"8080:80"` if it conflicts with another container.
- This is a build-time static bake: after pulling new code you must rebuild
  (`--build`) for changes to appear.
