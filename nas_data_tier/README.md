# nas_data_tier — on-prem data tier for AdamAurelio.com

Runnable scaffold for the optional on-prem data tier: **PostgreSQL + a small
Node/Express API**, both on the Synology NAS, fronted by the DSM reverse proxy.
The full walkthrough (reverse proxy, TLS, SPA wiring, CSP, security) is in
[`../docs/PROD_NAS_DATA_TIER.md`](../docs/PROD_NAS_DATA_TIER.md); decision record
in [ADR-0006](../docs/adr/0006-optional-on-prem-data-tier.md).

> This folder is a **separate sub-project** from the static site. It has its own
> dependency tree (`api/package.json`), is excluded from the SPA build, lint, and
> S3 deploy, and is meant to run **only on the NAS**. You can also lift it into its
> own repo unchanged.

## Quick start (on the NAS)

Fastest path — from the **repo root**, one command brings up this tier (and the
website) and generates the `.env` secrets for you:

```bash
./scripts/nas-bootstrap.sh
```

To keep it current automatically, schedule the change-aware agent
[`scripts/data-tier-update.sh`](../scripts/data-tier-update.sh) (it rebuilds only
when `nas_data_tier/` changes). See [`../docs/AUTOMATION.md`](../docs/AUTOMATION.md).

Or do it by hand, from this directory:

```bash
cp .env.example .env          # then set strong secrets (openssl rand -base64 32)
sudo docker compose -f docker-compose.data.yml up -d --build

# On first run, db/schema.sql seeds an example `items` table automatically.
curl http://127.0.0.1:3001/health                     # -> healthy
curl -H "Authorization: Bearer $API_KEY" \
     http://127.0.0.1:3001/api/items                   # -> [...]
```

Then expose it over HTTPS via the DSM reverse proxy and a Let's Encrypt cert —
see [`../docs/PROD_NAS_DATA_TIER.md`](../docs/PROD_NAS_DATA_TIER.md) §3–§4.

## Connecting a SQL client (VSCode) to the database

Postgres has **no published port** (by design), so you reach it **through the NAS
over SSH** — it's never exposed to the LAN or internet.

**1. Expose Postgres on the NAS loopback** (admin override; adds `127.0.0.1:5432`):
```bash
sudo docker compose -f docker-compose.data.yml -f docker-compose.admin.yml up -d
```

**2. Get a local endpoint to connect to:**

- **Editing on the NAS (VSCode Remote-SSH):** `localhost` *is* the NAS — connect
  straight to `localhost:5432`. Skip the tunnel.
- **From your laptop:** open an SSH tunnel, then connect to its local end:
  ```bash
  ssh -L 55432:127.0.0.1:5432 <user>@<nas-host>   # leave running
  ```
  Your laptop's `localhost:55432` now forwards to the NAS Postgres.

**3. In VSCode**, install **SQLTools** + **SQLTools PostgreSQL/Redshift Driver**
(or Microsoft's **PostgreSQL** extension), then add a connection:

| Field | Value |
|-------|-------|
| Host | `127.0.0.1` |
| Port | `55432` (laptop tunnel) — or `5432` (on the NAS) |
| Database | `adamaurelio` |
| Username | `app` |
| Password | `POSTGRES_PASSWORD` from `.env` |

> SQLTools can also open the SSH tunnel itself — set the connection's **SSH**
> options instead of step 2's manual `ssh -L`.

**Quick CLI check (no port/tunnel needed at all):**
```bash
sudo docker exec -it adamaurelio_db psql -U app -d adamaurelio
```

**When done**, drop the admin port again:
```bash
sudo docker compose -f docker-compose.data.yml up -d
```

> Keep 5432 bound to `127.0.0.1` only — **never** `0.0.0.0`, and never forward it
> at the router. SSH (key-based) is the only access path.

## Layout

```
nas_data_tier/
├── docker-compose.data.yml   Postgres (private) + API (host-local :3001)
├── docker-compose.admin.yml  override: loopback-publish Postgres for SQL clients
├── .env.example              copy to .env (gitignored); secrets live here
├── db/
│   └── schema.sql            auto-applied on first DB init (example table)
└── api/
    ├── server.js             Express API: auth, CORS, rate-limit, pg, safe errors
    ├── package.json
    ├── package-lock.json     committed; image builds with `npm ci` (reproducible)
    ├── Dockerfile
    └── .dockerignore
```

## ⚠️ Auth caveat (read before storing private data)

The website is **public**, so any API key the browser sends ships in the bundle —
it is **not secret**. Use the key + CORS + rate-limit as **abuse control for
public-display data**. For **private data or writes**, do not embed the key in the
public SPA — use real user auth (OIDC) or owner-only tooling. See the doc header.

## Security defaults baked in

- Postgres has **no published port** — reachable only by the API on the internal
  Docker network.
- API binds to **127.0.0.1:3001** — the DSM reverse proxy reaches it on localhost;
  it is not on the LAN/internet.
- CORS locked to `ALLOWED_ORIGIN`, per-IP rate limiting, `helmet` headers,
  **parameterized** SQL, secrets from `.env` (never in code), safe error responses
  (reference id, no internals). Boots only when required env vars are set.
