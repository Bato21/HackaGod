"""
AletheiaPath V2 — ETL: Excel → Supabase
Ejecutar desde /backend con:
    python etl_load_excel.py
"""

# pip install pandas openpyxl python-dotenv supabase

import os
import math
import numpy as np
import pandas as pd
from dotenv import load_dotenv, find_dotenv
from supabase import create_client, Client

try:
    import pycountry
    HAS_PYCOUNTRY = True
except ImportError:
    HAS_PYCOUNTRY = False

# ── CONFIG ────────────────────────────────────────────────────────────────────

EXCEL_PATH = "BASE_COMPLETA_CORREGIDA_CON_TODOS_LOS_DATOS.xlsx"
BATCH_SIZE = 500
YEAR_COLS  = [str(y) for y in range(2017, 2026)]   # '2017'..'2025'

# ── ENV ───────────────────────────────────────────────────────────────────────

dotenv_path = find_dotenv(".env.local")
if not dotenv_path:
    raise FileNotFoundError(".env.local no encontrado.")
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
    """Convierte tipos numpy a Python nativos; NaN/None/NA → None.
    También convierte floats enteros (2021.0) a int para columnas smallint."""
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
            elif v == int(v):   # pandas convierte int+None → float64 (ej. 2021.0 → 2021)
                out[k] = int(v)
            else:
                out[k] = v
        elif pd.isna(v):        # pandas NA (nullable integer)
            out[k] = None
        else:
            out[k] = v
    return out


def batch_upsert(table: str, records: list[dict], batch_size: int = BATCH_SIZE,
                 on_conflict: str | None = None) -> None:
    """Sube registros en lotes; usa upsert para ser idempotente."""
    total   = len(records)
    batches = math.ceil(total / batch_size)
    errors  = []
    for i in range(batches):
        chunk = records[i * batch_size : (i + 1) * batch_size]
        try:
            supabase.table(table).upsert(chunk, on_conflict=on_conflict).execute()
            print(f"  [{table}] Lote {i+1}/{batches} — {len(chunk)} registros ✓")
        except Exception as e:
            print(f"  [{table}] Lote {i+1}/{batches} — ERROR: {e}")
            errors.append({"batch": i + 1, "error": str(e)})
    if errors:
        print(f"\n⚠️  {len(errors)} lote(s) fallaron en '{table}':")
        for err in errors:
            print(f"   Lote {err['batch']}: {err['error']}")
    else:
        print(f"\n✅ '{table}' cargada: {total} registros en {batches} lotes.\n")


def fetch_country_lookup() -> dict[str, str]:
    """Retorna {iso_alpha2: uuid} desde la tabla countries."""
    resp = supabase.table("countries").select("id, iso_alpha2").execute()
    return {row["iso_alpha2"]: row["id"] for row in resp.data}


# ═════════════════════════════════════════════════════════════════════════════
# PASO 0 — LIMPIAR DATOS PREVIOS
# ═════════════════════════════════════════════════════════════════════════════

print("\n🗑️  Vaciando tablas antes de recargar con datos corregidos...")

# presidents: filtrar por year_start (int) porque id es UUID
try:
    supabase.table("presidents").delete().gte("year_start", 0).execute()
    print("  ✓ presidents vaciada")
except Exception as e:
    print(f"  ⚠️ presidents: {e}")

# countries: se vaciará y repoblará en el paso siguiente
try:
    supabase.table("countries").delete().neq("iso_alpha2", "").execute()
    print("  ✓ countries vaciada")
except Exception as e:
    print(f"  ⚠️ countries: {e}")

# public_expenditures tiene 640k filas → borrar por año para evitar timeout
print("  Borrando public_expenditures por año fiscal...")
for yr in range(2017, 2026):
    try:
        supabase.table("public_expenditures").delete().eq("fiscal_year", yr).execute()
        print(f"    fiscal_year={yr} eliminado")
    except Exception as e:
        print(f"    fiscal_year={yr} ERROR: {e}")

# ═════════════════════════════════════════════════════════════════════════════
# PASO 0.5 — POBLAR COUNTRIES (necesario para FK NOT NULL en presidents)
# ═════════════════════════════════════════════════════════════════════════════

print("\n══════════════════════════════════════════")
print(" ETL 0/3 — Tabla 'countries'")
print("══════════════════════════════════════════")

