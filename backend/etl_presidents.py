"""ETL: PRESIDENTES_POR_AÑO_APROBACION_MANDATO_AMPLIADA.xlsx → Supabase president_year.

Lee la hoja 1 ('CPI país-año con presidente'): 184 países × 2017-2025,
una fila por (país, año) con presidente + aprobación + pobreza + homicidios
+ crecimiento PIB + comentario PIB + postura política.

El xlsx usa inline strings (no sharedStrings) → se parsea el XML directo.
Mapea nombre de país (inglés) → ISO3 vía pycountry + overrides.
"Sin dato respaldado" / vacío → NULL en columnas numéricas y de texto opcional.
"""

import os, sys, zipfile, re, xml.etree.ElementTree as ET
from dotenv import load_dotenv

load_dotenv()

XLSX = os.path.expanduser(
    "~/Downloads/PRESIDENTES_POR_AÑO_APROBACION_MANDATO_AMPLIADA.xlsx"
)
if not os.path.exists(XLSX):
    sys.exit(f"ERROR: {XLSX} not found")

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"

# Reutiliza el mapeo probado del ETL de CPI.
OVERRIDES = {
    "Bolivia": "BOL", "Bosnia and Herzegovina": "BIH", "Brunei Darussalam": "BRN",
    "Cabo Verde": "CPV", "China": "CHN", "Congo": "COG", "Cote d'Ivoire": "CIV",
    "DR Congo": "COD", "Dominican Republic": "DOM", "East Timor": "TLS",
    "Eswatini": "SWZ", "Gambia": "GMB", "Iran": "IRN",
    "Kosovo": "XKX", "Kyrgyzstan": "KGZ", "Laos": "LAO",
    "Libya": "LBY", "Macau": "MAC", "Moldova": "MDA",
    "North Macedonia": "MKD", "Palestine": "PSE", "Russia": "RUS",
    "São Tomé and Príncipe": "STP", "Sao Tome and Principe": "STP",
    "South Korea": "KOR", "Syria": "SYR", "Taiwan": "TWN",
    "Tanzania": "TZA", "Trinidad and Tobago": "TTO", "Turkey": "TUR",
    "United Arab Emirates": "ARE", "United Kingdom": "GBR",
    "United States of America": "USA", "United States": "USA",
    "Venezuela": "VEN", "Vietnam": "VNM", "Yemen": "YEM",
    "Korea, South": "KOR", "Hong Kong": "HKG",
    "Czech Republic": "CZE", "Czechia": "CZE",
    "Slovakia": "SVK", "Netherlands": "NLD", "North Korea": "PRK",
    "Ivory Coast": "CIV", "Cape Verde": "CPV",
    "Democratic Republic of the Congo": "COD",
    "Guinea Bissau": "GNB", "Guinea-Bissau": "GNB",
    "Korea, North": "PRK",
}

NO_DATA = {"sin dato respaldado", "sin presidente en base", "n/a", "na", "-", ""}


def _col_idx(ref: str) -> int:
    m = re.match(r"([A-Z]+)", ref)
    c = 0
    for ch in m.group(1):
        c = c * 26 + (ord(ch) - 64)
    return c - 1


def _cell_val(c) -> str:
    v = c.find(NS + "v")
    if c.get("t") == "inlineStr" or v is None:
        isn = c.find(NS + "is")
        if isn is not None:
            return "".join(x.text or "" for x in isn.iter(NS + "t")).strip()
        return "" if v is None else (v.text or "").strip()
    return (v.text or "").strip()


def parse_sheet1(path: str) -> list[dict]:
    with zipfile.ZipFile(path) as z:
        sh = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    rows = sh.find(NS + "sheetData").findall(NS + "row")
    out: list[dict] = []
    for r in rows[1:]:  # skip header
        cells: dict = {}
        for c in r.findall(NS + "c"):
            cells[_col_idx(c.get("r"))] = _cell_val(c)
        country = cells.get(0, "")
        year = cells.get(1, "")
        if not country or not year.isdigit():
            continue
        out.append({
            "country_name":     country,
            "year":             int(year),
            "president":        cells.get(2, ""),
            "approval":         cells.get(3, ""),
            "poverty_pct":      cells.get(4, ""),
            "homicide_rate":    cells.get(5, ""),
            "gdp_growth":       cells.get(6, ""),
            "gdp_comment":      cells.get(7, ""),
            "political_stance": cells.get(8, ""),
        })
    return out


