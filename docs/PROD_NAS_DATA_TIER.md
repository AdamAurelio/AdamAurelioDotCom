# Optional On-Prem Data Tier (Synology + PostgreSQL + API)

How to give the **static prod site** a dynamic data source that lives **on your
Synology NAS** instead of in the cloud — your data stays at home, only an HTTPS
API is exposed, and the database port is never reachable from the internet.

This is **opt-in**. With it disabled the site is exactly as documented elsewhere:
a static SPA on S3/CloudFront with no backend ([ADR-0001](adr/0001-static-spa-no-backend.md),
amended by [ADR-0006](adr/0006-optional-on-prem-data-tier.md)).

**Chosen setup:** PostgreSQL (Docker) · Synology reverse proxy on 443 · API-key auth.

---

## Why it has to look like this

A static site is just files on a CDN — there is **no server** in prod and a
browser **cannot** open a database connection (it would expose credentials and
can't speak the Postgres protocol safely). So the SPA must call a **small API**
over HTTPS, and that API talks to the database. The cleanest "keep data local"
design runs **both the API and the DB on the NAS**:

```
Browser (SPA served by CloudFront)
   │  HTTPS  fetch('https://api.adamaurelio.com/…')
   ▼
[ Synology reverse proxy : 443 ]  ── Let's Encrypt cert (DNS-01 via Route 53)
   │  → http://127.0.0.1:3001   (host-local only)
   ▼
[ api  — Node/Express container ]
   │  → postgres:5432  (internal Docker network only)
   ▼
[ postgres — container, named volume ]   ← port NEVER published to host/LAN/WAN
```

- **Only the API is public**, over HTTPS via the reverse proxy. Postgres has **no
  published port** — it's reachable only by the API on the internal Docker network.
- **Prod static hosting is unchanged.** The SPA just learns an API base URL.

> ### ⚠️ Read this before you store anything private
> The site is **public**, so any API key the browser sends is visible to every
> visitor (it ships in the JS bundle / network calls). Decide per endpoint:
> - **Public-display data** (a list/blog/stats shown to all visitors): the data
>   is public anyway — the key + CORS + rate-limit are *abuse control*. Fine.
> - **Private data or writes:** do **not** embed the key in the public site. Use
>   real user auth (OIDC/login) or perform writes from your own authenticated
>   tooling — not the public bundle. Revisit auth before exposing private data.

> ### ⚠️ Availability
> Prod now depends on your home NAS + internet being up. The résumé still loads
> (it's on CloudFront), but **DB-backed features break when home is down**. The
> SPA must degrade gracefully — see [§7](#7-make-the-spa-degrade-gracefully).

---

## Where this code lives

Keep the data tier **out of the static-site repo** to preserve its clean
"no-backend" deploy (ADR-0001). Put the files below in a sibling folder or a
separate repo on the NAS, e.g. `~/adamaurelio-data-tier/`. Only the small SPA
wiring ([§6](#6-wire-the-spa-to-the-api)) and the CSP change ([§8](#8-update-the-csp-connect-src))
touch this repo.

---

## Prerequisites

- Synology NAS with **Container Manager** (Docker), SSH enabled.
- DNS in **Route 53** (you already use it for prod). You'll add an
  `api.adamaurelio.com` record.
- A way to reach the NAS by name. If your home IP is dynamic, set up **Synology
  DDNS** and CNAME `api.adamaurelio.com` → the DDNS host.

---

## 1. DNS — point `api.adamaurelio.com` at the NAS

In Route 53, create a record for `api.adamaurelio.com`:
- **Static home IP:** an `A` record → your public IP.
- **Dynamic IP:** a `CNAME` → your Synology DDNS hostname (e.g. `yourname.synology.me`).

(The cert in [§4](#4-tls-certificate-lets-encrypt-via-dns-01) is validated over
DNS, so this record drives both routing and cert issuance.)

---

## 2. Stand up PostgreSQL + the API on the NAS

Create `~/adamaurelio-data-tier/` with the three files below.

### `docker-compose.data.yml`

```yaml
# On-prem data tier: Postgres (private) + API (host-local, behind the DSM proxy).
#   docker compose -f docker-compose.data.yml up -d --build
services:
  postgres:
    image: postgres:16-alpine
    container_name: adamaurelio_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: adamaurelio
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    # NOTE: no `ports:` — Postgres is reachable only on the internal network.
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d adamaurelio"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: ./api
    container_name: adamaurelio_api
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://app:${POSTGRES_PASSWORD}@postgres:5432/adamaurelio
      API_KEY: ${API_KEY}
      ALLOWED_ORIGIN: ${ALLOWED_ORIGIN}
      PORT: "3001"
    # Bind to 127.0.0.1 only: the DSM reverse proxy reaches it on localhost,
    # but it is NOT on the LAN or the internet.
    ports:
      - "127.0.0.1:3001:3001"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pgdata:
```

### `.env.example`  → copy to `.env` (gitignored; never commit)

```bash
# Strong random values. Generate e.g. with: openssl rand -base64 32
POSTGRES_PASSWORD=change-me-long-random
API_KEY=change-me-long-random
# The only browser origin allowed to call the API (your prod site):
ALLOWED_ORIGIN=https://adamaurelio.com
```

### `api/` — minimal, secure Express skeleton

`api/package.json`
```json
{
  "name": "adamaurelio-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "express-rate-limit": "^7.4.0",
    "helmet": "^8.0.0",
    "pg": "^8.13.0"
  }
}
```

`api/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1
CMD ["node", "server.js"]
```

`api/server.js`
```js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import pg from "pg";

const { DATABASE_URL, API_KEY, ALLOWED_ORIGIN, PORT = "3001" } = process.env;
const pool = new pg.Pool({ connectionString: DATABASE_URL });

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
// Only the prod origin may call this from a browser (preflight handled too).
app.use(cors({ origin: ALLOWED_ORIGIN, methods: ["GET", "POST"], maxAge: 600 }));
app.use(rateLimit({ windowMs: 60_000, max: 60 })); // 60 req/min/IP

// Health is unauthenticated (used by Docker + the reverse proxy).
app.get("/health", (_req, res) => res.type("text").send("healthy"));

// Constant-time API-key check. See the public-SPA caveat in the doc header.
function requireApiKey(req, res, next) {
  const sent = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(sent);
  const b = Buffer.from(API_KEY || "");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

// Example read endpoint — PARAMETERIZED query (never string-concat user input).
app.get("/api/items", requireApiKey, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, created_at FROM items ORDER BY created_at DESC LIMIT $1",
      [Math.min(Number(req.query.limit) || 20, 100)]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Safe error handler: log details server-side, return a reference id only.
app.use((err, _req, res, _next) => {
  const ref = crypto.randomUUID();
  console.error(`[${ref}]`, err);
  res.status(500).json({ error: "internal_error", reference: ref });
});

app.listen(Number(PORT), () => console.log(`API on :${PORT}`));
```

Bring it up on the NAS:
```bash
cd ~/adamaurelio-data-tier
cp .env.example .env && nano .env      # set strong secrets
sudo docker compose -f docker-compose.data.yml up -d --build
curl http://127.0.0.1:3001/health      # -> healthy  (on the NAS itself)
```

---

## 3. Synology reverse proxy (the public HTTPS front door)

**Control Panel → Login Portal → Advanced → Reverse Proxy → Create:**

| Field | Source | Destination |
|-------|--------|-------------|
| Protocol | **HTTPS** | **HTTP** |
| Hostname | `api.adamaurelio.com` | `localhost` |
| Port | `443` | `3001` |

- Under **Custom Header → Create → WebSocket** only if you need WS (not for this
  REST API).
- This is the *only* thing the internet can reach. The API listens on
  `127.0.0.1:3001`; the proxy bridges `:443` → it. Postgres is never in the path.

**Router:** forward **only TCP 443** to the NAS. **Do not** forward 5432 (or 80,
if you use DNS-01 below). The database is never exposed.

> Hardening (do this): DSM **Security → Firewall** (allow 443, deny the rest),
> **Security → Protection → Auto Block** + **Account Protection**, keep DSM
> patched. The API also rate-limits per IP.

---

## 4. TLS certificate (Let's Encrypt via DNS-01)

Reuse the **DNS-01 / Route 53** method already documented for QA in
[`QA_SYNOLOGY_SETUP.md`](QA_SYNOLOGY_SETUP.md#automating-renewal-and-the-namecheap-angle) —
it needs **no open port 80** and auto-renews:

```bash
# On the NAS (acme.sh already installed per the QA doc):
export AWS_ACCESS_KEY_ID="AKIA..."         # least-priv Route 53 key (zone only)
export AWS_SECRET_ACCESS_KEY="..."
~/.acme.sh/acme.sh --issue --dns dns_aws -d api.adamaurelio.com
export SYNO_Username="admin-user"; export SYNO_Password="..."
~/.acme.sh/acme.sh --deploy -d api.adamaurelio.com --deploy-hook synology_dsm
```

Then **Control Panel → Security → Certificate → Settings** → assign the
`api.adamaurelio.com` cert to the reverse-proxy service created in §3.

---

## 5. (Schema) create the example table

```bash
sudo docker exec -it adamaurelio_db psql -U app -d adamaurelio
```
```sql
CREATE TABLE items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO items (title) VALUES ('hello from the NAS');
```

---

## 6. Wire the SPA to the API

The SPA needs the API base URL and a **centralized client** (model Frontend §7 —
no `fetch` scattered in components).

**Config (externalized, not a secret — it's a public URL).** Set a GitHub Actions
**variable** `VITE_API_BASE_URL = https://api.adamaurelio.com` and pass it to the
build in `deploy-prod.yml`:

```yaml
      - run: npm run build
        env:
          VITE_API_BASE_URL: ${{ vars.VITE_API_BASE_URL }}
```

> More model-aligned (immutable-artifact) alternative: ship a `public/config.json`
> the SPA fetches at runtime, so the *same* build points at any API. See
> `MODEL_CONFORMANCE.md` #ARTIFACT. The build-time `VITE_` var above is simpler;
> either is fine.

**Client** — `src/lib/api.js` (in this repo):
```js
const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// Centralized API client. Distinguishes network vs. HTTP vs. unexpected errors
// (Frontend §7/§8). NOTE: any token sent here is visible in a public SPA — see
// the auth caveat in docs/PROD_NAS_DATA_TIER.md before sending one.
export async function apiGet(path, { signal } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("network"); // API/home unreachable → caller shows offline state
  }
  if (!res.ok) throw new Error(`http_${res.status}`);
  return res.json();
}
```

---

## 7. Make the SPA degrade gracefully

Home uptime isn't guaranteed, so any DB-backed view must handle loading / empty /
error states and never block the static content (Frontend §1/§8):

```jsx
const [state, setState] = useState({ status: "loading", data: [] });

useEffect(() => {
  const ctrl = new AbortController();
  apiGet("/api/items", { signal: ctrl.signal })
    .then((data) => setState({ status: "ready", data }))
    .catch(() => setState({ status: "error", data: [] })); // show a calm fallback
  return () => ctrl.abort();
}, []);
// render: loading spinner / the list / "Live data is temporarily unavailable."
```

---

## 8. Update the CSP `connect-src`

The strict CSP currently allows `connect-src 'self'`, which **blocks** calls to
`api.adamaurelio.com`. When you enable the data tier, widen it in **all three
parity surfaces** (keep them identical):

- `infra/response-headers-policy.json` (prod / CloudFront)
- `infra/terraform/cloudfront.tf` (the `content_security_policy` value)
- `nginx.conf` (QA)

Change `connect-src 'self'` → `connect-src 'self' https://api.adamaurelio.com`.
Then redeploy and re-run `./scripts/qa-parity-check.ps1`.

> Apply this **only when the API goes live** — don't pre-loosen the CSP for a
> feature that isn't serving yet.

---

## 9. Verify

- `curl -sI https://api.adamaurelio.com/health` → `200`, valid cert, `healthy`.
- CORS: a `fetch` from `https://adamaurelio.com` succeeds; from another origin the
  browser blocks it (preflight returns your origin only).
- **DB is not exposed:** from *outside* your network,
  `nc -vz <home-ip> 5432` should **fail/timeout**. Only 443 answers.
- Site still fully loads with the API stopped (`docker compose ... stop api`) —
  DB-backed sections show the offline fallback, nothing else breaks.

---

## 10. Back up your data (it's now your responsibility)

Previously the site was stateless and "reproducible from Git." With a database,
**you own the backups** (ISO A.12.3). Add a Synology **Scheduled Task** (daily):

```bash
docker exec adamaurelio_db pg_dump -U app -Fc adamaurelio \
  > /volume1/backups/adamaurelio_$(date +\%F).dump
```
Keep a rotation (e.g. 14 days) and test a restore (`pg_restore`) occasionally.

---

## 11. Disable / roll back

Fully reversible:
1. Revert the `connect-src` change in the three CSP surfaces; redeploy.
2. Remove `VITE_API_BASE_URL` (or point the SPA away); the DB-backed views show
   their offline state.
3. `sudo docker compose -f docker-compose.data.yml down` on the NAS.
4. Remove the reverse-proxy rule and the router's 443 forward if nothing else
   uses them.

The site returns to the pure-static ADR-0001 posture.

---

## Security checklist (maps to the ADAM security standards)

- [ ] Postgres has **no published port**; reachable only on the internal network.
- [ ] Only **443** is forwarded at the router; DB port never exposed.
- [ ] TLS on the reverse proxy (Let's Encrypt, auto-renew).
- [ ] **CORS** locked to `https://adamaurelio.com`.
- [ ] **Rate limiting** on the API; `helmet` security headers.
- [ ] **Parameterized** SQL only (no string concatenation) — OWASP A03.
- [ ] Secrets in `.env` (gitignored), **never** in code or the SPA bundle.
- [ ] Auth caveat understood: no private data behind a browser-shipped key.
- [ ] **Backups** scheduled and a restore tested.
- [ ] `SECURITY.md` data classification updated to reflect non-PUBLIC data.
