#!/usr/bin/env python3
"""
etl_population.py — Genera frontend/population-data.js desde el Excel
PAISES_BASE_POBLACION_DESCRIPCION.xlsx.

Salida (script síncrono, patrón cpi-override / milestones-override):
    window.COUNTRY_POPULATION = { iso3: { "2017": n, ..., "2025": n }, ... }
    window.COUNTRY_DESC       = { iso3: "descripción del país", ... }

Mapeo nombre-EN (col "País CPI") → iso3 vía tabla countries (name_en) con
normalización + alias para los casos típicos (Czechia, Turkiye, etc).
"""

import json
import os
import re
import sys
import unicodedata

import pandas as pd
import psycopg2

XLSX = "/Users/luis-felipe/Downloads/PAISES_BASE_POBLACION_DESCRIPCION.xlsx"
OUT = os.path.join(os.path.dirname(__file__), "..", "frontend", "population-data.js")

# Excel "País CPI" → iso3 cuando la normalización no basta.
ALIAS = {
    "united states": "USA",
    "united states of america": "USA",
    "korea, south": "KOR",
    "south korea": "KOR",
    "korea, north": "PRK",
    "north korea": "PRK",
    "czechia": "CZE",
    "czech republic": "CZE",
    "turkiye": "TUR",
    "turkey": "TUR",
    "cote d ivoire": "CIV",
    "ivory coast": "CIV",
    "cape verde": "CPV",
    "cabo verde": "CPV",
    "swaziland": "SWZ",
    "eswatini": "SWZ",
    "democratic republic of the congo": "COD",
    "congo, democratic republic of the": "COD",
    "dr congo": "COD",
    "republic of the congo": "COG",
    "congo": "COG",
    "russia": "RUS",
    "russian federation": "RUS",
    "syria": "SYR",
    "laos": "LAO",
    "brunei": "BRN",
    "moldova": "MDA",
    "tanzania": "TZA",
    "vietnam": "VNM",
    "iran": "IRN",
    "venezuela": "VEN",
    "bolivia": "BOL",
    "the gambia": "GMB",
    "gambia": "GMB",
    "myanmar": "MMR",
    "burma": "MMR",
    "guinea bissau": "GNB",
    "timor leste": "TLS",
    "east timor": "TLS",
    "north macedonia": "MKD",
    "macedonia": "MKD",
    "sao tome and principe": "STP",
    "hong kong": "HKG",
    "mauritania": "MRT",
    "namibia": "NAM",
}


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", str(s or ""))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").lower()
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def main() -> int:
    dsn = os.environ.get("DATABASE_URL", "").replace(
        "postgresql+asyncpg://", "postgresql://"
    )
    if not dsn:
        print("ERROR: DATABASE_URL no seteada", file=sys.stderr)
        return 1

    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    cur.execute("SELECT iso_alpha3, name_en, name_es FROM countries")
    by_name = {}
    for iso3, en, es in cur.fetchall():
        iso3 = iso3.strip()
        for n in (en, es):
            if n:
                by_name[norm(n)] = iso3
    cur.close()
    conn.close()

    df = pd.read_excel(XLSX, "Paises_poblacion_descripcion")
    pop, desc, unmatched = {}, {}, set()

    for _, row in df.iterrows():
        raw = str(row["País CPI"]).strip()
        key = norm(raw)
        iso3 = ALIAS.get(key) or by_name.get(key)
        if not iso3:
            unmatched.add(raw)
            continue
        year = str(int(row["Año"]))
        pop.setdefault(iso3, {})[year] = int(row["Población del país"])
        if iso3 not in desc:
            desc[iso3] = str(row["Descripción del país"]).strip()

    banner = (
        "// population-data.js — GENERADO por backend/etl_population.py — NO editar a mano.\n"
        "// Fuente: PAISES_BASE_POBLACION_DESCRIPCION.xlsx (184 países, 2017-2025).\n"
        "// Población aproximada por país-año + descripción estática por país.\n"
        "// Carga síncrona ANTES de app.jsx (patrón cpi-override).\n\n"
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(banner)
        f.write("window.COUNTRY_POPULATION = ")
        f.write(json.dumps(pop, ensure_ascii=False, separators=(",", ":")))
        f.write(";\n\n")
        f.write("window.COUNTRY_DESC = ")
        f.write(json.dumps(desc, ensure_ascii=False, separators=(",", ":")))
        f.write(";\n")

    print(f"OK → {os.path.normpath(OUT)}")
    print(f"  países mapeados : {len(pop)}")
    print(f"  con descripción : {len(desc)}")
    if unmatched:
        print(f"  SIN MATCH ({len(unmatched)}): {sorted(unmatched)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
