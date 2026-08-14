# Automation & CI/CD runbook

One page mapping every environment to **how it sets itself up** and **how it
stays current**. The design goal: each environment comes up from nothing with a
single command (or one merge + approval), idempotently, and CI validates
everything that ships.

| Environment | Setup (from nothing) | Update / deploy | CI |
|---|---|---|---|
| **Dev** (local) | `npm install` (native) **or** `docker compose -f docker-compose.dev.yml up` | hot reload (Vite HMR) | `ci.yml` on PRs/dev |
| **QA** (NAS) | `./scripts/nas-bootstrap.sh` | `./scripts/qa-update.sh` (timer) — pull-based | `ci.yml` |
| **Prod web** (AWS) | gated `infra.yml` apply (after one-time bootstrap) | `deploy-prod.yml` on merge to `main` | `ci.yml` + `infra.yml` plan |
| **Prod data tier** (NAS) | `./scripts/nas-bootstrap.sh` | `./scripts/data-tier-update.sh` (timer) — pull-based | `ci.yml` (`data-tier` job) |

See the decisions behind this: [ADR-0004](adr/0004-terraform-for-provisioning.md),
[ADR-0005](adr/0005-qa-on-synology-pull-based.md),
[ADR-0007](adr/0007-ci-driven-gated-provisioning.md). Editable per-environment
diagrams: [`diagrams/dev.drawio`](diagrams/dev.drawio),
[`diagrams/qa.drawio`](diagrams/qa.drawio),
[`diagrams/prod.drawio`](diagrams/prod.drawio).

---

## Dev (local)

Native is the fastest path (`npm run dev`, see [DEV_SETUP.md](DEV_SETUP.md)). For
a zero-local-Node, parity setup:

```bash
docker compose -f docker-compose.dev.yml up    # http://localhost:5173, HMR on
# or: npm run docker:dev
```

HMR works in the container because `vite.config.js` turns on watch polling when
`VITE_DOCKER=1` (set only by that compose file). To also run the data tier
locally, start it from its own directory: `cd nas_data_tier && docker compose -f
docker-compose.data.yml up -d` (needs `nas_data_tier/.env` — see below).

## QA + data tier (NAS) — pull-based

First-time, one command (from the repo root on the NAS):

```bash
./scripts/nas-bootstrap.sh
```

It generates `nas_data_tier/.env` with fresh secrets on first run (never
overwrites an existing one), brings up the website (`:8080`) and the data tier
(`:3001`), and health-checks both.

**Keep them fresh** with the change-aware agents on a Synology Task Scheduler
timer (user `root`, every 5–10 min). Both no-op unless their code actually moved:

```bash
./scripts/qa-update.sh          # website — rebuilds when the `qa` branch moves
./scripts/data-tier-update.sh   # data tier — rebuilds only when nas_data_tier/ changes
```

> Run each agent from a checkout dedicated to the branch it tracks (`qa` vs
> `main`) — pointing both at one checkout makes them fight over the working tree.

### As-built layout (AHSynologyNAS)

Because the two agents track different branches, the NAS carries **two**
checkouts. Task Scheduler entries must use these absolute paths:

| Checkout | Branch | Runs | Serves |
|---|---|---|---|
| `/volume1/docker/AdamAurelioDotCom` | `qa` | `qa-update.sh` | website on `:8080` (LAN) |
| `/volume1/docker/adamaurelio-data-tier` | `main` | `data-tier-update.sh`, `data-tier-backup.sh` | API on `127.0.0.1:3001` + Postgres (no published port) |

```
/volume1/docker/AdamAurelioDotCom/scripts/qa-update.sh              >> /var/log/qa-update.log 2>&1
/volume1/docker/adamaurelio-data-tier/scripts/data-tier-update.sh   >> /var/log/data-tier-update.log 2>&1
```

Container Manager's `docker` is at `/usr/local/bin/docker`, which is **not** on
Task Scheduler's default PATH — the scripts add it themselves, so invoke them
directly rather than wrapping them in `docker ...` commands.

### Backups (the one thing Git can't rebuild)

The website is reproducible from the repo; the database is not. Schedule a
**daily** Task Scheduler entry (user `root`):

```
/volume1/docker/adamaurelio-data-tier/scripts/data-tier-backup.sh   >> /var/log/data-tier-backup.log 2>&1
```

It writes a verified `pg_restore`-compatible dump to `/volume1/backups/adamaurelio`,
keeps 14 days (`RETAIN_DAYS`), and refuses to overwrite a good dump with a failed
one. Test a restore occasionally — an untested backup is a guess:

```bash
sudo docker exec -i adamaurelio_db pg_restore -U app -d adamaurelio --clean < <dump>
```

## Prod (AWS) — gated auto-provision

### One-time bootstrap (admin AWS creds; unavoidable chicken-and-egg)

1. **Create the state bucket:** `./infra/scripts/bootstrap-state.sh`
2. **First apply (local):** `cd infra/terraform && terraform init && terraform apply`
   — this creates the whole stack **including the CI provision role** and (with
   `manage_github_actions_config = true` + a `GITHUB_TOKEN`) writes the deploy
   Variables. Set it once in `terraform.tfvars` or pass `-var`.
3. **In GitHub:** create the `production` Environment with yourself as a required
   reviewer, and add the secret **`GH_PROVISION_TOKEN`** (fine-grained PAT,
   *Variables: read/write*) used by the Infra workflow to write repo Variables.

### Steady state (fully CI-driven)

- **Provisioning** — `.github/workflows/infra.yml`: PRs touching
  `infra/terraform/**` get `fmt`/`validate`; merges to `main` (or a manual run)
  do a `terraform apply` **behind the `production` reviewer gate**. `apply` is
  idempotent, so re-running re-creates anything deleted (the "auto-setup if not
  set up"). It assumes the **provision** OIDC role (broad perms, gated).
- **Deploying** — `.github/workflows/deploy-prod.yml`: every push to `main`
  builds and syncs `dist/` to S3, then invalidates CloudFront, using the
  least-privilege **deploy** role. It fails fast with a clear message if infra
  Variables are missing (i.e. infra not provisioned yet). Content deploys never
  hit the provisioning gate.

## Repo Variables / Secrets reference

Written automatically by the Infra workflow's apply (Terraform), unless you set
them by hand:

| Name | Kind | Purpose |
|---|---|---|
| `AWS_REGION` | Variable | Region for deploy + provision |
| `S3_BUCKET` | Variable | Deploy target bucket |
| `CLOUDFRONT_DISTRIBUTION_ID` | Variable | Invalidation target |
| `AWS_DEPLOY_ROLE_ARN` | Variable | Role the deploy job assumes (OIDC) |
| `AWS_PROVISION_ROLE_ARN` | Variable | Role the gated apply job assumes (OIDC) |
| `GH_PROVISION_TOKEN` | **Secret** | PAT (Variables RW) so Terraform can write the above |

## Handy local commands (`package.json`)

```bash
npm run docker:dev      # dev server in a container (:5173)
npm run qa:up           # build + serve the QA website locally (:8080)
npm run data:up         # bring up the data tier locally (needs nas_data_tier/.env)
npm run tf:plan         # terraform plan against infra/terraform
npm run tf:apply        # terraform apply (needs the state bucket + AWS creds)
```
