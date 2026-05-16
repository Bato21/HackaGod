"""
AletheiaPath V2 — ETL: Excel → Supabase
Ejecutar desde /backend con:
    python etl_load_excel.py

Requisitos: pip install -r ../requirements.txt
Schema target: migrations 001-004 deben estar aplicadas.
"""

import os
import math
import numpy as np
import pandas as pd
import pycountry                           # now required, not optional
from dotenv import load_dotenv, find_dotenv
from supabase import create_client, Client

# ── CONFIG ────────────────────────────────────────────────────────────────────

EXCEL_PATH  = "BASE_COMPLETA_CORREGIDA_CON_TODOS_LOS_DATOS.xlsx"
BATCH_SIZE  = 500
YEAR_COLS   = [str(y) for y in range(2017, 2026)]          # '2017'..'2025'
MIN_YEAR    = 2017
MAX_YEAR    = 2025

# Normalized scale vocabulary (must match migration 001 check constraint)
SCALE_MAP = {
    "thousands": "thousands", "thousands of local currency": "thousands",
    "miles": "thousands", "thousand": "thousands",
    "millions": "millions", "millions of local currency": "millions",
    "millones": "millions", "million": "millions",
    "billions": "billions", "billions of local currency": "billions", "billion": "billions",
    "% of gdp": "pct_gdp", "percent of gdp": "pct_gdp",
    "% pib": "pct_gdp", "%gdp": "pct_gdp", "pct_gdp": "pct_gdp",
    "% of total": "pct_total", "percent of total": "pct_total",
    "% total": "pct_total", "pct_total": "pct_total",
    "per capita": "per_capita", "per person": "per_capita", "per hab": "per_capita",
    "index": "index", "indice": "index", "índice": "index",
}

STANCE_MAP = {
    "izquierda": "left", "left": "left",
    "centro-izquierda": "center-left", "center-left": "center-left",
    "centro": "center", "center": "center",
    "centro-derecha": "center-right", "center-right": "center-right",
    "derecha": "right", "right": "right",
    "populista": "populist", "populist": "populist",
}

# ── ENV ───────────────────────────────────────────────────────────────────────

dotenv_path = find_dotenv(".env.local")
if not dotenv_path:
    raise FileNotFoundError(".env.local no encontrado — debe estar en la raíz del proyecto.")
load_dotenv(dotenv_path)

supabase: Client = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"],
)
print(f"✅ Conectado a Supabase: {os.environ['NEXT_PUBLIC_SUPABASE_URL']}")

# ═════════════════════════════════════════════════════════════════════════════
# HELPERS
# ═════════════════════════════════════════════════════════════════════════════

def sanitize_record(record: dict) -> dict:
    """Converts numpy types → Python natives; NaN/None/NA → None.
    Float columns that are integer-valued (e.g. 2021.0) cast to int."""
    out = {}
    for k, v in record.items():
        if v is None:
            out[k] = None
        elif isinstance(v, np.bool_):
            out[k] = bool(v)
        elif isinstance(v, np.integer):
            out[k] = int(v)
        elif isinstance(v, np.floating):
            out[k] = None if np.isnan(v) else float(v)
        elif isinstance(v, float):
            if math.isnan(v):
                out[k] = None
            elif v == int(v):
                out[k] = int(v)
            else:
                out[k] = v
        elif hasattr(pd, 'isna') and pd.isna(v):
            out[k] = None
        else:
            out[k] = v
    return out


def batch_upsert(
    table: str,
    records: list[dict],
    batch_size: int = BATCH_SIZE,
    on_conflict: str | None = None,
) -> int:
    """Idempotent batch upsert. Returns count of successfully upserted rows."""
    total   = len(records)
    batches = math.ceil(total / batch_size) if total > 0 else 0
    success = 0
    errors  = []

    for i in range(batches):
        chunk = records[i * batch_size: (i + 1) * batch_size]
        try:
            kwargs = {"on_conflict": on_conflict} if on_conflict else {}
            supabase.table(table).upsert(chunk, **kwargs).execute()
            success += len(chunk)
            print(f"  [{table}] Lote {i+1}/{batches} — {len(chunk)} filas ✓")
        except Exception as e:
            print(f"  [{table}] Lote {i+1}/{batches} — ERROR: {e}")
            errors.append({"batch": i + 1, "error": str(e)})

    if errors:
        print(f"\n⚠️  {len(errors)} lote(s) fallaron en '{table}':")
        for err in errors:
            print(f"   Lote {err['batch']}: {err['error']}")
    elif total > 0:
        print(f"\n✅ '{table}' completada: {success}/{total} registros en {batches} lotes.\n")

    return success


