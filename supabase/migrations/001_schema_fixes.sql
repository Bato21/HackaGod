-- ============================================================
-- AletheiaPath V2 — Migration 001: Fix & enrich existing schema
-- Idempotent: safe to re-run on a live database
-- Applies to: countries, presidents, public_expenditures
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- COUNTRIES — enrich with geo/status/phase metadata
-- ════════════════════════════════════════════════════════════

ALTER TABLE countries ADD COLUMN IF NOT EXISTS region        text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS continent     text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS active        boolean       NOT NULL DEFAULT true;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS focus_phase   smallint      NOT NULL DEFAULT 1;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS capital       text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS latitude      numeric(8,4);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS longitude     numeric(8,4);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS gdelt_iso2    char(2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS flag_emoji    text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS created_at   timestamptz   NOT NULL DEFAULT now();
ALTER TABLE countries ADD COLUMN IF NOT EXISTS updated_at   timestamptz   NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'countries_focus_phase_check'
  ) THEN
    ALTER TABLE countries ADD CONSTRAINT countries_focus_phase_check
      CHECK (focus_phase BETWEEN 1 AND 3);
  END IF;
END $$;

-- Backfill region from presidents (most common value per country)
UPDATE countries c
SET region = sub.region
FROM (
  SELECT DISTINCT ON (country_id) country_id, region
  FROM presidents
  WHERE region IS NOT NULL
  ORDER BY country_id, region
) sub
WHERE sub.country_id = c.id AND c.region IS NULL;

-- Backfill continent from public_expenditures
UPDATE countries c
SET continent = sub.continent
FROM (
  SELECT DISTINCT ON (country_id) country_id, continent
  FROM public_expenditures
  WHERE continent IS NOT NULL AND country_id IS NOT NULL
  ORDER BY country_id, continent
) sub
WHERE sub.country_id = c.id AND c.continent IS NULL;

-- Correct ISO alpha-3 codes (ETL fallback generates invalid iso2+X codes)
UPDATE countries SET iso_alpha3 = CASE iso_alpha2
  WHEN 'AR' THEN 'ARG'  WHEN 'BO' THEN 'BOL'  WHEN 'BR' THEN 'BRA'
  WHEN 'CL' THEN 'CHL'  WHEN 'CO' THEN 'COL'  WHEN 'CR' THEN 'CRI'
  WHEN 'CU' THEN 'CUB'  WHEN 'DO' THEN 'DOM'  WHEN 'EC' THEN 'ECU'
  WHEN 'SV' THEN 'SLV'  WHEN 'GT' THEN 'GTM'  WHEN 'HN' THEN 'HND'
  WHEN 'MX' THEN 'MEX'  WHEN 'NI' THEN 'NIC'  WHEN 'PA' THEN 'PAN'
  WHEN 'PY' THEN 'PRY'  WHEN 'PE' THEN 'PER'  WHEN 'UY' THEN 'URY'
  WHEN 'VE' THEN 'VEN'  WHEN 'GY' THEN 'GUY'  WHEN 'SR' THEN 'SUR'
  WHEN 'HT' THEN 'HTI'  WHEN 'JM' THEN 'JAM'  WHEN 'TT' THEN 'TTO'
  ELSE iso_alpha3
END;

-- Add UNIQUE on iso_alpha3 only after fixing all values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'countries_iso_alpha3_key'
  ) THEN
    ALTER TABLE countries ADD CONSTRAINT countries_iso_alpha3_key UNIQUE (iso_alpha3);
  END IF;
END $$;

