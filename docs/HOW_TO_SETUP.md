# How To Set Up Each Environment — A Guided Walkthrough

This is the **learn-while-you-do** guide. It walks you through standing up all
three environments from scratch, explaining *why* each step exists, not just
what to type. If you already know the drill and just want the commands, the
terse reference versions are in [`DEV_SETUP.md`](./DEV_SETUP.md),
[`QA_SYNOLOGY_SETUP.md`](./QA_SYNOLOGY_SETUP.md),
[`PROD_AWS_SETUP.md`](./PROD_AWS_SETUP.md), and [`../infra/README.md`](../infra/README.md).

---

## 0. The big picture (read this first)

The whole site is a **static single-page app**: React source code that Vite
*compiles* into plain HTML, CSS, and JavaScript files in a folder called
`dist/`. There is **no server and no database**. Every environment is just a
different way of producing or serving those same static files.

```
   YOU EDIT          A TOOL BUILDS              SOMETHING SERVES dist/
   src/*.jsx   ──▶   vite build  ──▶  dist/  ──▶   to a browser
```

Once you internalize that, the three environments stop feeling like three
different systems and become three *serving strategies* for one output:

| Env  | Who builds `dist/` | Who serves it          | URL                       | Cost        |
|------|--------------------|------------------------|---------------------------|-------------|
| Dev  | Vite, live in RAM  | Vite dev server        | `localhost:5173`          | free        |
| QA   | Docker (on the NAS)| nginx in a container   | `<nas-ip>:8080`           | electricity |
| Prod | GitHub Actions     | CloudFront CDN over S3 | `https://adamaurelio.com` | ~$0.50–2/mo |

The **promotion flow** is `dev` branch → QA → `main` branch → Prod. You build
confidence at each stage before paying (in money or blast radius) for the next.

> A note you'll see repeated: **filenames must be PascalCase and match their
> imports** (`Header.jsx`, not `header.jsx`). Your Windows machine ignores case,
> but the Linux boxes that run CI, Docker, and the deploy **do not** — a
> mismatched case builds fine for you and breaks everywhere else. This is the
> single most common "works on my machine" bug for this stack.

---

## 1. Dev environment — your laptop

**Goal:** edit a file and see the change in the browser instantly. This is where
you'll spend 95% of your time.

### What you're building
Vite's dev server. It doesn't write `dist/` to disk — it builds the app *in
memory* and pushes changes to your browser over a websocket (Hot Module Reload).
That's why edits appear in well under a second.

### Prerequisites
1. **Node.js 20 LTS.** Node is the JavaScript runtime that Vite and npm run on.
   The "20 LTS" matters because that's the version CI and the Docker image use —
   matching it locally means "works on my machine" actually predicts the others.
   Verify:
   ```powershell
   node -v   # expect v20.x
   npm -v
   ```
   If missing, install from <https://nodejs.org> (or use a version manager like
   `fnm`/`nvm-windows` if you juggle multiple Node versions).
2. **Git**, to clone the repo and manage branches.

### Step-by-step

1. **Clone the repo and enter it.**
   ```powershell
   git clone git@github.com:AdamAurelio/AdamAurelioDotCom.git
   cd AdamAurelioDotCom
   ```
   *Why:* you need the source. SSH (`git@`) avoids typing a password on every
   push; if you haven't set up an SSH key, use the `https://` URL instead.

2. **Install dependencies.**
   ```powershell
   npm install
   ```
   *Why:* this reads `package.json` and downloads React, Vite, Tailwind, etc.
   into `node_modules/` (which is gitignored — never commit it). `package-lock.json`
   pins exact versions so everyone gets an identical tree.

3. **Start the dev server.**
   ```powershell
   npm run dev
   ```
   *Why:* `dev` is a script defined in `package.json` that runs `vite`. Vite
   prints a local URL and opens **http://localhost:5173**.

4. **Make an edit to prove the loop works.** Open `src/pages/Home.jsx`, change
   some text, save. The browser updates without a full reload. That instant
   feedback *is* the dev environment.

### Try these routes
`/`, `/resume`, `/about`, `/services`, `/contact` — these are defined in
`src/App.jsx`.

### Commands you'll actually use

| Command           | What it does                                              |
|-------------------|----------------------------------------------------------|
| `npm run dev`     | Live dev server with HMR at :5173                        |
| `npm run lint`    | ESLint — the **same check CI runs**; catches casing/import bugs before they embarrass you |
| `npm run build`   | Produce the real `dist/` (what QA & Prod serve)          |
| `npm run preview` | Serve the built `dist/` locally to sanity-check a build  |

