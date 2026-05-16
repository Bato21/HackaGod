"""ETL: CPI2025_Results.xlsx → Supabase cpi_scores table.

Reads the 'CPI Historical' sheet (2012-2025, ~182 countries).
Maps country names → ISO3 via pycountry + manual overrides.
Inverts CPI: aletheia_score = 100 - cpi_score
(Aletheia: 0 = transparent, 100 = very corrupt;
 original CPI: 0 = very corrupt, 100 = transparent).
"""

import os, sys, zipfile, xml.etree.ElementTree as ET
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

XLSX = os.path.join(os.path.dirname(__file__), "CPI2025_Results.xlsx")
if not os.path.exists(XLSX):
    sys.exit(f"ERROR: {XLSX} not found — copy it first:\n  cp ~/Downloads/CPI2025_Results.xlsx backend/")

# ── ISO3 overrides for names pycountry can't auto-match ────────────────
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
# Rows to skip (spurious data from merged cells)
SKIP_NAMES = {"Year", ""}


def get_ns(raw: bytes) -> str:
    start = raw.index(b'xmlns=') + 7
    return raw[start: raw.index(b'"', start)].decode()


def parse_historical(xlsx_path: str) -> list[dict]:
    """Extract (country_name, year, cpi_score) from the 'CPI Historical' sheet."""
    with zipfile.ZipFile(xlsx_path) as z:
        ss_raw = z.read("xl/sharedStrings.xml")
        ns_ss  = get_ns(ss_raw)
        strings = [t.text or "" for t in ET.fromstring(ss_raw).findall(f".//{{{ns_ss}}}t")]

        sh_raw = z.read("xl/worksheets/sheet6.xml")
        ns2    = get_ns(sh_raw)
        rows   = ET.fromstring(sh_raw).findall(f".//{{{ns2}}}row")

        def cell_val(c):
            t = c.get("t", "")
            v = c.find(f"{{{ns2}}}v")
            if v is None:
                return None
            if t == "s":
                return strings[int(v.text)]
            try:
                f = float(v.text)
                return int(f) if f == int(f) else round(f, 2)
            except Exception:
                return v.text

        seen: set = set()
        records: list[dict] = []
        for row in rows[4:]:  # skip 4 header rows
            cells: dict = {}
            for c in row.findall(f"{{{ns2}}}c"):
                col = "".join(ch for ch in c.get("r", "") if ch.isalpha())
                cells[col] = cell_val(c)

            country = cells.get("B")
            year    = cells.get("C")
            score   = cells.get("E")

            if not country or not isinstance(year, int) or not (2012 <= year <= 2030):
                continue
            if score is None or not isinstance(score, (int, float)):
                continue
            key = (country, year)
            if key in seen:
                continue
            seen.add(key)
            records.append({"country_name": country, "year": year, "cpi_score": float(score)})

    return records


def name_to_iso3(name: str) -> str | None:
    if name in OVERRIDES:
        return OVERRIDES[name]
    try:
        import pycountry
        c = pycountry.countries.get(name=name)
        if c:
            return c.alpha_3
        # fuzzy search
        results = pycountry.countries.search_fuzzy(name)
        if results:
            return results[0].alpha_3
    except Exception:
        pass
    return None


def main():
    print("Parsing Excel …")
    records = parse_historical(XLSX)
    print(f"  {len(records)} country-year rows extracted")

    try:
        import pycountry  # noqa: F401
    except ImportError:
        print("Installing pycountry …")
        os.system(f"{sys.executable} -m pip install -q pycountry")

    print("Mapping country names → ISO3 …")
    rows_to_upload: list[dict] = []
    skipped: list[str] = []

    for rec in records:
        if rec["country_name"] in SKIP_NAMES:
            continue
        iso3 = name_to_iso3(rec["country_name"])
        if not iso3:
            skipped.append(rec["country_name"])
            continue
        cpi   = round(rec["cpi_score"], 2)
        inv   = round(100 - cpi, 2)
        rows_to_upload.append({
            "iso3":           iso3,
            "country_name":   rec["country_name"],
            "year":           rec["year"],
            "cpi_score":      cpi,
            "aletheia_score": inv,
        })

    if skipped:
        unique_skipped = sorted(set(skipped))
        print(f"  WARNING — could not map {len(unique_skipped)} country names (skipped):")
        for s in unique_skipped:
            print(f"    {s}")

    print(f"  {len(rows_to_upload)} rows ready to upload")

    # Use direct Postgres connection (bypasses RLS/anon restrictions).
    db_url = os.getenv("DATABASE_URL", "")
    # Convert asyncpg DSN to psycopg2 DSN
    pg_url = db_url.replace("postgresql+asyncpg://", "postgresql://").replace("%21", "!")

    try:
        import psycopg2
    except ImportError:
        print("Installing psycopg2-binary …")
        os.system(f"{sys.executable} -m pip install -q psycopg2-binary")
        import psycopg2

    print("Uploading to Supabase via direct Postgres …")
    conn = psycopg2.connect(pg_url, sslmode="require")
    cur  = conn.cursor()

    upsert_sql = """
        INSERT INTO cpi_scores (iso3, country_name, year, cpi_score, aletheia_score)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (iso3, year) DO UPDATE SET
          country_name   = EXCLUDED.country_name,
          cpi_score      = EXCLUDED.cpi_score,
          aletheia_score = EXCLUDED.aletheia_score
    """
    batch = 500
    for i in range(0, len(rows_to_upload), batch):
        chunk = rows_to_upload[i : i + batch]
        cur.executemany(upsert_sql, [
            (r["iso3"], r["country_name"], r["year"], r["cpi_score"], r["aletheia_score"])
            for r in chunk
        ])
        conn.commit()
        print(f"  batch {i // batch + 1}: {len(chunk)} rows OK")

    cur.execute("SELECT COUNT(*) FROM cpi_scores")
    total = cur.fetchone()[0]
    cur.close()
    conn.close()

    print(f"\nDone. {len(rows_to_upload)} rows upserted. Total in cpi_scores: {total}")


if __name__ == "__main__":
    main()
