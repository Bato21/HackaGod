"""ETL: PRESIDENTES_POR_AÑO_GABINETE_HITOS_MINISTROS_COMPLETADOS.xlsx
→ Supabase milestones.

Hoja 1, columnas 15-22 = 'Hito 1..8 del año presidencial' (texto por país-año).
Algunas celdas traen una fórmula Excel filtrada (… clasificado como: =IF(ISBLANK(G2)…);
se sanitiza cortando desde '=IF(' / '=' inicial de fórmula.
Reutiliza el mapeo nombre→iso3 de etl_presidents.
"""

import os, sys, zipfile, re, xml.etree.ElementTree as ET
from dotenv import load_dotenv
from etl_presidents import name_to_iso3, NO_DATA

load_dotenv()

XLSX = os.path.expanduser(
    "~/Downloads/PRESIDENTES_POR_AÑO_GABINETE_HITOS_MINISTROS_COMPLETADOS.xlsx"
)
if not os.path.exists(XLSX):
    sys.exit(f"ERROR: {XLSX} not found")

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
HITO_COLS = list(range(15, 23))  # 15..22 → idx 1..8


def _col_idx(ref: str) -> int:
    m = re.match(r"([A-Z]+)", ref)
    c = 0
    for ch in m.group(1):
        c = c * 26 + (ord(ch) - 64)
    return c - 1


def _clean(t: str) -> str | None:
    if not t:
        return None
    # Corta fórmulas Excel filtradas (=IF(…), =…) y restos colgantes.
    t = re.split(r"=\s*IF\s*\(", t, maxsplit=1)[0]
    t = re.split(r"(?<!\w)=[A-Z]{2,}\s*\(", t, maxsplit=1)[0]
    t = t.strip()
    t = re.sub(r"[\s:;,\-]+$", "", t).strip()
    if not t or t.lower() in NO_DATA:
        return None
    if len(t) < 4:
        return None
    return t


def parse(path: str):
    with zipfile.ZipFile(path) as z:
        S = ["".join(t.text or "" for t in si.iter(NS + "t"))
             for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall(NS + "si")]
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
        for n, col in enumerate(HITO_COLS, start=1):
            txt = _clean(cells.get(col, ""))
            if not txt:
                continue
            out.append({
                "country_name": country,
                "year": int(yr),
                "idx": n,
                "text": txt,
            })
    return out


def main():
    print("Parsing Excel (hitos) …")
    recs = parse(XLSX)
    print(f"  {len(recs)} milestone rows extracted")

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
    conn = psycopg2.connect(
        pg_url, sslmode="require",
        connect_timeout=15, keepalives=1,
        keepalives_idle=20, keepalives_interval=10, keepalives_count=3,
    )
    cur = conn.cursor()
    upsert = """
        INSERT INTO milestones (iso3, country_name, year, idx, text)
        VALUES (%s,%s,%s,%s,%s)
        ON CONFLICT (iso3, year, idx) DO UPDATE SET
          country_name = EXCLUDED.country_name,
          text          = EXCLUDED.text
    """
    batch = 500
    for i in range(0, len(rows_up), batch):
        chunk = rows_up[i:i + batch]
        cur.executemany(upsert, [
            (r["iso3"], r["country_name"], r["year"], r["idx"], r["text"])
            for r in chunk
        ])
        conn.commit()
        print(f"  batch {i // batch + 1}: {len(chunk)} rows OK")

    cur.execute("SELECT COUNT(*), COUNT(DISTINCT iso3) FROM milestones")
    total, paises = cur.fetchone()
    cur.close()
    conn.close()
    print(f"\nDone. {len(rows_up)} upserted. Total milestones: {total} ({paises} países)")


if __name__ == "__main__":
    main()
