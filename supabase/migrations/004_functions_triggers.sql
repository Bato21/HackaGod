-- ============================================================
-- AletheiaPath V2 — Migration 004: Functions, triggers, computed IEA
-- Depends on: 001, 002, 003
-- Creates: updated_at triggers, IEA computation, anomaly detection,
--          signal health init trigger, forum reply counter
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGER — auto-stamp on every UPDATE
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'countries',
    'presidents',
    'public_expenditures',
    'risk_signals',
    'forum_threads',
    'forum_replies'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_updated_at ON %I;
       CREATE TRIGGER trg_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION fn_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;


-- ════════════════════════════════════════════════════════════
-- IEA SCORE COMPUTATION FROM EXPENDITURE DATA
--
-- Pillars (all 0-100, higher = healthier):
--   fiscal_discipline   — penalize bloated admin + security vs. total
--   social_investment   — reward health + education allocation
--   data_transparency   — proxy: data density (indicator count completeness)
--   sector_stability    — penalize high YoY variance across sectors
--
-- Composite: 30% fiscal + 35% social + 20% transparency + 15% stability
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_compute_iea(
  p_country_id  uuid,
  p_fiscal_year int
)
RETURNS jsonb
LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_total         numeric := 0;
  v_security      numeric := 0;
  v_health        numeric := 0;
  v_education     numeric := 0;
  v_admin         numeric := 0;
  v_social        numeric := 0;
  v_indicators    int     := 0;
  v_fiscal        numeric;
  v_soc_inv       numeric;
  v_transparency  numeric;
  v_stability     numeric;
  v_iea           numeric;
  v_variance_avg  numeric := 0;
BEGIN
  -- Pull sector amounts for preferred scale (pct_gdp first, fallback millions)
  SELECT
    COALESCE(SUM(amount), 0),
    COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(security|defense|defensa|policia|militar)%' THEN amount END), 0),
    COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(health|salud|sanidad)%'                      THEN amount END), 0),
    COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(education|educaci|instruccion)%'             THEN amount END), 0),
    COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(admin|ejecutivo|executive|presidenc)%'       THEN amount END), 0),
    COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(social|welfare|bienestar|pension)%'          THEN amount END), 0),
    COUNT(*)
  INTO v_total, v_security, v_health, v_education, v_admin, v_social, v_indicators
  FROM public_expenditures
  WHERE country_id  = p_country_id
    AND fiscal_year = p_fiscal_year
    AND scale       = 'pct_gdp';

  -- Fallback: use millions if no pct_gdp data
  IF v_total = 0 THEN
    SELECT
      COALESCE(SUM(amount), 0),
      COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(security|defense|defensa|policia|militar)%' THEN amount END), 0),
      COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(health|salud|sanidad)%'                      THEN amount END), 0),
      COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(education|educaci|instruccion)%'             THEN amount END), 0),
      COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(admin|ejecutivo|executive|presidenc)%'       THEN amount END), 0),
      COALESCE(SUM(CASE WHEN LOWER(sector) SIMILAR TO '%(social|welfare|bienestar|pension)%'          THEN amount END), 0),
      COUNT(*)
    INTO v_total, v_security, v_health, v_education, v_admin, v_social, v_indicators
    FROM public_expenditures
    WHERE country_id  = p_country_id
      AND fiscal_year = p_fiscal_year
      AND scale       = 'millions';
  END IF;

  -- Not enough data → return null scores, flag insufficient_data
  IF v_total = 0 OR v_indicators < 3 THEN
    RETURN jsonb_build_object(
      'iea_score',          NULL,
      'fiscal_discipline',  NULL,
      'social_investment',  NULL,
      'data_transparency',  NULL,
      'sector_stability',   NULL,
      'status',             'insufficient_data',
      'indicators_found',   v_indicators
    );
  END IF;

  -- Convert to percentages of total
  v_security   := (v_security   / v_total) * 100;
  v_health     := (v_health     / v_total) * 100;
  v_education  := (v_education  / v_total) * 100;
  v_admin      := (v_admin      / v_total) * 100;
  v_social     := (v_social     / v_total) * 100;

  -- PILLAR 1: Fiscal discipline (0-100)
  -- Penalize: admin overhead > 15%, security > 25%
  -- Regional LATAM benchmarks: admin ~12%, security ~18%
  v_fiscal := GREATEST(0,
    100
    - GREATEST(0, v_admin    - 15) * 2.5   -- admin bloat costs 2.5 pts per %
    - GREATEST(0, v_security - 25) * 2.0   -- excess security costs 2.0 pts per %
  );

  -- PILLAR 2: Social investment (0-100)
  -- LATAM ideal: health ~8-10%, education ~14-18% = 22-28% combined
  -- 30% combined → 100 pts; below 10% combined → ~0 pts
  v_soc_inv := LEAST(100, GREATEST(0,
    (v_health + v_education) * 3.0
  ));

  -- PILLAR 3: Data transparency (0-100)
  -- Proxy: how many indicators are present vs. expected baseline (40 per country/year)
  v_transparency := LEAST(100, (v_indicators::numeric / 40.0) * 100);

  -- PILLAR 4: Sector stability (0-100)
  -- Average absolute YoY change across sectors for this country
  SELECT COALESCE(AVG(ABS(yoy_pct_change)), 0)
  INTO   v_variance_avg
  FROM   v_sector_yoy
  WHERE  country_id  = p_country_id
    AND  fiscal_year = p_fiscal_year
    AND  yoy_pct_change IS NOT NULL;

  -- 0% avg YoY → 100 pts; 100% avg YoY → 0 pts
  v_stability := GREATEST(0, 100 - v_variance_avg);

  -- Composite IEA
  v_iea := (
    v_fiscal       * 0.30 +
    v_soc_inv      * 0.35 +
    v_transparency * 0.20 +
    v_stability    * 0.15
  );

  RETURN jsonb_build_object(
    'iea_score',           ROUND(v_iea::numeric,          2),
    'fiscal_discipline',   ROUND(v_fiscal::numeric,       2),
    'social_investment',   ROUND(v_soc_inv::numeric,      2),
    'data_transparency',   ROUND(v_transparency::numeric, 2),
    'sector_stability',    ROUND(v_stability::numeric,    2),
    'security_pct',        ROUND(v_security::numeric,     2),
    'health_pct',          ROUND(v_health::numeric,       2),
    'education_pct',       ROUND(v_education::numeric,    2),
    'admin_overhead_pct',  ROUND(v_admin::numeric,        2),
    'social_pct',          ROUND(v_social::numeric,       2),
    'status',              'computed',
    'indicators_found',    v_indicators
  );