df_iso = pd.read_excel(EXCEL_PATH, sheet_name="Presidentes Completo",
                       dtype=str, usecols=["País", "Código País"])
df_iso.columns = ["name_es", "iso_alpha2"]
df_iso["iso_alpha2"] = df_iso["iso_alpha2"].str.strip().str.upper()
df_iso["name_es"]    = df_iso["name_es"].str.strip()
df_iso = df_iso.dropna(subset=["iso_alpha2"]).drop_duplicates("iso_alpha2")

countries_records = []
for _, row in df_iso.iterrows():
    iso2    = row["iso_alpha2"]
    name_es = row["name_es"]
    iso3    = None
    name_en = name_es   # fallback si pycountry no lo encuentra

    if HAS_PYCOUNTRY:
        c = pycountry.countries.get(alpha_2=iso2)
        if c:
            iso3    = c.alpha_3
            name_en = c.name

    if iso3 is None:
        iso3 = (iso2 + "X")[:3]   # placeholder 3 chars si no hay mapeo

    countries_records.append({
        "iso_alpha2": iso2,
        "iso_alpha3": iso3,
        "name_es":    name_es,
        "name_en":    name_en,
    })

print(f"📊 Países a insertar en countries: {len(countries_records)}")
batch_upsert("countries", countries_records, on_conflict="iso_alpha2")

# ═════════════════════════════════════════════════════════════════════════════
# BLOQUE 1 — PRESIDENTES  (hoja: 'Presidentes Completo')
# ═════════════════════════════════════════════════════════════════════════════

print("\n══════════════════════════════════════════")
print(" ETL 1/2 — Hoja: 'Presidentes Completo'")
print("══════════════════════════════════════════")

df_pres = pd.read_excel(EXCEL_PATH, sheet_name="Presidentes Completo", dtype=str)
df_pres.columns = df_pres.columns.str.strip()

col_map_pres = {
    "País":             "country_name_raw",
    "Código País":      "iso_alpha2",
    "Región":           "region",
    "Nombre":           "full_name",
    "Año Inicio":       "year_start",
    "Año Fin":          "year_end_raw",
    "Postura Política": "political_stance",
    "Partido":          "party",
    "Sistema Político": "political_system",
}
df_pres = df_pres.rename(columns=col_map_pres)

df_pres["iso_alpha2"] = df_pres["iso_alpha2"].str.strip().str.upper()
df_pres["full_name"]  = df_pres["full_name"].str.strip()

def parse_year(val):
    if pd.isna(val):
        return None
    val = str(val).strip()
    if val.lower() in ("presente", "present", "actual", "-", ""):
        return None
    try:
        return int(float(val))
    except ValueError:
        return None

df_pres["year_start"] = df_pres["year_start"].apply(parse_year)
df_pres["year_end"]   = df_pres["year_end_raw"].apply(parse_year)
df_pres["is_current"] = df_pres["year_end_raw"].str.strip().str.lower().isin(
    ["presente", "present", "actual"]
)

df_pres = df_pres.dropna(subset=["year_start", "iso_alpha2", "full_name"])
df_pres["year_start"] = df_pres["year_start"].astype(int)

country_lookup = fetch_country_lookup()
df_pres["country_id"] = df_pres["iso_alpha2"].map(country_lookup)

missing = df_pres[df_pres["country_id"].isna()]["iso_alpha2"].unique()
if len(missing):
    print(f"⚠️  ISOs sin country_id (countries table vacía o ISOs ausentes): {list(missing)[:10]}...")
    print("   Se cargarán con country_id = NULL\n")

cols_pres = [
    "country_id", "iso_alpha2", "full_name", "year_start", "year_end",
    "political_stance", "party", "political_system", "region", "is_current"
]
df_pres_final = df_pres[cols_pres].copy()
df_pres_final = df_pres_final.where(pd.notna(df_pres_final), other=None)
df_pres_final["year_start"] = df_pres_final["year_start"].astype(int)
df_pres_final["year_end"] = df_pres_final["year_end"].apply(
    lambda x: int(x) if pd.notna(x) else None
)

records_pres = [sanitize_record(r) for r in df_pres_final.to_dict(orient="records")]
print(f"📊 Registros a insertar: {len(records_pres)}")
batch_upsert("presidents", records_pres)


