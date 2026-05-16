# AletheiaPath V2 — Bug Tracker & Known Limitations

## Status key
- 🔴 CRITICAL — data corruption or silent failure
- 🟠 HIGH — wrong output or crash under normal operation
- 🟡 MEDIUM — wrong output only under specific conditions
- 🟢 LOW — performance, dead code, or style
- ✅ FIXED — patched in current codebase

---

## Fixed Bugs

### ✅ fn_batch_compute_iea: 8× redundant function calls per country
**File:** `004_functions_triggers.sql`  
**Severity:** 🔴 CRITICAL (performance)  
**Root cause:** Each of 8 SELECT columns called `fn_compute_iea(c.id, year)` independently. With 20 countries that's 160 calls, each doing 2–3 SQL queries on a 640k-row table = up to 480 queries per batch.  
**Fix:** Replaced 8 column-level calls with a single `LATERAL (SELECT fn_compute_iea(...) AS result)` subquery per country.  
**Query reduction:** 480 → 60 queries per batch call.

---

### ✅ v_sector_yoy: LAG() evaluated 3 times per row
**File:** `002_aletheia_core.sql`  
**Severity:** 🟠 HIGH (performance)  
**Root cause:** The CASE expression repeated the same `LAG(total_amount) OVER (...)` window call 3 times in condition, numerator, and denominator. PostgreSQL may optimize but cannot guarantee deduplication across CASE branches.  
**Fix:** Wrapped in a CTE (`WITH lagged AS (...)`) so LAG is computed once and referenced by name.

---

### ✅ RLS policy existence checks missing tablename filter
**File:** `002_aletheia_core.sql`, `003_mistral_dynamic.sql`  
**Severity:** 🟠 HIGH (security)  
**Root cause:** `SELECT 1 FROM pg_policies WHERE policyname = '...'` without `AND tablename = '...'`. If any other table has a policy with the same name (e.g. an Supabase built-in), the check returns true and the correct policy is never created — leaving the table unprotected.  
**Fix:** Added `AND tablename = '<table>'` to all 10 policy existence checks.

---

### ✅ ETL KeyError on missing "Año Fin" Excel column
**File:** `backend/etl_load_excel.py`  
**Severity:** 🟠 HIGH (crash)  
**Root cause:** `df_pres["year_end_raw"]` accessed unconditionally after rename. If "Año Fin" is absent from the Excel sheet, the column rename is silently skipped and the subsequent access raises `KeyError`.  
**Fix:** Added `if "year_end_raw" in df_pres.columns` guard. Missing column defaults `year_end=None`, `is_current=False` with a console warning.

---

### ✅ fn_detect_expenditure_anomalies: dead 'normal' CASE branch
**File:** `004_functions_triggers.sql`  
**Severity:** 🟢 LOW (dead code)  
**Root cause:** WHERE clause already filters `ABS(yoy_pct_change) >= p_threshold_pct`, so the `ELSE 'normal'` branch is unreachable. Confusing and misleading.  
**Fix:** Reduced CASE to two branches: `yoy > 0 → 'spike'`, else `→ 'collapse'`.

---

### ✅ sp_populate_iea_scores auto-runs on empty table
**File:** `004_functions_triggers.sql`  
**Severity:** 🟡 MEDIUM (silent failure)  
**Root cause:** The end-of-migration DO block called `sp_populate_iea_scores` for 2017–2024 unconditionally. If migrations are applied before the ETL runs, all scores are silently skipped (insufficient_data) with no indication anything is wrong.  
**Fix:** DO block now checks `COUNT(*) FROM public_expenditures`. If empty, raises NOTICE and skips. Run `CALL sp_populate_iea_scores(year)` manually after ETL.

---

## Open Bugs

### 🟡 v_president_expenditure: hardcoded year_end fallback
**File:** `002_aletheia_core.sql`  
**Location:** `v_president_expenditure` view, JOIN condition  
**Problem:** `COALESCE(p.year_end, 2025)` is hardcoded. When 2026 expenditure data is loaded, current presidents won't appear in the view for 2026.  
**Workaround:** Update the view before loading each new fiscal year, replacing `2025` with the current max year. Or use `EXTRACT(YEAR FROM CURRENT_DATE)::int`.  
**Planned fix:** Replace hardcoded value with `EXTRACT(YEAR FROM CURRENT_DATE)::int`.