def resolve_iso(iso2: str) -> tuple[str | None, str | None]:
    """Returns (iso_alpha3, name_en) for a given iso_alpha2. Requires pycountry."""
    try:
        c = pycountry.countries.get(alpha_2=iso2.upper())
        if c:
            return c.alpha_3, c.name
    except Exception:
        pass
    return None, None


def normalize_scale(raw: str | None) -> str:
    if not raw or pd.isna(raw):
        return "other"
    return SCALE_MAP.get(str(raw).strip().lower(), "other")


def normalize_stance(raw: str | None) -> str | None:
    if not raw or pd.isna(raw):
        return None
    return STANCE_MAP.get(str(raw).strip().lower(), str(raw).strip().lower())


def parse_year(val) -> int | None:
    if pd.isna(val):
        return None
    val = str(val).strip()
    if val.lower() in ("presente", "present", "actual", "-", ""):
        return None
    try:
        return int(float(val))
    except ValueError:
        return None


# ═════════════════════════════════════════════════════════════════════════════
# PASO 0 — LIMPIAR DATOS PREVIOS (idempotent reset)
# ═════════════════════════════════════════════════════════════════════════════

print("\n🗑️  Vaciando tablas antes de recargar...")

for tbl, filter_col, filter_val in [
    ("presidents",           "year_start",  0),
    ("countries",            "iso_alpha2",  ""),
]:
    try:
        op = supabase.table(tbl)
        if filter_col == "year_start":
            op.delete().gte(filter_col, filter_val).execute()
        else:
            op.delete().neq(filter_col, filter_val).execute()
        print(f"  ✓ {tbl} vaciada")
    except Exception as e:
        print(f"  ⚠️ {tbl}: {e}")

# public_expenditures: delete by year to avoid timeout (640k+ rows)
print("  Borrando public_expenditures por año fiscal...")
for yr in range(MIN_YEAR, MAX_YEAR + 1):
    try:
        supabase.table("public_expenditures").delete().eq("fiscal_year", yr).execute()
        print(f"    fiscal_year={yr} ✓")
    except Exception as e:
        print(f"    fiscal_year={yr} ERROR: {e}")


# ═════════════════════════════════════════════════════════════════════════════
# PASO 1 — COUNTRIES
# Reads from both sheets: "Presidentes Completo" for ISO + name,
# "Base con continentes" for continent.
# Enriches with: iso_alpha3, name_en (pycountry), capital, lat/lon,
#                flag_emoji, gdelt_iso2, region, continent.
# ═════════════════════════════════════════════════════════════════════════════

print("\n══════════════════════════════════════════")
print(" ETL 1/3 — Tabla 'countries'")
print("══════════════════════════════════════════")

df_pres_raw = pd.read_excel(EXCEL_PATH, sheet_name="Presidentes Completo", dtype=str)
df_pres_raw.columns = df_pres_raw.columns.str.strip()

df_iso = df_pres_raw[["País", "Código País", "Región"]].copy()
df_iso.columns = ["name_es", "iso_alpha2", "region"]
df_iso["iso_alpha2"] = df_iso["iso_alpha2"].str.strip().str.upper()
df_iso["name_es"]    = df_iso["name_es"].str.strip()
df_iso["region"]     = df_iso["region"].str.strip() if "Región" in df_pres_raw.columns else None
df_iso = df_iso.dropna(subset=["iso_alpha2"]).drop_duplicates("iso_alpha2")

# Continent from expenditure sheet
df_cont = pd.read_excel(EXCEL_PATH, sheet_name="Base con continentes",
                        usecols=["COUNTRY", "CONTINENTE"], dtype=str)
df_cont.columns = ["country_name_raw", "continent"]
df_cont["continent"] = df_cont["continent"].str.strip()
continent_map: dict[str, str] = {}
for _, r in df_cont.dropna(subset=["continent"]).iterrows():
    continent_map[str(r["country_name_raw"]).strip()] = r["continent"]

