-- ============================================================
-- AletheiaPath V2 — Migration 002: Core platform tables
-- Depends on: 001_schema_fixes.sql (countries, presidents, public_expenditures)
-- Creates: iea_scores, news_events, risk_signals, forum_threads,
--          forum_replies, and analytical views
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- IEA SCORES — Institutional Effectiveness Assessment
-- One row per country per assessment period.
-- Populated by: compute_iea_from_expenditure() (migration 004)
--               and by Mistral periodic investigator (lib/agents/).
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS iea_scores (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id          uuid        NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  period              date        NOT NULL,        -- first day of assessment window
  -- Composite score
  iea_score           numeric(5,2) NOT NULL CHECK (iea_score BETWEEN 0 AND 100),
  -- Sub-pillar scores (all 0-100, higher = healthier institution)
  pillar_scores       jsonb       NOT NULL DEFAULT '{}',
  -- BIC: Baseline Integrity Confidence band
  bic_score           numeric(5,2) CHECK (bic_score BETWEEN 0 AND 100),
  bic_low             numeric(5,2) CHECK (bic_low BETWEEN 0 AND 100),
  bic_high            numeric(5,2) CHECK (bic_high BETWEEN 0 AND 100),
  bic_volatility      text        CHECK (bic_volatility IN ('low','medium','high')),
  -- Audit trail
  data_sources        text[]      DEFAULT '{}',
  missing_indicators  int         DEFAULT 0,
  calculated_at       timestamptz DEFAULT now(),
  model_version       text        DEFAULT 'v2.0',
  UNIQUE(country_id, period)
);

CREATE INDEX IF NOT EXISTS idx_iea_country_period ON iea_scores(country_id, period DESC);
CREATE INDEX IF NOT EXISTS idx_iea_score          ON iea_scores(iea_score ASC);