---

### 🟡 fn_compute_iea: pct_gdp fallback may mix scales
**File:** `004_functions_triggers.sql`  
**Problem:** Function tries pct_gdp first. If a country has partial pct_gdp coverage (some sectors in pct_gdp, others only in millions), the function uses pct_gdp-only totals. Sectors only reported in millions are silently excluded, making sector percentages incorrect.  
**Workaround:** Verify with:
```sql
SELECT country_id, fiscal_year, COUNT(DISTINCT scale) AS distinct_scales
FROM public_expenditures
GROUP BY country_id, fiscal_year
HAVING COUNT(DISTINCT scale) > 1;
```
If any country/year has multiple scales, IEA scores for that combination are unreliable.

---

### 🟡 political_stance: no check constraint, values may be non-standard
**File:** `001_schema_fixes.sql`  
**Problem:** The normalization UPDATE maps known values, but any unlisted stance (e.g. "liberal", "tecnocrata", "autoritario") passes through unchanged. No CHECK constraint was added to avoid blocking unknown values in the existing data.  
**Verify after ETL:**
```sql
SELECT DISTINCT political_stance, COUNT(*) FROM presidents
WHERE political_stance NOT IN ('left','center-left','center','center-right','right','populist')
  AND political_stance IS NOT NULL
GROUP BY political_stance;
```
Add missing values to `STANCE_MAP` in `etl_load_excel.py` and rerun if needed.

---

### 🟡 v_sector_yoy: YoY comparison skipped if scale changes between years
**File:** `002_aletheia_core.sql`  
**Problem:** The LAG window partitions by `(country_id, sector, scale)`. If a country's data for a sector shifts from `millions` to `pct_gdp` between years (e.g. ETL normalization changed), the LAG sees no prior year and `yoy_pct_change = NULL`. Anomaly detection misses that transition.  
**Workaround:** Verify scale consistency per country/sector over time:
```sql
SELECT country_id, sector, COUNT(DISTINCT scale) AS scale_count
FROM public_expenditures GROUP BY country_id, sector
HAVING COUNT(DISTINCT scale) > 1;
```

---

### 🟡 presidents_natural_key: UNIQUE constraint skipped on duplicate data
**File:** `001_schema_fixes.sql`  
**Problem:** The migration checks for duplicate rows before adding the UNIQUE constraint. If duplicates exist (from old ETL re-runs), the constraint is silently skipped and a NOTICE is raised. Presidents table remains without uniqueness enforcement.  
**Verify:**
```sql
SELECT country_id, full_name, year_start, COUNT(*)
FROM presidents
GROUP BY country_id, full_name, year_start
HAVING COUNT(*) > 1;
```
Deduplicate before re-running migration 001 if this query returns rows.

---

### 🟢 pg_constraint checks lack schema filter
**File:** `001_schema_fixes.sql`  
**Problem:** `SELECT 1 FROM pg_constraint WHERE conname = '...'` doesn't filter by `conrelid` (table OID) or schema. If another schema has a constraint with the same name, the check incorrectly skips adding the constraint.  
**Impact:** Extremely unlikely in a fresh Supabase project. Document-only.  
**Fix (if needed):** Add `AND conrelid = '<table>'::regclass` to each pg_constraint check.

---

### 🟢 00_limpieza_datos.ipynb is outdated
**File:** `backend/00_limpieza_datos.ipynb`  
**Problem:** Original notebook references old schema (missing `created_at`, wrong conflict keys, old table structure). Not used in current workflow but could mislead future contributors.  
**Action:** Either update to match V2 schema or delete.

---

### 🟢 updated_at trigger fires on every row during ETL bulk updates
**File:** `004_functions_triggers.sql`  
**Problem:** The `trg_updated_at` trigger is installed on `public_expenditures`. ETL re-runs do batch upserts on 640k rows — every row fires the trigger. Adds ~20-40% overhead to upsert time.  
**Workaround:** Disable trigger during ETL (`ALTER TABLE public_expenditures DISABLE TRIGGER trg_updated_at`), re-enable after (`ENABLE TRIGGER`). Requires superuser in Supabase — use service role.

---

## Schema Caveats