# Per-country geo data (hardcoded for LATAM — avoids API dependency)
GEO: dict[str, dict] = {
    "AR": {"capital": "Buenos Aires",       "lat": -38.4161, "lon": -63.6167, "flag": "🇦🇷"},
    "BO": {"capital": "La Paz",             "lat": -16.2902, "lon": -63.5887, "flag": "🇧🇴"},
    "BR": {"capital": "Brasilia",           "lat": -14.2350, "lon": -51.9253, "flag": "🇧🇷"},
    "CL": {"capital": "Santiago",           "lat": -35.6751, "lon": -71.5430, "flag": "🇨🇱"},
    "CO": {"capital": "Bogotá",            "lat":   4.5709, "lon": -74.2973, "flag": "🇨🇴"},
    "CR": {"capital": "San José",           "lat":   9.7489, "lon": -83.7534, "flag": "🇨🇷"},
    "CU": {"capital": "La Habana",          "lat":  21.5218, "lon": -77.7812, "flag": "🇨🇺"},
    "DO": {"capital": "Santo Domingo",      "lat":  18.7357, "lon": -70.1627, "flag": "🇩🇴"},
    "EC": {"capital": "Quito",              "lat":  -1.8312, "lon": -78.1834, "flag": "🇪🇨"},
    "SV": {"capital": "San Salvador",       "lat":  13.7942, "lon": -88.8965, "flag": "🇸🇻"},
    "GT": {"capital": "Ciudad de Guatemala","lat":  15.7835, "lon": -90.2308, "flag": "🇬🇹"},
    "HN": {"capital": "Tegucigalpa",        "lat":  15.2000, "lon": -86.2419, "flag": "🇭🇳"},
    "MX": {"capital": "Ciudad de México",   "lat":  23.6345, "lon":-102.5528, "flag": "🇲🇽"},
    "NI": {"capital": "Managua",            "lat":  12.8654, "lon": -85.2072, "flag": "🇳🇮"},
    "PA": {"capital": "Ciudad de Panamá",   "lat":   8.5380, "lon": -80.7821, "flag": "🇵🇦"},
    "PY": {"capital": "Asunción",          "lat": -23.4425, "lon": -58.4438, "flag": "🇵🇾"},
    "PE": {"capital": "Lima",               "lat":  -9.1900, "lon": -75.0152, "flag": "🇵🇪"},
    "UY": {"capital": "Montevideo",         "lat": -32.5228, "lon": -55.7658, "flag": "🇺🇾"},
    "VE": {"capital": "Caracas",           "lat":   6.4238, "lon": -66.5897, "flag": "🇻🇪"},
    "GY": {"capital": "Georgetown",         "lat":   4.8604, "lon": -58.9302, "flag": "🇬🇾"},
    "SR": {"capital": "Paramaribo",         "lat":   3.9193, "lon": -56.0278, "flag": "🇸🇷"},
    "HT": {"capital": "Puerto Príncipe",    "lat":  18.9712, "lon": -72.2852, "flag": "🇭🇹"},
    "JM": {"capital": "Kingston",           "lat":  18.1096, "lon": -77.2975, "flag": "🇯🇲"},
    "TT": {"capital": "Puerto España",      "lat":  10.6918, "lon": -61.2225, "flag": "🇹🇹"},
}

countries_records = []
for _, row in df_iso.iterrows():
    iso2    = row["iso_alpha2"]
    name_es = row["name_es"]
    iso3, name_en = resolve_iso(iso2)

    if iso3 is None:
        print(f"  ⚠️  pycountry sin mapeo para iso2={iso2} — se omite iso3")
        iso3 = None

    geo = GEO.get(iso2, {})

    # Try to find continent from expenditure data
    continent = continent_map.get(name_es) or continent_map.get(name_en or "") or "America"

    countries_records.append({
        "iso_alpha2":  iso2,
        "iso_alpha3":  iso3,
        "name_es":     name_es,
        "name_en":     name_en or name_es,
        "region":      row.get("region") or "Latin America",
        "continent":   continent,
        "capital":     geo.get("capital"),
        "latitude":    geo.get("lat"),
        "longitude":   geo.get("lon"),
        "flag_emoji":  geo.get("flag"),
        "gdelt_iso2":  iso2,        # GDELT v2 uses ISO 3166-1 alpha-2
        "active":      True,
        "focus_phase": 1,           # Phase 1 = LATAM
    })

