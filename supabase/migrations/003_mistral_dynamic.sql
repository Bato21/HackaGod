-- ============================================================
-- AletheiaPath V2 — Migration 003: Mistral agent tables
-- Depends on: 002_aletheia_core.sql (news_events, risk_signals)
-- Creates: country_profiles, fact_checks, investigation_runs,
--          source_reputation, signal_health, pattern_links
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- COUNTRY PROFILES — evolving narrative dossier per country
-- Written by Mistral deep investigation (every 72h).
-- Never edited manually — fully Mistral-owned.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS country_profiles (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id              uuid        NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  period_start            date        NOT NULL,
  period_end              date        NOT NULL,
  -- Mistral analysis outputs
  dominant_pattern        text,
  corruption_types_active text[]      DEFAULT '{}',
  institutions_at_risk    text[]      DEFAULT '{}',
  trajectory              text        CHECK (trajectory IN
    ('improving','stable','deteriorating','critical','insufficient_data')),
  trajectory_reason       text,
  narrative_summary       text,                     -- shown verbatim in UI
  key_signals             jsonb       DEFAULT '[]', -- [{signal, evidence_count, urgency, institutions}]
  cross_country_links     jsonb       DEFAULT '[]', -- [{description, countries}]
  -- Computation metadata
  mistral_model_used      text,
  confidence_score        numeric(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  generated_at            timestamptz DEFAULT now(),
  UNIQUE(country_id, period_start)
);

CREATE INDEX IF NOT EXISTS idx_profiles_country    ON country_profiles(country_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_trajectory ON country_profiles(trajectory);
CREATE INDEX IF NOT EXISTS idx_profiles_generated  ON country_profiles(generated_at DESC);


-- ════════════════════════════════════════════════════════════
-- FACT CHECKS — per-article validation result
-- Written by Mistral fact-checker on every article ingestion.
-- Verdict drives news_events.source_trust and verified flag.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS fact_checks (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  news_event_id           uuid        NOT NULL REFERENCES news_events(id) ON DELETE CASCADE,
  overall_confidence      numeric(3,2) CHECK (overall_confidence BETWEEN 0 AND 1),
  institutional_valid     boolean,    -- named institutions are real
  legislative_valid       boolean,    -- referenced laws/decrees are real
  statistically_plausible boolean,    -- numeric claims align with known data
  corroboration_count     int         DEFAULT 0,
  corroboration_ids       uuid[]      DEFAULT '{}', -- other news_event ids
  flags                   jsonb       DEFAULT '[]', -- [{type, detail, severity}]
  verdict                 text        CHECK (verdict IN ('verified','partial','flagged','rejected')),
  checked_at              timestamptz DEFAULT now(),
  UNIQUE(news_event_id)
);

CREATE INDEX IF NOT EXISTS idx_factchecks_event   ON fact_checks(news_event_id);
CREATE INDEX IF NOT EXISTS idx_factchecks_verdict ON fact_checks(verdict);


-- ════════════════════════════════════════════════════════════
-- INVESTIGATION RUNS — audit log for periodic investigator
-- One row per run per country. Used for rate limiting,
-- debugging, and token cost tracking.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS investigation_runs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id      uuid        REFERENCES countries(id) ON DELETE CASCADE,
  run_type        text        NOT NULL
    CHECK (run_type IN ('light','deep','structural')),
  articles_found  int         DEFAULT 0,
  articles_new    int         DEFAULT 0,
  signals_created int         DEFAULT 0,
  profile_updated boolean     DEFAULT false,
  gdelt_query     text,
  tokens_used     int         DEFAULT 0,
  duration_ms     int,
  status          text        DEFAULT 'running'
    CHECK (status IN ('running','completed','failed')),
  error_message   text,
  started_at      timestamptz DEFAULT now(),
  completed_at    timestamptz
);

CREATE INDEX IF NOT EXISTS idx_runs_country    ON investigation_runs(country_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_runs_type       ON investigation_runs(run_type, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_runs_status     ON investigation_runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_tokens     ON investigation_runs(tokens_used DESC);


-- ════════════════════════════════════════════════════════════
-- SOURCE REPUTATION — domain trust scores
-- Updated after every fact-check. Rolling weighted average.
-- Drives article ingestion filtering over time.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS source_reputation (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  domain              text        NOT NULL UNIQUE,
  trust_score         int         NOT NULL DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  trust_level         text        CHECK (trust_level IN ('verified','partial','flagged','unknown'))
                                  DEFAULT 'unknown',
  total_articles      int         NOT NULL DEFAULT 0,
  corroborated_count  int         NOT NULL DEFAULT 0,
  contradicted_count  int         NOT NULL DEFAULT 0,
  avg_fact_confidence numeric(3,2) DEFAULT 0.50,
  last_evaluated      timestamptz DEFAULT now(),
  -- Snapshot history (last 30 entries)
  reputation_history  jsonb       DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_reputation_domain  ON source_reputation(domain);
CREATE INDEX IF NOT EXISTS idx_reputation_trust   ON source_reputation(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_level   ON source_reputation(trust_level);


-- ════════════════════════════════════════════════════════════
-- SIGNAL HEALTH — severity decay tracking per signal
-- Signals that aren't reinforced lose severity over time.
-- Auto-initialized by trigger in migration 004.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS signal_health (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id               uuid        NOT NULL REFERENCES risk_signals(id) ON DELETE CASCADE UNIQUE,
  initial_severity        int         NOT NULL,
  current_severity        int         NOT NULL,
  reinforcement_count     int         NOT NULL DEFAULT 0,
  last_reinforced         timestamptz,
  -- 0.1 = lose 0.1 severity points per day without evidence
  decay_rate              numeric(3,2) NOT NULL DEFAULT 0.10,
  predicted_resolution    date,
  status_note             text
);

CREATE INDEX IF NOT EXISTS idx_health_signal ON signal_health(signal_id);
CREATE INDEX IF NOT EXISTS idx_health_decay  ON signal_health(current_severity ASC, last_reinforced ASC);


-- ════════════════════════════════════════════════════════════
-- PATTERN LINKS — cross-country corruption DNA
-- Written by Mistral structural investigator (weekly).
-- Surfaces regional trends and copy-cat patterns.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pattern_links (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_a_id      uuid        NOT NULL REFERENCES risk_signals(id) ON DELETE CASCADE,
  signal_b_id      uuid        NOT NULL REFERENCES risk_signals(id) ON DELETE CASCADE,
  similarity_score numeric(3,2) NOT NULL CHECK (similarity_score BETWEEN 0 AND 1),
  shared_features  jsonb       DEFAULT '[]',
  link_type        text        NOT NULL
    CHECK (link_type IN ('parallel','sequential','copied','regional_trend')),
  detected_at      timestamptz DEFAULT now(),
  UNIQUE(signal_a_id, signal_b_id),
  -- Prevent self-links
  CHECK (signal_a_id <> signal_b_id)
);

CREATE INDEX IF NOT EXISTS idx_links_signal_a    ON pattern_links(signal_a_id);
CREATE INDEX IF NOT EXISTS idx_links_signal_b    ON pattern_links(signal_b_id);
CREATE INDEX IF NOT EXISTS idx_links_similarity  ON pattern_links(similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_links_type        ON pattern_links(link_type);


-- ════════════════════════════════════════════════════════════
-- RLS FOR MISTRAL TABLES
-- All agent output tables: public read, service_role write.
-- ════════════════════════════════════════════════════════════

ALTER TABLE country_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_checks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_runs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_reputation   ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_health       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_links       ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_profiles') THEN
    CREATE POLICY anon_read_profiles ON country_profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_factchecks') THEN
    CREATE POLICY anon_read_factchecks ON fact_checks FOR SELECT USING (true);
  END IF;
  -- Investigation runs: authenticated only (contains token cost data)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_read_runs') THEN
    CREATE POLICY auth_read_runs ON investigation_runs
      FOR SELECT USING (auth.role() IN ('authenticated','service_role'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_reputation') THEN
    CREATE POLICY anon_read_reputation ON source_reputation FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_health') THEN
    CREATE POLICY anon_read_health ON signal_health FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_pattern_links') THEN
    CREATE POLICY anon_read_pattern_links ON pattern_links FOR SELECT USING (true);
  END IF;
END $$;
