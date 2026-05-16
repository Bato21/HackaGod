# AletheiaPath V2

Investigative intelligence platform for institutional corruption in Latin America. Tracks public expenditure anomalies, political alignment patterns, and real-time corruption signals across 20+ LATAM countries. Combines structured fiscal data with Mistral AI narrative analysis to produce journalist-quality country dossiers and community-driven investigation threads.

---

## What this project does

AletheiaPath ingests government expenditure data (2017–2025, ~640k rows across 20+ LATAM countries), computes an **Institutional Effectiveness Assessment (IEA)** score per country per year from four pillars — fiscal discipline, social investment, data transparency, and sector stability — and exposes everything through a Next.js frontend backed by Supabase.

Three Mistral AI agents run on schedule via Vercel Cron + Make.com webhooks:

| Agent | Schedule | What it does |
|---|---|---|
| **Fact-Checker** | On every article | Validates claims in GDELT news against known institutional/legislative facts |
| **Periodic Investigator** | Light: 6h / Deep: 72h / Structural: weekly | Pulls fresh GDELT articles, classifies them, updates country risk profiles |
| **Insight Engine** | On Make.com trigger | Takes structured signal data → produces journalist-ready narrative + auto-creates forum thread |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Backend DB | Supabase (PostgreSQL 15) |
| AI | Mistral via OpenRouter (`mistral-small`, `mistral-nemo`, `mistral-large`) |
| News source | GDELT 2.0 (free, no API key) |
| Automation | Make.com webhooks |
| Cron | Vercel Cron Jobs |
| ETL | Python 3.12 (pandas, pycountry, supabase-py) |
| Data source | Excel workbook (~640k rows public expenditure) |

---

## Repository layout

```
HackaGod/
├── backend/
│   ├── etl_load_excel.py                    # Main ETL: Excel → Supabase (run this to load data)
│   ├── 00_limpieza_datos.ipynb              # Legacy notebook — outdated, do not use
│   └── BASE_COMPLETA_CORREGIDA_CON_TODOS_LOS_DATOS.xlsx   # Source data
│
├── supabase/
│   └── migrations/
│       ├── 001_schema_fixes.sql             # Fix + enrich countries, presidents, public_expenditures
│       ├── 002_aletheia_core.sql            # Core tables: iea_scores, news_events, risk_signals, forum
│       ├── 003_mistral_dynamic.sql          # Agent tables: country_profiles, fact_checks, signal_health, etc.
│       └── 004_functions_triggers.sql       # IEA computation, anomaly detection, auto-triggers
│
├── requirements.txt                         # Python deps (pycountry required, not optional)
├── package.json                             # Node deps: openai, node-cron
├── .mcp.json                                # Supabase MCP config (project: yiqxyfesywdswtcjaqeq)
└── bugs.md                                  # Bug tracker and known limitations
```

**Frontend and agent code** (Next.js + lib/agents/) live in a separate repo not yet published. When the frontend repo is added, the agent files belong at:
```
lib/
├── openrouter.ts                  # Shared Mistral client + mistralCall() wrapper
├── gdelt.ts                       # GDELT 2.0 fetch + dedup helpers
└── agents/
    ├── mistral-factchecker.ts     # Fact-Checker agent
    ├── mistral-investigator.ts    # Periodic Investigator (light/deep/structural)
    └── mistral-insight.ts         # Insight Engine (Make.com → narrative + forum thread)
```

---

## Database schema

### Core tables (always present)

| Table | Rows | Description |
|---|---|---|
| `countries` | ~22 | LATAM countries with ISO codes, coordinates, flags, phase |
| `presidents` | 377 | Political leaders 2017–present with party/stance/system |
| `public_expenditures` | ~640k | Fiscal data (wide→long pivot, 2017–2025) |

### Platform tables (created by migrations 002–003)

| Table | Owner | Description |
|---|---|---|
| `iea_scores` | SQL fn + Mistral | IEA + BIC score per country per year |
| `news_events` | Mistral investigator | GDELT articles classified by corruption type |
| `risk_signals` | Mistral investigator | Active corruption patterns with evidence count |
| `forum_threads` | Mistral insight engine | Auto-created discussion threads per signal |
| `forum_replies` | Users + Mistral | Community responses + analyst replies |
| `country_profiles` | Mistral deep investigation | Narrative dossier per country (72h cadence) |
| `fact_checks` | Mistral fact-checker | Per-article confidence + verdict |
| `investigation_runs` | Mistral investigator | Audit log with token cost per run |
| `source_reputation` | Mistral fact-checker | Domain trust scores, rolling weighted average |
| `signal_health` | Auto-trigger + investigator | Severity decay tracking (auto-init on signal insert) |
| `pattern_links` | Mistral structural | Cross-country corruption DNA links |