### Where content lives
- Resume → `src/pages/Resume.jsx` (source text: `docs/Resume Text.md`)
- Landing page → `src/pages/Home.jsx`
- Nav links → `src/components/Header.jsx`
- Footer/social → `src/components/Footer.jsx`

### Verify dev is healthy
- The site loads at :5173 and all five routes render.
- Editing a `src/` file updates the browser within ~1s.
- `npm run lint && npm run build` both pass. **Always run these two before you
  push** — they are exactly what CI runs, so a green local run means a green CI.

---

## 2. QA environment — your Synology NAS

**Goal:** serve the *real* production build (the actual `dist/` files behind a
real web server) on hardware you control, so you can catch problems that only
show up in a production-style serve — before they hit AWS.

### Why QA exists at all
The dev server is a developer convenience; it is **not** how the site is served
in production. Production serves pre-built static files behind a web server
(nginx). Some bugs only appear there:
- **Deep-link refresh.** Reload while on `/resume`. The dev server fakes this,
  but a real static host will look for a file literally named `resume` and 404
  unless it's told to fall back to `index.html`. QA proves that fallback works.
- **Case-sensitivity.** Linux containers expose filename-casing bugs your
  Windows machine hides.
- **Build-time issues.** Anything that breaks only in `vite build` (not `vite dev`).

QA is essentially a free dress rehearsal for prod on hardware you already own.

### How it works
`docker-compose.qa.yml` builds the `Dockerfile`, which is a **two-stage build**:
1. **Stage 1 (`node:20-alpine`)** runs `npm ci` + `npm run build` to produce `dist/`.
2. **Stage 2 (`nginx:1.27-alpine`)** copies `dist/` into nginx and applies
   `nginx.conf` (which adds the SPA history fallback, caching, and a `/health`
   endpoint).

The final image is just nginx + static files — tiny and production-like. It's
published on host port **8080** (mapped to nginx's port 80 inside the container).

### Prerequisites
1. A Synology NAS that supports **Container Manager** (most x86/Plus models).
   Install **Container Manager** from the **Package Center**.
2. The repo present on the NAS — either clone it (if Git Server is installed) or
   copy the folder over via File Station / a network share.
3. *(Optional)* SSH access for the command-line path: Control Panel → Terminal &
   SNMP → Enable SSH.

### Option A — SSH / command line (recommended; it's the same everywhere)

1. **SSH into the NAS** and `cd` into the repo folder.

2. **Build and start the container.**
   ```bash
   sudo docker compose -f docker-compose.qa.yml up -d --build
   ```
   *Breaking that down:*
   - `-f docker-compose.qa.yml` — use the QA compose file specifically.
   - `up` — create and start the service.
   - `-d` — detached (runs in the background, survives your SSH logout).
   - `--build` — rebuild the image from source. **You must pass this every time
     you pull new code**, because the site is baked into the image at build time;
     without `--build` you'll keep serving the old bake.

3. **Open it:** `http://<your-nas-ip>:8080`.

4. **Check its health:**
   ```bash
   curl http://localhost:8080/health                       # -> healthy
   sudo docker compose -f docker-compose.qa.yml ps          # is it "Up"?
   sudo docker compose -f docker-compose.qa.yml logs -f web # live logs
   ```

**Update to newer code** (the everyday QA loop):
```bash
git pull
sudo docker compose -f docker-compose.qa.yml up -d --build
```

**Stop it:**
```bash
sudo docker compose -f docker-compose.qa.yml down
```

### Option B — Container Manager UI (no SSH)
1. Container Manager → **Project** → **Create**.
2. Point it at the repo folder and select `docker-compose.qa.yml`.
3. Build and run. It maps port 8080 → container 80, same as the CLI path.

### Reaching it nicely on your network (optional)
- By IP: `http://<nas-ip>:8080`.
- By hostname with HTTPS: use Synology's **reverse proxy** (Control Panel →
  Login Portal → Advanced → Reverse Proxy) to map e.g. `qa.adamaurelio.com` →
  `localhost:8080`, and let Synology issue a free Let's Encrypt cert. This also
  makes QA feel more like prod (real HTTPS).