-- ════════════════════════════════════════════════════════════
-- NEWS EVENTS — Mistral-classified corruption news articles
-- Source: GDELT (periodic investigator) or Make.com webhook.
-- Fact-checked before being marked verified=true.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS news_events (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id          uuid        NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  published_at        date        NOT NULL,
  title               text        NOT NULL,
  url                 text        UNIQUE,
  source_name         text,
  source_domain       text,
  summary             text,                        -- Mistral-generated, in Spanish
  corruption_types    text[]      DEFAULT '{}',    -- procurement|judicial|regulatory|electoral|administrative
  entities            text[]      DEFAULT '{}',    -- institutions only — never individuals
  topics              text[]      DEFAULT '{}',
  severity            smallint    CHECK (severity BETWEEN 1 AND 5),
  mistral_confidence  numeric(3,2) CHECK (mistral_confidence BETWEEN 0 AND 1),
  source_trust        text        DEFAULT 'unknown'
    CHECK (source_trust IN ('verified','partial','flagged','unknown')),
  verified            boolean     DEFAULT true,    -- false = soft-deleted by fact-checker
  ingestion_source    text        DEFAULT 'gdelt'
    CHECK (ingestion_source IN ('gdelt','make','manual','rss')),
  created_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_country     ON news_events(country_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_domain      ON news_events(source_domain);
CREATE INDEX IF NOT EXISTS idx_news_verified    ON news_events(verified) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_news_severity    ON news_events(severity DESC);
CREATE INDEX IF NOT EXISTS idx_news_types       ON news_events USING GIN(corruption_types);
CREATE INDEX IF NOT EXISTS idx_news_entities    ON news_events USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_news_trust       ON news_events(source_trust);


-- ════════════════════════════════════════════════════════════
-- RISK SIGNALS — Active corruption pattern signals
-- Created by Mistral when evidence crosses threshold.
-- Severity decays via signal_health (migration 003).
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS risk_signals (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id        uuid        NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  pattern_type      text        NOT NULL
    CHECK (pattern_type IN ('procurement','judicial','regulatory','electoral','administrative','systemic')),
  corruption_types  text[]      DEFAULT '{}',
  description       text        NOT NULL,
  severity          smallint    NOT NULL CHECK (severity BETWEEN 1 AND 5),
  evidence_count    int         DEFAULT 1,
  news_event_ids    uuid[]      DEFAULT '{}',
  active            boolean     DEFAULT true,
  detected_at       timestamptz DEFAULT now(),
  resolved_at       timestamptz,
  resolution_note   text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_signals_country  ON risk_signals(country_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_active   ON risk_signals(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_signals_pattern  ON risk_signals(pattern_type);
CREATE INDEX IF NOT EXISTS idx_signals_severity ON risk_signals(severity DESC);


-- ════════════════════════════════════════════════════════════
-- FORUM — Community investigation threads
-- Threads auto-created by Insight Engine (lib/agents/mistral-insight.ts).
-- Replies from authenticated users + analyst (Mistral) responses.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS forum_threads (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id    uuid        REFERENCES countries(id) ON DELETE SET NULL,
  signal_id     uuid        REFERENCES risk_signals(id) ON DELETE SET NULL,
  title         text        NOT NULL,
  body          text,
  alert_level   text        DEFAULT 'watch'
    CHECK (alert_level IN ('watch','alert','urgent')),
  tags          text[]      DEFAULT '{}',
  created_by    text        NOT NULL DEFAULT 'system',
  view_count    int         NOT NULL DEFAULT 0,
  reply_count   int         NOT NULL DEFAULT 0,
  pinned        boolean     NOT NULL DEFAULT false,
  locked        boolean     NOT NULL DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id     uuid        NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  body          text        NOT NULL,
  created_by    text        NOT NULL DEFAULT 'anonymous',
  upvotes       int         NOT NULL DEFAULT 0,
  is_analyst    boolean     NOT NULL DEFAULT false, -- true = Mistral-authored insight reply
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forum_country   ON forum_threads(country_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_signal    ON forum_threads(signal_id);
CREATE INDEX IF NOT EXISTS idx_forum_alert     ON forum_threads(alert_level);
CREATE INDEX IF NOT EXISTS idx_forum_pinned    ON forum_threads(pinned) WHERE pinned = true;
CREATE INDEX IF NOT EXISTS idx_replies_thread  ON forum_replies(thread_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_replies_analyst ON forum_replies(is_analyst) WHERE is_analyst = true;


-- ════════════════════════════════════════════════════════════
-- ANALYTICAL VIEWS
-- Read by the Mistral system AND by the Next.js API routes.
-- Views are intentionally STABLE — no writes through them.
-- ════════════════════════════════════════════════════════════

-- Sector totals per country/year (feed for IEA computation)
CREATE OR REPLACE VIEW v_sector_totals AS
SELECT
  pe.country_id,
  c.iso_alpha3,
  c.name_es,
  pe.fiscal_year,
  pe.sector,
  pe.scale,
  SUM(pe.amount)  AS total_amount,
  COUNT(*)        AS indicator_count
FROM public_expenditures pe
JOIN countries c ON c.id = pe.country_id
WHERE pe.country_id IS NOT NULL
GROUP BY pe.country_id, c.iso_alpha3, c.name_es, pe.fiscal_year, pe.sector, pe.scale;

-- Year-over-year change per sector — primary anomaly signal
-- CTE ensures LAG() is evaluated exactly once (not 3x per row)
CREATE OR REPLACE VIEW v_sector_yoy AS
WITH lagged AS (
  SELECT
    country_id,
    iso_alpha3,
    name_es,
    sector,
    scale,
    fiscal_year,
    total_amount,
    LAG(total_amount) OVER (
      PARTITION BY country_id, sector, scale
      ORDER BY fiscal_year
    ) AS prev_year_amount
  FROM v_sector_totals
)
SELECT
  country_id,
  iso_alpha3,
  name_es,
  sector,
  scale,
  fiscal_year,
  total_amount,
  prev_year_amount,
  ROUND(
    CASE
      WHEN prev_year_amount > 0
      THEN ((total_amount - prev_year_amount) / prev_year_amount) * 100
      ELSE NULL
    END,
    2
  ) AS yoy_pct_change
FROM lagged;

-- Political alignment vs. expenditure pattern (research/insight use)
-- Maps each president's tenure to the expenditure data during their period
CREATE OR REPLACE VIEW v_president_expenditure AS
SELECT
  p.country_id,
  c.iso_alpha3,
  c.name_es,
  p.full_name      AS president,
  p.political_stance,
  p.party,
  p.political_system,
  pe.fiscal_year,
  pe.sector,
  pe.scale,
  SUM(pe.amount)   AS total_amount,
  COUNT(*)         AS indicator_count
FROM presidents p
JOIN countries c        ON c.id = p.country_id
JOIN public_expenditures pe
  ON  pe.country_id  = p.country_id
  AND pe.fiscal_year BETWEEN COALESCE(p.year_start, 2017)
                         AND COALESCE(p.year_end,   2025)
WHERE pe.country_id IS NOT NULL
GROUP BY
  p.country_id, c.iso_alpha3, c.name_es,
  p.full_name, p.political_stance, p.party, p.political_system,
  pe.fiscal_year, pe.sector, pe.scale;

-- Country risk dashboard (single row per country, used by frontend card)
CREATE OR REPLACE VIEW v_country_risk_dashboard AS
SELECT
  c.id           AS country_id,
  c.iso_alpha3,
  c.iso_alpha2,
  c.name_es,
  c.name_en,
  c.region,
  c.capital,
  c.flag_emoji,
  c.latitude,
  c.longitude,
  c.active,
  -- Latest IEA score
  i.iea_score,
  i.bic_score,
  i.bic_low,
  i.bic_high,
  i.bic_volatility,
  i.pillar_scores,
  i.period       AS iea_period,
  -- Active signal count and max severity
  COALESCE(sig.active_signals, 0)  AS active_signals,
  COALESCE(sig.max_severity, 0)    AS max_signal_severity,
  -- Recent news events (last 7 days)
  COALESCE(ne.recent_news, 0)      AS recent_news_7d,
  -- Current president
  pres.full_name      AS current_president,
  pres.political_stance,
  pres.party
FROM countries c
LEFT JOIN LATERAL (
  SELECT * FROM iea_scores
  WHERE country_id = c.id
  ORDER BY period DESC
  LIMIT 1
) i ON true
LEFT JOIN LATERAL (
  SELECT
    COUNT(*)       AS active_signals,
    MAX(severity)  AS max_severity
  FROM risk_signals
  WHERE country_id = c.id AND active = true
) sig ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS recent_news
  FROM news_events
  WHERE country_id = c.id
    AND verified = true
    AND published_at >= CURRENT_DATE - INTERVAL '7 days'
) ne ON true
LEFT JOIN LATERAL (
  SELECT full_name, political_stance, party
  FROM presidents
  WHERE country_id = c.id AND is_current = true
  ORDER BY year_start DESC
  LIMIT 1
) pres ON true
WHERE c.active = true;


-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- service_role bypasses RLS automatically in Supabase.
-- These policies control anon + authenticated access.
-- ════════════════════════════════════════════════════════════

-- Existing tables
ALTER TABLE countries             ENABLE ROW LEVEL SECURITY;
ALTER TABLE presidents            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_expenditures   ENABLE ROW LEVEL SECURITY;

-- New tables
ALTER TABLE iea_scores            ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_signals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies         ENABLE ROW LEVEL SECURITY;

-- Public read: reference tables (no row filter needed)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_countries' AND tablename = 'countries') THEN
    CREATE POLICY anon_read_countries ON countries FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_presidents' AND tablename = 'presidents') THEN
    CREATE POLICY anon_read_presidents ON presidents FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_expenditures' AND tablename = 'public_expenditures') THEN
    CREATE POLICY anon_read_expenditures ON public_expenditures FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_iea' AND tablename = 'iea_scores') THEN
    CREATE POLICY anon_read_iea ON iea_scores FOR SELECT USING (true);
  END IF;
  -- Only verified articles visible to public
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_news' AND tablename = 'news_events') THEN
    CREATE POLICY anon_read_news ON news_events FOR SELECT USING (verified = true);
  END IF;
  -- Only active signals visible to public
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_signals' AND tablename = 'risk_signals') THEN
    CREATE POLICY anon_read_signals ON risk_signals FOR SELECT USING (active = true);
  END IF;
  -- Forum: fully public read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_forum_threads' AND tablename = 'forum_threads') THEN
    CREATE POLICY anon_read_forum_threads ON forum_threads FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_forum_replies' AND tablename = 'forum_replies') THEN
    CREATE POLICY anon_read_forum_replies ON forum_replies FOR SELECT USING (true);
  END IF;
  -- Authenticated users can post forum replies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_replies' AND tablename = 'forum_replies') THEN
    CREATE POLICY auth_insert_replies ON forum_replies
      FOR INSERT WITH CHECK (auth.role() IN ('authenticated','service_role'));
  END IF;
  -- Authenticated users can create forum threads
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_threads' AND tablename = 'forum_threads') THEN
    CREATE POLICY auth_insert_threads ON forum_threads
      FOR INSERT WITH CHECK (auth.role() IN ('authenticated','service_role'));
  END IF;
END $$;