### Analytical views

| View | Purpose |
|---|---|
| `v_sector_totals` | SUM(amount) per country/year/sector/scale |
| `v_sector_yoy` | Year-over-year % change per sector (LAG-based) |
| `v_president_expenditure` | Expenditure during each president's tenure |
| `v_country_risk_dashboard` | Single-row-per-country dashboard (frontend card data) |

### Key SQL functions

| Function | Usage |
|---|---|
| `fn_compute_iea(country_id, year)` | Returns jsonb with 4-pillar IEA score from expenditure data |
| `fn_batch_compute_iea(year)` | All active countries ranked by IEA — use for debugging |
| `sp_populate_iea_scores(year)` | Seeds iea_scores table for a given fiscal year |
| `fn_detect_expenditure_anomalies(threshold, year)` | Sectors with YoY change above threshold |

---

## IEA Score methodology

Each pillar is 0–100 (higher = healthier institution). Composite is weighted average.

| Pillar | Weight | How computed |
|---|---|---|
| Fiscal discipline | 30% | Penalize admin overhead > 15% and security > 25% of total spend |
| Social investment | 35% | Reward health + education combined ≥ 22% of total spend |
| Data transparency | 20% | Proxy: indicator count per country/year vs. baseline of 40 |
| Sector stability | 15% | Lower average YoY variance across sectors = higher stability |

**Data preference order:** `pct_gdp` → fallback to `millions`. Never mix scales in a single computation.

**BIC (Baseline Integrity Confidence):** Band around IEA score (`bic_low`, `bic_high`) computed by the Mistral Periodic Investigator based on news signal count and active risk signal severity. Width: low=±3, medium=±6, high=±12.

---

## First-time setup

### 1. Python environment

```bash
cd HackaGod
pip install -r requirements.txt
```

Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://yiqxyfesywdswtcjaqeq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

### 2. Apply migrations

Open Supabase SQL Editor (`https://supabase.com/dashboard/project/yiqxyfesywdswtcjaqeq/sql`) and run each file **in order**:

```
001_schema_fixes.sql
002_aletheia_core.sql
003_mistral_dynamic.sql
004_functions_triggers.sql
```

**Important:** Migration 004 auto-seeds IEA scores. If `public_expenditures` is empty when 004 runs, the seed is skipped (it warns you). Run the ETL first if that happens.

### 3. Run ETL

```bash
cd backend
python etl_load_excel.py
```

Expected output:
```
✅ Conectado a Supabase: https://...
  [countries] Lote 1/1 — 22 filas ✓
  [presidents] Lote 1/1 — 377 filas ✓
  [public_expenditures] Lote 1/1282 — 500 filas ✓
  ...
✅ ETL V2 COMPLETO
```

### 4. Seed IEA scores (if 004 ran before ETL)

In the Supabase SQL Editor:
```sql
DO $$
DECLARE yr int;
BEGIN
  FOR yr IN 2017..2024 LOOP
    CALL sp_populate_iea_scores(yr);
  END LOOP;
END;
$$;
```

### 5. Verify

```sql
-- Dashboard check (should show IEA scores for all countries)
SELECT iso_alpha3, name_es, iea_score, active_signals, current_president
FROM v_country_risk_dashboard
ORDER BY iea_score ASC;

-- Top anomalies detected in expenditure data
SELECT * FROM fn_detect_expenditure_anomalies(50.0, 2023) LIMIT 10;
```

---

## Environment variables

### Required for ETL (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

### Required for frontend + agents (`.env.local`, when frontend is added)
```
# OpenRouter (Mistral via OpenRouter)
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_SITE_URL=https://aletheia-path.com
OPENROUTER_SITE_NAME=AletheiaPath

# Mistral model aliases (change here to upgrade globally)
MISTRAL_FAST=mistralai/mistral-small
MISTRAL_BALANCED=mistralai/mistral-nemo
MISTRAL_POWERFUL=mistralai/mistral-large

# Investigation schedule
INVESTIGATION_INTERVAL_LIGHT=6      # hours
INVESTIGATION_INTERVAL_DEEP=72
INVESTIGATION_INTERVAL_STRUCTURAL=168

# Fact-check thresholds
FACTCHECK_MIN_CONFIDENCE=0.65
FACTCHECK_CORROBORATION_HOURS=48
SOURCE_TRUST_CACHE_DAYS=7

# Cron auth
CRON_SECRET=
```