### Verify QA is healthy (this is the whole point — do it deliberately)
- All five routes load.
- **Refresh while on `/resume`** → still works. ✅ This confirms the nginx SPA
  fallback. If it 404s, the build or `nginx.conf` is wrong — better to find out
  here than in prod.
- `curl .../health` → `healthy`.

### Gotchas
- Port 8080 conflicting with another container? Change the **left** number in
  `"8080:80"` inside `docker-compose.qa.yml`.
- Forgot `--build` and don't see your change? That's the #1 QA confusion — the
  image is a build-time snapshot. Always rebuild after pulling.

---

## 3. Prod environment — AWS S3 + CloudFront

**Goal:** the public site at `https://adamaurelio.com`, served globally from a
CDN, that **deploys itself** every time you merge to `main`. After the one-time
setup below, you never touch AWS by hand again.

> **Provisioning is now automated.** The fastest, current path is
> [`GETTING_STARTED.md`](GETTING_STARTED.md): `bootstrap-state.sh` + one local
> `terraform apply`, after which provisioning runs in a **gated CI workflow**
> (`infra.yml`) and deploys run on merge. The console walkthrough in **Part A**
> below is now the *manual fallback / explanation* of what those resources are —
> Terraform ([`infra/terraform/`](../infra/terraform/)) creates them for you.
> See [ADR-0007](adr/0007-ci-driven-gated-provisioning.md).

### The mental model
```
Browser ──HTTPS──▶ CloudFront (CDN + TLS cert) ──OAC──▶ S3 bucket (private files)
                        └─ 403/404 → /index.html  (SPA history fallback)
```
- **S3** is just a private folder in the cloud holding your `dist/` files. It is
  **not** public — nobody hits it directly.
- **CloudFront** is the CDN in front of it: it terminates HTTPS, caches files at
  edge locations worldwide (fast everywhere), and is the *only* thing allowed to
  read the bucket, via an **Origin Access Control (OAC)**.
- The **403/404 → index.html** rule is CloudFront's version of the QA nginx
  fallback — it's what makes deep-link refresh work on the CDN.

**Cost:** ~$0.50–2/month. S3 stores a few MB; CloudFront's first 1 TB/month of
transfer is free tier. The only guaranteed charge is a Route 53 hosted zone
($0.50/mo) *if* you use Route 53 for DNS.

### Part A — One-time AWS provisioning (do once, by hand)

> Full detail with the exact IAM JSON is in [`../infra/README.md`](../infra/README.md).
> This is the narrated version.

1. **Create the S3 bucket** (e.g. `adamaurelio-com-prod`).
   - **Keep "Block all public access" ON.** *Why:* the public never touches S3 —
     CloudFront reaches it privately via OAC. A public bucket would be a security
     and cost risk for no benefit.
   - Leave S3 "static website hosting" **off** — CloudFront does the serving.

2. **Request an ACM certificate — in `us-east-1` specifically.**
   - Domains: `adamaurelio.com` and `www.adamaurelio.com`.
   - Validate via DNS (add the CNAME records ACM gives you).
   - *Why us-east-1:* CloudFront only accepts certs from that region, no matter
     where your bucket lives. This trips everyone up once.

3. **Create the CloudFront distribution.**
   - **Origin:** the S3 bucket, using **Origin access control settings
     (recommended)**. CloudFront generates a bucket policy — paste it into the
     bucket (Permissions → Bucket policy). *That* is what privately wires
     CloudFront → S3.
   - **Viewer protocol policy:** Redirect HTTP → HTTPS.
   - **Default root object:** `index.html`.
   - **Alternate domain names (CNAMEs):** `adamaurelio.com`, `www.adamaurelio.com`.
   - **Custom SSL cert:** the ACM cert from step 2.
   - **Custom error responses** (this is the SPA-routing magic):
     | HTTP error code | Response page path | HTTP response code |
     |-----------------|--------------------|--------------------|
     | 403             | /index.html        | 200                |
     | 404             | /index.html        | 200                |

4. **Point DNS at CloudFront** (`dxxxx.cloudfront.net`):
   - **Route 53:** A/AAAA **alias** records → the distribution.
   - **Other registrar / Cloudflare:** CNAME `www` → distribution; for the apex
     use ALIAS/ANAME (or Cloudflare CNAME flattening).

