-- Auto-applied by the postgres image on FIRST init only (empty data dir).
-- Re-running requires recreating the volume, or apply changes via a migration.

CREATE TABLE IF NOT EXISTS items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO items (title) VALUES
  ('hello from the NAS'),
  ('on-prem data tier is live');