print(f"📊 Países: {len(countries_records)}")
batch_upsert("countries", countries_records, on_conflict="iso_alpha2")


# ═════════════════════════════════════════════════════════════════════════════
# PASO 2 — PRESIDENTS
# Normalize political_stance to English controlled vocabulary.
# Upsert on natural key (country_id, full_name, year_start).
# ═════════════════════════════════════════════════════════════════════════════

print("══════════════════════════════════════════")
print(" ETL 2/3 — Tabla 'presidents'")
print("══════════════════════════════════════════")

# Reload since we already read it above
df_pres = df_pres_raw.copy()

col_map_pres = {
    "País":              "country_name_raw",
    "Código País":       "iso_alpha2",
    "Región":            "region",
    "Nombre":            "full_name",
    "Año Inicio":        "year_start",
    "Año Fin":           "year_end_raw",
    "Postura Política":  "political_stance",
    "Partido":           "party",
    "Sistema Político":  "political_system",
}
df_pres = df_pres.rename(columns={k: v for k, v in col_map_pres.items() if k in df_pres.columns})

df_pres["iso_alpha2"]      = df_pres["iso_alpha2"].str.strip().str.upper()
df_pres["full_name"]       = df_pres["full_name"].str.strip()
df_pres["year_start"]      = df_pres["year_start"].apply(parse_year)
if "year_end_raw" in df_pres.columns:
    df_pres["year_end"]   = df_pres["year_end_raw"].apply(parse_year)
    df_pres["is_current"] = df_pres["year_end_raw"].str.strip().str.lower().isin(
        ["presente", "present", "actual"]
    )
else:
    df_pres["year_end"]   = None
    df_pres["is_current"] = False
    print("  ⚠️  'Año Fin' column missing from Excel — year_end set to None, is_current=False for all rows")
df_pres["political_stance"] = df_pres.get("political_stance", pd.Series(dtype=str)).apply(normalize_stance)

df_pres = df_pres.dropna(subset=["year_start", "iso_alpha2", "full_name"])
df_pres["year_start"] = df_pres["year_start"].astype(int)

# FK lookup: iso_alpha2 → country UUID
resp = supabase.table("countries").select("id, iso_alpha2").execute()
country_lookup: dict[str, str] = {r["iso_alpha2"]: r["id"] for r in resp.data}

df_pres["country_id"] = df_pres["iso_alpha2"].map(country_lookup)

missing_iso = df_pres[df_pres["country_id"].isna()]["iso_alpha2"].unique()
if len(missing_iso):
    print(f"  ⚠️  ISOs sin country_id: {list(missing_iso)}")
    df_pres = df_pres[df_pres["country_id"].notna()]   # drop unresolvable rows

cols_pres = [
    "country_id", "full_name", "year_start", "year_end",
    "political_stance", "party", "political_system",
    "region", "is_current",
]
cols_pres = [c for c in cols_pres if c in df_pres.columns]
df_pres_final = df_pres[cols_pres].copy()
df_pres_final["year_end"] = df_pres_final["year_end"].apply(
    lambda x: int(x) if pd.notna(x) else None
)

records_pres = [sanitize_record(r) for r in df_pres_final.to_dict(orient="records")]
print(f"📊 Presidentes: {len(records_pres)}")
batch_upsert(
    "presidents",
    records_pres,
    on_conflict="country_id,full_name,year_start",   # natural key from migration 001
)


# ═════════════════════════════════════════════════════════════════════════════
# PASO 3 — PUBLIC EXPENDITURES (wide → long)
# Normalize scale values. FK resolve via country name. Drop null amounts.
# ═════════════════════════════════════════════════════════════════════════════

print("══════════════════════════════════════════")
print(" ETL 3/3 — Tabla 'public_expenditures'")
print("══════════════════════════════════════════")

df_exp = pd.read_excel(EXCEL_PATH, sheet_name="Base con continentes", dtype=str)
df_exp.columns = [str(c).strip() for c in df_exp.columns]

year_cols_present = [c for c in YEAR_COLS if c in df_exp.columns]
print(f"📅 Años encontrados: {year_cols_present}")

id_vars_candidates = ["COUNTRY", "CONTINENTE", "SECTOR", "INDICATOR",
                      "TYPE_OF_TRANSFORMATION", "FREQUENCY", "SCALE"]