# ═════════════════════════════════════════════════════════════════════════════
# BLOQUE 2 — GASTO PÚBLICO  (hoja: 'Base con continentes', wide → long)
# ═════════════════════════════════════════════════════════════════════════════

print("══════════════════════════════════════════")
print(" ETL 2/2 — Hoja: 'Base con continentes'")
print("══════════════════════════════════════════")

df_exp = pd.read_excel(EXCEL_PATH, sheet_name="Base con continentes", dtype=str)
df_exp.columns = [str(c).strip() for c in df_exp.columns]

year_cols_present = [c for c in YEAR_COLS if c in df_exp.columns]
print(f"📅 Columnas de año encontradas: {year_cols_present}")

# FREQUENCY existe en la hoja nueva pero NO en el schema de la DB → incluir en
# id_vars para que no sea melteada, y simplemente no mapearla al output final
id_vars_candidates = ["COUNTRY", "CONTINENTE", "SECTOR", "INDICATOR",
                      "TYPE_OF_TRANSFORMATION", "FREQUENCY", "SCALE"]
id_vars = [c for c in id_vars_candidates if c in df_exp.columns]

df_long = pd.melt(
    df_exp,
    id_vars=id_vars,
    value_vars=year_cols_present,
    var_name="fiscal_year",
    value_name="amount"
)

# Descartar filas sin monto
df_long = df_long[df_long["amount"].notna()]
df_long = df_long[df_long["amount"].str.strip().str.replace(",", "").ne("")]
df_long = df_long[~df_long["amount"].str.strip().isin(["-", "N/A", "n/a", "NA"])]

df_long["fiscal_year"] = df_long["fiscal_year"].astype(int)
df_long["amount"] = (
    df_long["amount"]
    .str.replace(",", ".", regex=False)   # comas decimales europeas
    .str.replace(" ", "", regex=False)
    .astype(float)
)

col_map_exp = {
    "COUNTRY":                "country_name_raw",
    "CONTINENTE":             "continent",
    "SECTOR":                 "sector",
    "INDICATOR":              "indicator",
    "TYPE_OF_TRANSFORMATION": "type_of_transformation",
    "SCALE":                  "scale",
    # FREQUENCY no se mapea: no existe en el schema DB
}
df_long = df_long.rename(columns=col_map_exp)

# FK country_id por nombre (countries table puede estar vacía)
country_name_lookup = {
    row["name_es"]: row["id"]
    for row in supabase.table("countries")
    .select("id, name_es, name_en, iso_alpha3")
    .execute()
    .data
}

def resolve_country_id(raw_name: str) -> str | None:
    name = str(raw_name).strip()
    if name in country_name_lookup:
        return country_name_lookup[name]
    for k, v in country_name_lookup.items():
        if k.lower() == name.lower():
            return v
    return None

df_long["country_id"] = df_long["country_name_raw"].apply(resolve_country_id)

unmapped = df_long[df_long["country_id"].isna()]["country_name_raw"].unique()
if len(unmapped):
    print(f"⚠️  Países sin FK ({len(unmapped)}): {list(unmapped[:10])}{'...' if len(unmapped) > 10 else ''}")
    print("   Se insertarán con country_id = NULL.\n")

cols_exp = [
    "country_id", "country_name_raw", "continent", "sector",
    "indicator", "type_of_transformation", "scale",
    "fiscal_year", "amount"
]
df_exp_final = df_long[cols_exp].copy()
df_exp_final = df_exp_final.where(pd.notna(df_exp_final), other=None)
df_exp_final["amount"] = df_exp_final["amount"].apply(
    lambda x: round(float(x), 4) if x is not None else None
)

records_exp = [sanitize_record(r) for r in df_exp_final.to_dict(orient="records")]
print(f"📊 Registros a insertar tras melt + limpieza: {len(records_exp)}")
batch_upsert(
    "public_expenditures", records_exp,
    on_conflict="country_name_raw,sector,indicator,type_of_transformation,scale,fiscal_year",
)


# ═════════════════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═════════════════════════════════════════════════════════════════════════════

print("══════════════════════════════════════════════")
print(" ETL COMPLETO")
print(f"  Presidentes cargados : {len(records_pres)}")
print(f"  Gastos cargados      : {len(records_exp)}")
print("══════════════════════════════════════════════")
