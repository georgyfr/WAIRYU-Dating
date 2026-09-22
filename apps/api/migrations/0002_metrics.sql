-- 0002_metrics.sql — wairyu : métriques d'usage quotidiennes (Étape 1)
-- Agrégats anonymes, alimentés par le middleware usage (échantillonné) et le cron.

CREATE TABLE IF NOT EXISTS metrics_daily (
  day    TEXT NOT NULL,                            -- 'YYYY-MM-DD' UTC
  metric TEXT NOT NULL,
  value  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, metric)
);