id_vars = [c for c in id_vars_candidates if c in df_exp.columns]

df_long = pd.melt(
    df_exp,
    id_vars=id_vars,
    value_vars=year_cols_present,
    var_name="fiscal_year",
    value_name="amount",
)

# Drop nulls and empty values
df_long = df_long[df_long["amount"].notna()]
df_long = df_long[df_long["amount"].astype(str).str.strip().str.replace(",", "").ne("")]
df_long = df_long[~df_long["amount"].astype(str).str.strip().isin(["-", "N/A", "n/a", "NA", ""])]

df_long["fiscal_year"] = df_long["fiscal_year"].astype(int)
df_long["amount"] = (
    df_long["amount"]
    .astype(str)
    .str.replace(",", ".", regex=False)
    .str.replace(" ", "", regex=False)
    .astype(float)
)

# Normalize scale
if "SCALE" in df_long.columns:
    df_long["SCALE"] = df_long["SCALE"].apply(normalize_scale)

col_map_exp = {
    "COUNTRY":                "country_name_raw",
    "CONTINENTE":             "continent",
    "SECTOR":                 "sector",
    "INDICATOR":              "indicator",
    "TYPE_OF_TRANSFORMATION": "type_of_transformation",
    "SCALE":                  "scale",
    # FREQUENCY excluded: not in DB schema
}
df_long = df_long.rename(columns={k: v for k, v in col_map_exp.items() if k in df_long.columns})

# FK resolution: country name → UUID
country_name_lookup = {
    row["name_es"]: row["id"]
    for row in supabase.table("countries").select("id, name_es, name_en").execute().data
}
# Also index by name_en for flexible matching
for row in supabase.table("countries").select("id, name_en").execute().data:
    if row["name_en"]:
        country_name_lookup.setdefault(row["name_en"], row["id"])

def resolve_country_id(raw_name: str) -> str | None:
    name = str(raw_name).strip()
    direct = country_name_lookup.get(name)
    if direct:
        return direct
    # Case-insensitive fallback
    for k, v in country_name_lookup.items():
        if k.lower() == name.lower():
            return v
    return None

df_long["country_id"] = df_long["country_name_raw"].apply(resolve_country_id)

unresolved = df_long[df_long["country_id"].isna()]["country_name_raw"].unique()
if len(unresolved):
    print(f"  ⚠️  Países sin FK ({len(unresolved)}): {list(unresolved[:10])}")
    print("  Filas sin FK excluidas del insert.")
    df_long = df_long[df_long["country_id"].notna()]

cols_exp = [
    "country_id", "country_name_raw", "continent", "sector",
    "indicator", "type_of_transformation", "scale",
    "fiscal_year", "amount",
]
cols_exp = [c for c in cols_exp if c in df_long.columns]
df_exp_final = df_long[cols_exp].copy()
df_exp_final["amount"] = df_exp_final["amount"].apply(
    lambda x: round(float(x), 4) if x is not None else None
)

records_exp = [sanitize_record(r) for r in df_exp_final.to_dict(orient="records")]
print(f"📊 Registros tras melt + limpieza: {len(records_exp)}")

# Conflict key must match migration 001 unique constraint
conflict_cols = "country_name_raw,sector,indicator,type_of_transformation,scale,fiscal_year"
batch_upsert("public_expenditures", records_exp, on_conflict=conflict_cols)


# ═════════════════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═════════════════════════════════════════════════════════════════════════════

print("══════════════════════════════════════════════")
print(" ETL V2 COMPLETO")
print(f"  Países cargados      : {len(countries_records)}")
print(f"  Presidentes cargados : {len(records_pres)}")
print(f"  Gastos cargados      : {len(records_exp)}")
print("══════════════════════════════════════════════")
print()
print("💡 Siguiente paso: correr las migraciones SQL en Supabase")
print("   supabase/migrations/001_schema_fixes.sql")
print("   supabase/migrations/002_aletheia_core.sql")
print("   supabase/migrations/003_mistral_dynamic.sql")
print("   supabase/migrations/004_functions_triggers.sql")
print()
print("   Luego ejecutar en el SQL editor de Supabase:")
print("   SELECT * FROM fn_batch_compute_iea(2023);")
print("   -- Verifica que los IEA scores se computaron correctamente.")
