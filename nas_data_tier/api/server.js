import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import pg from "pg";

// Fail fast on missing config (explicit dependencies; no insecure defaults).
for (const key of ["DATABASE_URL", "API_KEY", "ALLOWED_ORIGIN"]) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}
const { DATABASE_URL, API_KEY, ALLOWED_ORIGIN, PORT = "3001" } = process.env;

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // one hop: the DSM reverse proxy (for rate-limit IPs)
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
// Only the prod origin may call this from a browser (preflight handled too).
app.use(cors({ origin: ALLOWED_ORIGIN, methods: ["GET", "POST"], maxAge: 600 }));
app.use(rateLimit({ windowMs: 60_000, max: 60 })); // 60 req/min/IP

// Health is unauthenticated (used by Docker + the reverse proxy).
app.get("/health", (_req, res) => res.type("text").send("healthy"));

// Constant-time API-key check. See the public-SPA auth caveat in the README.
function requireApiKey(req, res, next) {
  const sent = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(sent);
  const b = Buffer.from(API_KEY);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

// Example read endpoint — PARAMETERIZED query (never string-concat user input).
app.get("/api/items", requireApiKey, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const { rows } = await pool.query(
      "SELECT id, title, created_at FROM items ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Safe error handler: log details server-side, return a reference id only.
// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature.
app.use((err, _req, res, _next) => {
  const ref = crypto.randomUUID();
  console.error(`[${ref}]`, err);
  res.status(500).json({ error: "internal_error", reference: ref });
});

const server = app.listen(Number(PORT), () =>
  console.log(`API listening on :${PORT}`)
);

// Clean shutdown so the container stops promptly.
for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, () => {
    server.close(() => pool.end().then(() => process.exit(0)));
  });
}
