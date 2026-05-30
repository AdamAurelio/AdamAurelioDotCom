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

## Accessing from your network

- Local: `http://<nas-ip>:8080`.
- To reach it by hostname, add a DNS/hosts entry, or use Synology's reverse
  proxy (Control Panel → Login Portal → Advanced → Reverse Proxy) to map e.g.
  `qa.adamaurelio.com` → `localhost:8080` with a Let's Encrypt cert.

## Verifying a QA build

- All routes load: `/`, `/resume`, `/about`, `/services`, `/contact`.
- **Refresh on a deep link** (e.g. reload while on `/resume`) still works — this
  confirms the nginx SPA history fallback is correct.
- `/health` returns `healthy`.

## Notes

- The port (8080) is set in `docker-compose.qa.yml` — change the left side of
  `"8080:80"` if it conflicts with another container.
- This is a build-time static bake: after pulling new code you must rebuild
  (`--build`) for changes to appear.