-- Capitals, coordinates, flags, GDELT codes
UPDATE countries SET
  capital      = CASE iso_alpha2
    WHEN 'AR' THEN 'Buenos Aires'          WHEN 'BO' THEN 'La Paz'
    WHEN 'BR' THEN 'Brasilia'              WHEN 'CL' THEN 'Santiago'
    WHEN 'CO' THEN 'Bogotá'               WHEN 'CR' THEN 'San José'
    WHEN 'CU' THEN 'La Habana'             WHEN 'DO' THEN 'Santo Domingo'
    WHEN 'EC' THEN 'Quito'                 WHEN 'SV' THEN 'San Salvador'
    WHEN 'GT' THEN 'Ciudad de Guatemala'   WHEN 'HN' THEN 'Tegucigalpa'
    WHEN 'MX' THEN 'Ciudad de México'      WHEN 'NI' THEN 'Managua'
    WHEN 'PA' THEN 'Ciudad de Panamá'      WHEN 'PY' THEN 'Asunción'
    WHEN 'PE' THEN 'Lima'                  WHEN 'UY' THEN 'Montevideo'
    WHEN 'VE' THEN 'Caracas'              WHEN 'GY' THEN 'Georgetown'
    WHEN 'SR' THEN 'Paramaribo'            WHEN 'HT' THEN 'Puerto Príncipe'
    WHEN 'JM' THEN 'Kingston'              WHEN 'TT' THEN 'Puerto España'
    ELSE capital
  END,
  latitude     = CASE iso_alpha2
    WHEN 'AR' THEN -38.4161  WHEN 'BO' THEN -16.2902  WHEN 'BR' THEN -14.2350
    WHEN 'CL' THEN -35.6751  WHEN 'CO' THEN   4.5709  WHEN 'CR' THEN   9.7489
    WHEN 'CU' THEN  21.5218  WHEN 'DO' THEN  18.7357  WHEN 'EC' THEN  -1.8312
    WHEN 'SV' THEN  13.7942  WHEN 'GT' THEN  15.7835  WHEN 'HN' THEN  15.2000
    WHEN 'MX' THEN  23.6345  WHEN 'NI' THEN  12.8654  WHEN 'PA' THEN   8.5380
    WHEN 'PY' THEN -23.4425  WHEN 'PE' THEN  -9.1900  WHEN 'UY' THEN -32.5228
    WHEN 'VE' THEN   6.4238  WHEN 'GY' THEN   4.8604  WHEN 'SR' THEN   3.9193
    WHEN 'HT' THEN  18.9712  WHEN 'JM' THEN  18.1096  WHEN 'TT' THEN  10.6918
    ELSE latitude
  END,
  longitude    = CASE iso_alpha2
    WHEN 'AR' THEN  -63.6167  WHEN 'BO' THEN  -63.5887  WHEN 'BR' THEN -51.9253
    WHEN 'CL' THEN  -71.5430  WHEN 'CO' THEN  -74.2973  WHEN 'CR' THEN -83.7534
    WHEN 'CU' THEN  -77.7812  WHEN 'DO' THEN  -70.1627  WHEN 'EC' THEN -78.1834
    WHEN 'SV' THEN  -88.8965  WHEN 'GT' THEN  -90.2308  WHEN 'HN' THEN -86.2419
    WHEN 'MX' THEN -102.5528  WHEN 'NI' THEN  -85.2072  WHEN 'PA' THEN -80.7821
    WHEN 'PY' THEN  -58.4438  WHEN 'PE' THEN  -75.0152  WHEN 'UY' THEN -55.7658
    WHEN 'VE' THEN  -66.5897  WHEN 'GY' THEN  -58.9302  WHEN 'SR' THEN -56.0278
    WHEN 'HT' THEN  -72.2852  WHEN 'JM' THEN  -77.2975  WHEN 'TT' THEN -61.2225
    ELSE longitude
  END,
  flag_emoji   = CASE iso_alpha2
    WHEN 'AR' THEN '🇦🇷'  WHEN 'BO' THEN '🇧🇴'  WHEN 'BR' THEN '🇧🇷'
    WHEN 'CL' THEN '🇨🇱'  WHEN 'CO' THEN '🇨🇴'  WHEN 'CR' THEN '🇨🇷'
    WHEN 'CU' THEN '🇨🇺'  WHEN 'DO' THEN '🇩🇴'  WHEN 'EC' THEN '🇪🇨'
    WHEN 'SV' THEN '🇸🇻'  WHEN 'GT' THEN '🇬🇹'  WHEN 'HN' THEN '🇭🇳'
    WHEN 'MX' THEN '🇲🇽'  WHEN 'NI' THEN '🇳🇮'  WHEN 'PA' THEN '🇵🇦'
    WHEN 'PY' THEN '🇵🇾'  WHEN 'PE' THEN '🇵🇪'  WHEN 'UY' THEN '🇺🇾'
    WHEN 'VE' THEN '🇻🇪'  WHEN 'GY' THEN '🇬🇾'  WHEN 'SR' THEN '🇸🇷'
    WHEN 'HT' THEN '🇭🇹'  WHEN 'JM' THEN '🇯🇲'  WHEN 'TT' THEN '🇹🇹'
    ELSE flag_emoji
  END,
  -- GDELT v2 uses ISO 3166-1 alpha-2 for sourcecountry filter
  gdelt_iso2   = iso_alpha2,
  -- All LATAM countries are phase 1
  focus_phase  = 1,
  continent    = COALESCE(continent, 'America'),
  region       = COALESCE(region, 'Latin America');


-- ════════════════════════════════════════════════════════════
-- PUBLIC_EXPENDITURES — add PK, normalize scale, add timestamps
-- ════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'public_expenditures' AND column_name = 'id'
  ) THEN
    ALTER TABLE public_expenditures ADD COLUMN id uuid DEFAULT gen_random_uuid();
    UPDATE public_expenditures SET id = gen_random_uuid() WHERE id IS NULL;
    ALTER TABLE public_expenditures ALTER COLUMN id SET NOT NULL;
    ALTER TABLE public_expenditures ADD PRIMARY KEY (id);
  END IF;