5. **Create the CI/CD IAM role using GitHub OIDC — no stored AWS keys.**
   - IAM → Identity providers → Add → OpenID Connect:
     - URL `https://token.actions.githubusercontent.com`, audience `sts.amazonaws.com`.
   - Create a role trusted by that provider, **restricted to this repo's `main`
     branch** via the trust condition
     `...:sub = repo:AdamAurelio/AdamAurelioDotCom:ref:refs/heads/main`.
   - Attach a least-privilege policy: S3 `ListBucket`/`PutObject`/`DeleteObject`
     on the bucket, and `cloudfront:CreateInvalidation`. (Exact JSON in
     `infra/README.md`.)
   - *Why OIDC instead of access keys:* GitHub Actions exchanges a short-lived
     token for temporary AWS credentials at deploy time. Nothing long-lived is
     stored in GitHub, so there's no key to leak or rotate.

### Part B — Wire GitHub to AWS

In the repo: **Settings → Secrets and variables → Actions**. With Terraform's
`manage_github_actions_config = true` (see `GETTING_STARTED.md` Step 2), the
**Variables** below are written for you — you only add the one secret by hand.

**Secret:**
| Name                 | Value                                                     |
|----------------------|-----------------------------------------------------------|
| `GH_PROVISION_TOKEN` | Fine-grained PAT (*Variables: read/write*) for `infra.yml`|

**Variables** (role ARNs are not secrets, so they're Variables):
| Name                         | Value (example)         |
|------------------------------|-------------------------|
| `AWS_REGION`                 | `us-east-1`             |
| `S3_BUCKET`                  | `adamaurelio-com-prod`  |
| `CLOUDFRONT_DISTRIBUTION_ID` | `EXXXXXXXXXXXXX`        |
| `AWS_DEPLOY_ROLE_ARN`        | deploy role ARN (OIDC)  |
| `AWS_PROVISION_ROLE_ARN`     | provision role ARN (OIDC) |

Then **Settings → Environments → create `production`** and add **yourself as a
required reviewer** — that approval gates the Infra workflow's `terraform apply`.

### Part C — Deploying (the everyday flow)

Deployment is **automatic**: merge to `main` and `.github/workflows/deploy-prod.yml`
runs:
1. `npm ci && npm run build` — produce `dist/` on a clean GitHub runner.
2. Assume the AWS role via OIDC (temporary creds, no stored keys).
3. `aws s3 sync dist/ s3://$S3_BUCKET --delete` — upload, with long cache headers
   on fingerprinted assets and `no-cache` on `index.html`.
4. `aws cloudfront create-invalidation --paths "/*"` — tell the CDN to drop its
   cached copies so visitors get the new version immediately.

   *Why the `index.html` / invalidation dance:* JS/CSS filenames include a content
   hash, so they can be cached "forever" safely. `index.html` is the one file that
   must always be fresh (it points to the new hashed files), so it's served
   `no-cache` and the invalidation guarantees the CDN serves the new one.

You can also trigger it manually from the **Actions** tab (`workflow_dispatch`).

### Verify production
- `https://adamaurelio.com` loads over HTTPS, HTTP redirects to HTTPS, cert valid.
- **Deep-link refresh** on `/resume` works (the 403/404 → index.html rule).
- After a deploy, a hard refresh shows the new content.

### Keep costs boring
- Set an **AWS Budgets** alert (e.g. $5/mo) for peace of mind.
- Optionally restrict CloudFront to `PriceClass_100` (NA/EU edges) to cap reach.
- No always-on compute or DB = nothing accrues hourly charges.

### Rolling back
Revert the bad commit on `main` (triggers a fresh deploy), or re-run the workflow
on a previous good commit from the Actions tab.

---

## 4. How CI ties it together

Before anything reaches QA or Prod, **`.github/workflows/ci.yml`** runs on PRs
and pushes to `dev`: `npm ci → npm run lint → npm run build`. This is the gate
that catches the casing/import bugs Windows hides, *before* they reach a
case-sensitive Linux box. The habit that makes all of this smooth:

> **Run `npm run lint && npm run build` locally before every push.** It's the
> exact same check, so green locally ≈ green in CI ≈ safe to promote.

## 5. The end-to-end loop, in one breath

1. Branch off `dev`; edit `src/`; `npm run dev` to see it live.
2. `npm run lint && npm run build` locally; open a PR into `dev`; CI confirms.
3. Pull on the NAS and `docker compose ... up -d --build`; verify QA (especially
   deep-link refresh).
4. Merge `dev` → `main`; `deploy-prod.yml` ships it to S3 + CloudFront; verify prod.