END;
$$;


-- Batch compute IEA for all active LATAM countries for a given year
-- LATERAL subquery ensures fn_compute_iea is called exactly once per country.
-- Usage: SELECT * FROM fn_batch_compute_iea(2023);
CREATE OR REPLACE FUNCTION fn_batch_compute_iea(p_fiscal_year int DEFAULT 2024)
RETURNS TABLE (
  iso3            text,
  country_name    text,
  iea_score       numeric,
  fiscal_disc     numeric,
  social_inv      numeric,
  transparency    numeric,
  stability       numeric,
  status          text,
  indicators      int
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.iso_alpha3,
    c.name_es,
    (r.result->>'iea_score')::numeric,
    (r.result->>'fiscal_discipline')::numeric,
    (r.result->>'social_investment')::numeric,
    (r.result->>'data_transparency')::numeric,
    (r.result->>'sector_stability')::numeric,
    r.result->>'status',
    (r.result->>'indicators_found')::int
  FROM countries c,
  LATERAL (SELECT fn_compute_iea(c.id, p_fiscal_year) AS result) r
  WHERE c.active = true
  ORDER BY (r.result->>'iea_score')::numeric ASC NULLS LAST;
END;
$$;


-- Persist IEA scores from expenditure data for a specific year
-- Usage: CALL sp_populate_iea_scores(2023);
CREATE OR REPLACE PROCEDURE sp_populate_iea_scores(p_fiscal_year int DEFAULT 2024)
LANGUAGE plpgsql AS $$
DECLARE
  rec      record;
  v_result jsonb;
  v_period date;
BEGIN
  v_period := make_date(p_fiscal_year, 1, 1);

  FOR rec IN
    SELECT id, iso_alpha3, name_es FROM countries WHERE active = true
  LOOP
    v_result := fn_compute_iea(rec.id, p_fiscal_year);

    IF v_result->>'status' = 'computed' THEN
      INSERT INTO iea_scores (
        country_id, period, iea_score, pillar_scores,
        data_sources, missing_indicators, model_version
      )
      VALUES (
        rec.id,
        v_period,
        (v_result->>'iea_score')::numeric,
        v_result,
        ARRAY['public_expenditures'],
        0,
        'v2.0-expenditure'
      )
      ON CONFLICT (country_id, period) DO UPDATE
        SET iea_score      = EXCLUDED.iea_score,
            pillar_scores  = EXCLUDED.pillar_scores,
            calculated_at  = now();

      RAISE NOTICE 'IEA %: % (score=%)', rec.iso_alpha3, rec.name_es, v_result->>'iea_score';
    ELSE
      RAISE NOTICE 'IEA %: SKIP — insufficient data', rec.iso_alpha3;
    END IF;
  END LOOP;
END;
$$;


-- ════════════════════════════════════════════════════════════
-- ANOMALY DETECTION — sectors with unusual YoY change
-- Threshold: 50% default; flag for Mistral signal creation
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_detect_expenditure_anomalies(
  p_threshold_pct numeric DEFAULT 50.0,
  p_fiscal_year   int     DEFAULT NULL  -- NULL = all years
)
RETURNS TABLE (
  country_id      uuid,
  iso3            text,
  country_name    text,
  sector          text,
  fiscal_year     int,
  current_amount  numeric,
  prev_amount     numeric,
  yoy_pct_change  numeric,
  scale           text,
  anomaly_type    text
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.country_id,
    v.iso_alpha3,
    v.name_es,
    v.sector,
    v.fiscal_year,
    v.total_amount,
    v.prev_year_amount,
    v.yoy_pct_change,
    v.scale,
    CASE
      WHEN v.yoy_pct_change > 0 THEN 'spike'
      ELSE 'collapse'
    END AS anomaly_type
  FROM v_sector_yoy v
  WHERE ABS(v.yoy_pct_change) >= p_threshold_pct
    AND v.prev_year_amount IS NOT NULL
    AND v.prev_year_amount > 0
    AND (p_fiscal_year IS NULL OR v.fiscal_year = p_fiscal_year)
  ORDER BY ABS(v.yoy_pct_change) DESC;
END;
$$;


-- ════════════════════════════════════════════════════════════
-- SIGNAL HEALTH: auto-initialize on risk_signal INSERT
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_init_signal_health()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO signal_health (
    signal_id,
    initial_severity,
    current_severity,
    last_reinforced,
    decay_rate,
    predicted_resolution
  )
  VALUES (
    NEW.id,
    NEW.severity,
    NEW.severity,
    now(),
    0.10,
    (now() + INTERVAL '30 days')::date
  )
  ON CONFLICT (signal_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_init_signal_health ON risk_signals;
CREATE TRIGGER trg_init_signal_health
  AFTER INSERT ON risk_signals
  FOR EACH ROW EXECUTE FUNCTION fn_init_signal_health();


-- ════════════════════════════════════════════════════════════
-- FORUM: auto-increment reply_count on thread
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_increment_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE forum_threads
  SET reply_count = reply_count + 1
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reply_count ON forum_replies;
CREATE TRIGGER trg_reply_count
  AFTER INSERT ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION fn_increment_reply_count();


-- ════════════════════════════════════════════════════════════
-- POPULATE IEA SCORES for all years 2017-2024
-- Run this once after migrations are applied to seed iea_scores
-- from the existing expenditure data.
-- ════════════════════════════════════════════════════════════

DO $$
DECLARE
  yr       int;
  v_count  bigint;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public_expenditures;

  IF v_count = 0 THEN
    RAISE NOTICE 'SKIP: public_expenditures is empty. Run ETL first, then CALL sp_populate_iea_scores(year).';
  ELSE
    FOR yr IN 2017..2024 LOOP
      CALL sp_populate_iea_scores(yr);
    END LOOP;
  END IF;
END;
$$;