def name_to_iso3(name: str) -> str | None:
    if name in OVERRIDES:
        return OVERRIDES[name]
    try:
        import pycountry
        c = pycountry.countries.get(name=name)
        if c:
            return c.alpha_3
        res = pycountry.countries.search_fuzzy(name)
        if res:
            return res[0].alpha_3
    except Exception:
        pass
    return None


def _num(v: str):
    if v is None or v.strip().lower() in NO_DATA:
        return None
    try:
        return round(float(v.replace(",", ".")), 2)
    except Exception:
        return None


def _txt(v: str):
    if v is None or v.strip().lower() in NO_DATA:
        return None
    return v.strip()


def main():
    print("Parsing Excel (sheet1) …")
    recs = parse_sheet1(XLSX)
    print(f"  {len(recs)} country-year rows extracted")

    try:
        import pycountry  # noqa: F401
    except ImportError:
        os.system(f"{sys.executable} -m pip install -q pycountry")

    rows_up: list[dict] = []
    skipped: list[str] = []
    for rec in recs:
        iso3 = name_to_iso3(rec["country_name"])
        if not iso3:
            skipped.append(rec["country_name"])
            continue
        rows_up.append({
            "iso3":             iso3,
            "country_name":     rec["country_name"],
            "year":             rec["year"],
            "president":        _txt(rec["president"]),
            "approval":         _num(rec["approval"]),
            "poverty_pct":      _num(rec["poverty_pct"]),
            "homicide_rate":    _num(rec["homicide_rate"]),
            "gdp_growth":       _num(rec["gdp_growth"]),
            "gdp_comment":      _txt(rec["gdp_comment"]),
            "political_stance": _txt(rec["political_stance"]),
        })

    if skipped:
        uniq = sorted(set(skipped))
        print(f"  WARNING — {len(uniq)} country names not mapped (skipped):")
        for s in uniq:
            print(f"    {s}")
    print(f"  {len(rows_up)} rows ready to upload")

    db_url = os.getenv("DATABASE_URL", "")
    pg_url = db_url.replace("postgresql+asyncpg://", "postgresql://").replace("%21", "!")
    try:
        import psycopg2
    except ImportError:
        os.system(f"{sys.executable} -m pip install -q psycopg2-binary")
        import psycopg2

    print("Uploading via direct Postgres …")
    conn = psycopg2.connect(pg_url, sslmode="require")
    cur = conn.cursor()
    upsert = """
        INSERT INTO president_year
          (iso3, country_name, year, president, approval, poverty_pct,
           homicide_rate, gdp_growth, gdp_comment, political_stance)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (iso3, year) DO UPDATE SET
          country_name     = EXCLUDED.country_name,
          president         = EXCLUDED.president,
          approval          = EXCLUDED.approval,
          poverty_pct       = EXCLUDED.poverty_pct,
          homicide_rate     = EXCLUDED.homicide_rate,
          gdp_growth        = EXCLUDED.gdp_growth,
          gdp_comment       = EXCLUDED.gdp_comment,
          political_stance  = EXCLUDED.political_stance
    """
    batch = 500
    for i in range(0, len(rows_up), batch):
        chunk = rows_up[i:i + batch]
        cur.executemany(upsert, [
            (r["iso3"], r["country_name"], r["year"], r["president"],
             r["approval"], r["poverty_pct"], r["homicide_rate"],
             r["gdp_growth"], r["gdp_comment"], r["political_stance"])
            for r in chunk
        ])
        conn.commit()
        print(f"  batch {i // batch + 1}: {len(chunk)} rows OK")

    cur.execute("SELECT COUNT(*) FROM president_year")
    total = cur.fetchone()[0]
    cur.close()
    conn.close()
    print(f"\nDone. {len(rows_up)} upserted. Total in president_year: {total}")


if __name__ == "__main__":
    main()