### public_expenditures.scale may have 'other' values
After migration 001 normalization, unrecognized scale values become `'other'`. Verify:
```sql
SELECT scale, COUNT(*) FROM public_expenditures
WHERE scale = 'other' GROUP BY scale;
```
Add missing mappings to `SCALE_MAP` in `etl_load_excel.py` and re-run ETL if count > 0.

### IEA pillar weights are estimates
Current weights (fiscal 30%, social 35%, transparency 20%, stability 15%) are reasonable LATAM benchmarks but not empirically calibrated. Cross-validate against:
- Transparency International CPI (global, annual)
- World Bank Worldwide Governance Indicators
- OECD Government at a Glance (where available)

### forum_replies.created_by is plain text
Not linked to `auth.users`. Any string is accepted. No user verification or spam protection. Acceptable for MVP, replace with UUID FK before production auth rollout.

---

## Agent System Caveats (future implementation)

- [ ] Signal decay rate (0.1/day) is fixed — needs empirical calibration per pattern_type
- [ ] GDELT keyword list is hardcoded in `lib/gdelt.ts` — should be DB-driven per country for precision
- [ ] Structural investigation capped at 100 signals — older signals excluded from cross-country analysis
- [ ] Source reputation uses 70/30 rolling average — Bayesian update model would be more statistically sound
- [ ] Cron jobs are Vercel-only — local dev requires manual POST to API routes to test scheduled behavior
- [ ] `factCheckArticle()` called non-blocking (fire-and-forget) — failures silent unless logs monitored
- [ ] No deduplication guard on `forum_threads` auto-creation — Insight Engine can create duplicate threads for same signal

---

## Migration Run Order

**Must be applied in sequence in Supabase SQL Editor:**
```
001_schema_fixes.sql       ← ALTER existing tables, fix ISO codes, add indexes
002_aletheia_core.sql      ← CREATE iea_scores, news_events, risk_signals, forum_*, views, RLS
003_mistral_dynamic.sql    ← CREATE country_profiles, fact_checks, investigation_runs, etc.
004_functions_triggers.sql ← CREATE functions, triggers; seeds iea_scores IF ETL already ran
```

**Correct run order for first-time setup:**
1. Apply migrations 001 → 002 → 003 → 004
2. Run `python backend/etl_load_excel.py` to load expenditure data
3. `CALL sp_populate_iea_scores(2023);` (repeat for each year) to seed IEA scores
4. Verify: `SELECT * FROM v_country_risk_dashboard;`

---

## Post-Migration Verification Queries

```sql
-- All countries have valid 3-char ISO codes
SELECT iso_alpha2, iso_alpha3 FROM countries
WHERE iso_alpha3 IS NULL OR length(iso_alpha3) != 3;

-- IEA scores seeded (should show 20+ rows with computed scores)
SELECT * FROM fn_batch_compute_iea(2023) ORDER BY iea_score;

-- Top expenditure anomalies 2023 (>50% YoY change)
SELECT iso3, country_name, sector, yoy_pct_change, anomaly_type
FROM fn_detect_expenditure_anomalies(50.0, 2023)
ORDER BY ABS(yoy_pct_change) DESC LIMIT 20;

-- RLS active on all tables
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN (
  'countries','presidents','public_expenditures','iea_scores',
  'news_events','risk_signals','forum_threads','forum_replies',
  'country_profiles','fact_checks','investigation_runs',
  'source_reputation','signal_health','pattern_links'
) ORDER BY tablename;

-- Risk dashboard (all active countries, shows nulls where data missing)
SELECT country_id, iso_alpha3, name_es, iea_score, bic_volatility,
       active_signals, recent_news_7d, current_president, political_stance
FROM v_country_risk_dashboard ORDER BY iea_score ASC NULLS LAST;

-- Political stance vs. expenditure cross-reference
SELECT political_stance, fiscal_year, sector, AVG(total_amount) as avg_spend
FROM v_president_expenditure
WHERE scale = 'pct_gdp'
GROUP BY political_stance, fiscal_year, sector
ORDER BY fiscal_year, political_stance, avg_spend DESC;

-- Unresolved scale values (should be 0 after ETL)
SELECT DISTINCT scale, COUNT(*) FROM public_expenditures
WHERE scale NOT IN ('thousands','millions','billions','pct_gdp','pct_total','per_capita','index')
GROUP BY scale;
```