END $$;

ALTER TABLE public_expenditures ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public_expenditures ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Normalize scale to controlled vocabulary
UPDATE public_expenditures
SET scale = CASE
  WHEN LOWER(TRIM(COALESCE(scale,''))) IN ('thousands','thousands of local currency','miles','thousand') THEN 'thousands'
  WHEN LOWER(TRIM(COALESCE(scale,''))) IN ('millions','millions of local currency','millones','million')  THEN 'millions'
  WHEN LOWER(TRIM(COALESCE(scale,''))) IN ('billions','billions of local currency','billion')             THEN 'billions'
  WHEN LOWER(TRIM(COALESCE(scale,''))) IN ('% of gdp','percent of gdp','% pib','%gdp','pct_gdp')        THEN 'pct_gdp'
  WHEN LOWER(TRIM(COALESCE(scale,''))) IN ('% of total','percent of total','% total','pct_total')        THEN 'pct_total'
  WHEN LOWER(TRIM(COALESCE(scale,''))) IN ('per capita','per person','per hab')                          THEN 'per_capita'
  WHEN LOWER(TRIM(COALESCE(scale,''))) IN ('index','indice','índice')                                   THEN 'index'
  ELSE 'other'
END
WHERE scale IS NOT NULL;

-- ════════════════════════════════════════════════════════════
-- PRESIDENTS — unique constraint, normalize stance, timestamps
-- ════════════════════════════════════════════════════════════

ALTER TABLE presidents ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE presidents ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Normalize political_stance to English controlled vocabulary
UPDATE presidents
SET political_stance = CASE LOWER(TRIM(COALESCE(political_stance,'')))
  WHEN 'izquierda'      THEN 'left'
  WHEN 'left'           THEN 'left'
  WHEN 'centro-izquierda' THEN 'center-left'
  WHEN 'center-left'   THEN 'center-left'
  WHEN 'centro'        THEN 'center'
  WHEN 'center'        THEN 'center'
  WHEN 'centro-derecha' THEN 'center-right'
  WHEN 'center-right'  THEN 'center-right'
  WHEN 'derecha'       THEN 'right'
  WHEN 'right'         THEN 'right'
  WHEN 'populista'     THEN 'populist'
  WHEN 'populist'      THEN 'populist'
  ELSE political_stance
END
WHERE political_stance IS NOT NULL;

-- Add unique key only if no duplicates exist
DO $$
DECLARE v_dups int;
BEGIN
  SELECT COUNT(*) INTO v_dups FROM (
    SELECT country_id, full_name, year_start, COUNT(*)
    FROM presidents
    GROUP BY country_id, full_name, year_start
    HAVING COUNT(*) > 1
  ) sub;

  IF v_dups = 0 THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'presidents_natural_key'
    ) THEN
      ALTER TABLE presidents ADD CONSTRAINT presidents_natural_key
        UNIQUE (country_id, full_name, year_start);
    END IF;
  ELSE
    RAISE NOTICE '% duplicate president rows — deduplicate before adding UNIQUE constraint', v_dups;
  END IF;
END $$;


-- ════════════════════════════════════════════════════════════
-- INDEXES
-- ════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_countries_iso3    ON countries(iso_alpha3);
CREATE INDEX IF NOT EXISTS idx_countries_iso2    ON countries(iso_alpha2);
CREATE INDEX IF NOT EXISTS idx_countries_active  ON countries(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_countries_phase   ON countries(focus_phase);

CREATE INDEX IF NOT EXISTS idx_presidents_country     ON presidents(country_id);
CREATE INDEX IF NOT EXISTS idx_presidents_current     ON presidents(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_presidents_year_start  ON presidents(year_start);
CREATE INDEX IF NOT EXISTS idx_presidents_stance      ON presidents(political_stance);

CREATE INDEX IF NOT EXISTS idx_pubexp_country_year  ON public_expenditures(country_id, fiscal_year);
CREATE INDEX IF NOT EXISTS idx_pubexp_sector        ON public_expenditures(sector);
CREATE INDEX IF NOT EXISTS idx_pubexp_indicator     ON public_expenditures(indicator);
CREATE INDEX IF NOT EXISTS idx_pubexp_fiscal_year   ON public_expenditures(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_pubexp_scale         ON public_expenditures(scale);
-- Partial index for GDP-relative analysis (most used in IEA computation)
CREATE INDEX IF NOT EXISTS idx_pubexp_pct_gdp ON public_expenditures(country_id, fiscal_year, sector)
  WHERE scale = 'pct_gdp';
