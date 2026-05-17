"""ETL: PRESIDENTES_POR_AÑO_GABINETE_LO_MAS_COMPLETO_DEFENDIBLE.xlsx
→ Supabase cabinet_ministers.

Hoja 1 ('CPI país-año con presidente'), 15 columnas:
  0 País CPI · 1 Año · 8 Postura política
  9  Ministro/a de Economía
  10 Ministro/a de Salud
  11 Ministro/a de Vivienda
  12 Ministro/a de Transporte
  13 Ministro/a de Trabajo
  14 Ministro/a de Justicia

ESTE xlsx SÍ usa sharedStrings (a diferencia del de presidentes).
Valor de celda: "Nombre APELLIDO (Min. of X)" → minister_name + source_role.
Reutiliza el mapeo nombre→iso3 de etl_presidents.
"""

import os, sys, zipfile, re, xml.etree.ElementTree as ET
from dotenv import load_dotenv
from etl_presidents import name_to_iso3, NO_DATA  # mapeo + set "sin dato"

load_dotenv()

XLSX = os.path.expanduser(
    "~/Downloads/PRESIDENTES_POR_AÑO_GABINETE_LO_MAS_COMPLETO_DEFENDIBLE.xlsx"
)
if not os.path.exists(XLSX):
    sys.exit(f"ERROR: {XLSX} not found")

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"

PORTFOLIOS = {
    9:  "Economía",
    10: "Salud",
    11: "Vivienda",
    12: "Transporte",
    13: "Trabajo",
    14: "Justicia",
}


def _col_idx(ref: str) -> int:
    m = re.match(r"([A-Z]+)", ref)
    c = 0
    for ch in m.group(1):
        c = c * 26 + (ord(ch) - 64)
    return c - 1


def parse(path: str):
    with zipfile.ZipFile(path) as z:
        ss = ET.fromstring(z.read("xl/sharedStrings.xml"))
        S = ["".join(t.text or "" for t in si.iter(NS + "t"))
             for si in ss.findall(NS + "si")]
        sh = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))

    def cv(c):
        t = c.get("t")
        v = c.find(NS + "v")
        if v is None:
            isn = c.find(NS + "is")
            return "".join(x.text or "" for x in isn.iter(NS + "t")).strip() if isn is not None else ""
        if t == "s":
            return S[int(v.text)].strip()
        return (v.text or "").strip()

    rows = sh.find(NS + "sheetData").findall(NS + "row")
    out = []
    for r in rows[1:]:
        cells = {}
        for c in r.findall(NS + "c"):
            cells[_col_idx(c.get("r"))] = cv(c)
        country = cells.get(0, "")
        yr = cells.get(1, "")
        if not country or not yr.isdigit():
            continue
        stance = cells.get(8, "")
        if stance.strip().lower() in NO_DATA:
            stance = None
        for col, portfolio in PORTFOLIOS.items():
            raw = cells.get(col, "")
            if not raw or raw.strip().lower() in NO_DATA:
                continue
            m = re.match(r"^(.*?)\s*\(([^)]*)\)\s*$", raw)
            if m:
                name = m.group(1).strip()
                role = m.group(2).strip()
            else:
                name, role = raw.strip(), None
            if not name or name.lower() in NO_DATA:
                continue
            out.append({
                "country_name":     country,
                "year":             int(yr),
                "portfolio":        portfolio,
                "minister_name":    name,
                "source_role":      role,
                "political_stance": stance,
            })
    return out


def main():
    print("Parsing Excel (gabinete) …")
    recs = parse(XLSX)
    print(f"  {len(recs)} minister rows extracted")

    try:
        import pycountry  # noqa: F401
    except ImportError:
        os.system(f"{sys.executable} -m pip install -q pycountry")

    rows_up, skipped = [], []
    for rec in recs:
        iso3 = name_to_iso3(rec["country_name"])
        if not iso3:
            skipped.append(rec["country_name"])
            continue
        rows_up.append({**rec, "iso3": iso3})

    if skipped:
        uniq = sorted(set(skipped))
        print(f"  WARNING — {len(uniq)} country names not mapped:")
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
        INSERT INTO cabinet_ministers
          (iso3, country_name, year, portfolio, minister_name, source_role, political_stance)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (iso3, year, portfolio) DO UPDATE SET
          country_name     = EXCLUDED.country_name,
          minister_name     = EXCLUDED.minister_name,
          source_role       = EXCLUDED.source_role,
          political_stance  = EXCLUDED.political_stance
    """
    batch = 500
    for i in range(0, len(rows_up), batch):
        chunk = rows_up[i:i + batch]
        cur.executemany(upsert, [
            (r["iso3"], r["country_name"], r["year"], r["portfolio"],
             r["minister_name"], r["source_role"], r["political_stance"])
            for r in chunk
        ])
        conn.commit()
        print(f"  batch {i // batch + 1}: {len(chunk)} rows OK")

    cur.execute("SELECT COUNT(*), COUNT(DISTINCT iso3) FROM cabinet_ministers")
    total, paises = cur.fetchone()
    cur.close()
    conn.close()
    print(f"\nDone. {len(rows_up)} upserted. Total cabinet_ministers: {total} ({paises} países)")


if __name__ == "__main__":
    main()