---

## Data sources

| Source | Data | Access |
|---|---|---|
| Excel workbook | ~640k public expenditure rows, 2017–2025, 20+ LATAM countries | Manual, local file |
| GDELT 2.0 | Real-time global news articles filtered by country + corruption keywords | Free API, no key |
| Make.com | Webhook triggers for signal events and insight generation | Paid, configured separately |
| Supabase | All computed analytics, agent outputs, user forum content | `yiqxyfesywdswtcjaqeq` |

**GDELT query strategy:** `(corruption OR corrupción OR soborno OR fraude OR nepotismo OR ...) sourcecountry:<ISO2>` filtered to the last N hours. Country ISO2 stored in `countries.gdelt_iso2`.

---

## Agent system overview

### Fact-Checker
- Triggered on every article ingestion
- Uses `mistral-small` (cheap, fast)
- Checks institutional validity, legislative validity, statistical plausibility
- Builds corroboration score from matching articles in last 48h
- Updates `fact_checks` table and `source_reputation` rolling average
- If verdict = `rejected`: sets `news_events.verified = false` (soft delete)

### Periodic Investigator
Three modes, all write to `investigation_runs` for audit:

**Light (every 6h):** GDELT → classify → fact-check → recalculate BIC. Uses `mistral-small`.

**Deep (every 72h):** 7-day GDELT window → synthesize all verified events → generate narrative → write `country_profiles`. Uses `mistral-large`.

**Structural (weekly):** All active signals across all countries → find cross-country patterns → write `pattern_links`. Uses `mistral-large`.

### Insight Engine
- Triggered by Make.com after a signal is created or BIC changes
- Uses `mistral-nemo` (multilingual, Spanish output)
- Enriches Make payload with live DB context (IEA, active signals, trajectory)
- Returns: headline, context, significance, 3 things to watch, forum thread title, alert level
- Auto-creates a `forum_threads` entry with the generated title

---

## Signal lifecycle

```
GDELT article
    → Mistral classify (light investigator)
        → fact_checks (fact-checker, async)
            → source_reputation update
        → news_events row (verified=true if confidence ≥ 0.65)
            → risk_signals created when pattern detected
                → signal_health auto-init (trigger)
                → forum_thread auto-created (insight engine)
                    → pattern_links updated (structural investigator, weekly)
                        → signal severity decays 0.1/day without reinforcement
                            → signal resolved if severity ≤ 1 and age > 30 days
```

---

## Supabase MCP

Project is configured for Claude Code MCP access:
```json
{ "mcpServers": { "supabase": { "type": "http", "url": "https://mcp.supabase.com/mcp?project_ref=yiqxyfesywdswtcjaqeq" } } }
```

To authenticate in a new session: run `claude /mcp` in a terminal → select `supabase` → Authenticate.

---

## Known issues

See `bugs.md` for the full tracker. Key open items:

- `v_president_expenditure` hardcodes `year_end = 2025` — breaks when 2026 data loads
- `fn_compute_iea` may exclude sectors if a country's data mixes `pct_gdp` and `millions` scales
- `political_stance` has no check constraint — unlisted values pass through
- `updated_at` trigger fires on every row during ETL bulk upserts (acceptable for current data size)

---

## Git branches

| Branch | Purpose |
|---|---|
| `main` | Stable, frontend-ready |
| `backend` | Current: schema + ETL development |

Migrations and ETL work happens on `backend`. Merge to `main` only after verification queries pass.

---

## Supabase project

- **Project ref:** `yiqxyfesywdswtcjaqeq`
- **Dashboard:** `https://supabase.com/dashboard/project/yiqxyfesywdswtcjaqeq`
- **SQL Editor:** `https://supabase.com/dashboard/project/yiqxyfesywdswtcjaqeq/sql`
- **Table Editor:** `https://supabase.com/dashboard/project/yiqxyfesywdswtcjaqeq/editor`
