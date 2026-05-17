"""ETL completo desde
PRESIDENTES_POR_AÑO_GABINETE_HITOS_MINISTROS_INDICADORES_NUMERICOS.xlsx

Hoja 'CPI país-año con presidente' (32 cols, ~1656 filas país-año):
  0  País CPI            1  Año
  2  Presidente/líder    3  Aprobación (%)
  4  Pobreza (%)         5  Homicidios /100k
  6  PIB crec. (%)       7  Comentario PIB     8  Postura política
  9-14  Ministros (Economía, Salud, Vivienda, Transporte, Trabajo, Justicia)
  15-22 Hito 1..8
  23 Criterio gabinete   24-30 Indicadores numéricos
  31 Fuente / criterio de indicadores

Actualiza president_year, cabinet_ministers, milestones (reemplaza por
hitos reales) y crea/llena country_indicators. Idempotente (UPSERT).
psycopg2 directo al pooler. Reusa name_to_iso3/NO_DATA de etl_presidents.
"""

import os, re
import openpyxl
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
from etl_presidents import name_to_iso3, NO_DATA

load_dotenv()

XLSX = os.path.expanduser(
    "~/Downloads/PRESIDENTES_POR_AÑO_GABINETE_HITOS_MINISTROS_INDICADORES_INFLACION.xlsx"
)
SHEET = "CPI país-año con presidente"

PORTFOLIOS = ["Economía", "Salud", "Vivienda", "Transporte", "Trabajo", "Justicia"]


def dsn() -> str:
    d = os.environ["DATABASE_URL"]
    d = re.sub(r"^postgresql\+asyncpg://", "postgresql://", d)
    d = re.sub(r"\?.*$", "", d)
    return d


def is_nodata(v) -> bool:
    if v is None:
        return True
    return str(v).strip().lower() in NO_DATA


def num(v):
    """float o None. Acepta '12,3' / '12.3' / 'Sin dato respaldado'."""
    if is_nodata(v):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().replace("%", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return None


def clean_text(v):
    if is_nodata(v):
        return None
    return str(v).strip()


def split_minister(cell):
    """'Nombre APELLIDO (Min. of X)' → (nombre, rol|None)."""
    t = clean_text(cell)
    if not t:
        return None, None
    m = re.match(r"^(.*?)\s*\(([^)]*)\)\s*$", t)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return t, None


def fix_hito(text, gdp_comment):
    """Hito 2 trae una fórmula Excel sin evaluar (=IF(...)). Reemplaza el
    bloque de fórmula por el Comentario PIB ya calculado."""
    t = clean_text(text)
    if not t:
        return None
    if "=IF(" in t or "=SI(" in t:
        repl = gdp_comment or "sin clasificación de PIB respaldada"
        t = re.sub(r"=(IF|SI)\([^.]*\)\.?", repl + ".", t)
        t = re.sub(r"\s+\.", ".", t)
    return t


def main():
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb[SHEET]
    it = ws.iter_rows(values_only=True)
    next(it)  # header

    py_rows, ind_rows = [], []
    seen_py, seen_ind = set(), set()
    # dedupe por clave única (colisiones grafía: GNB, COG) last-write-wins
    cab_map = {}   # (iso3,year,portfolio) -> row
    mil_map = {}   # (iso3,year,idx) -> row
    skipped = 0

    for r in it:
        country_raw = r[0]
        year_raw = r[1]
        if country_raw is None or year_raw is None:
            continue
        iso3 = name_to_iso3(str(country_raw).strip())
        if not iso3:
            skipped += 1
            continue
        try:
            year = int(year_raw)
        except (TypeError, ValueError):
            continue
        cname = str(country_raw).strip()

        # president_year (last-write-wins por colisiones de grafía)
        key = (iso3, year)
        gdp_comment = clean_text(r[7])
        if key not in seen_py:
            seen_py.add(key)
            py_rows.append((
                iso3, cname, year,
                clean_text(r[2]),               # president
                num(r[3]),                      # approval
                num(r[4]),                      # poverty_pct
                num(r[5]),                      # homicide_rate
                num(r[6]),                      # gdp_growth
                gdp_comment,                    # gdp_comment
                clean_text(r[8]),               # political_stance
                num(r[32]) if len(r) > 32 else None,        # inflation
                clean_text(r[33]) if len(r) > 33 else None,  # inflation_source
                clean_text(r[34]) if len(r) > 34 else None,  # inflation_status
            ))

        # cabinet (6 carteras)
        for i, port in enumerate(PORTFOLIOS):
            name, role = split_minister(r[9 + i])
            if not name:
                continue
            cab_map[(iso3, year, port)] = (
                iso3, cname, year, port, name, role, clean_text(r[8]))

        # milestones (8 hitos reales, idx 1..8) — reemplaza generados PRNG
        for k in range(8):
            h = fix_hito(r[15 + k], gdp_comment)
            if h:
                mil_map[(iso3, year, k + 1)] = (iso3, cname, year, k + 1, h)

        # country_indicators (7 numéricos + criterio + fuente)
        if key not in seen_ind:
            seen_ind.add(key)
            def i7(x):
                n = num(x)
                return int(round(n)) if n is not None else None
            ind_rows.append((
                iso3, cname, year,
                i7(r[24]),  # reportes_uif
                i7(r[25]),  # sentencias_firmes
                i7(r[26]),  # acceso_negado
                i7(r[27]),  # allanamientos
                i7(r[28]),  # casos_abiertos
                i7(r[29]),  # imputaciones
                i7(r[30]),  # casos_corrupcion
                clean_text(r[23]),  # criterio_gabinete
                clean_text(r[31]),  # fuente_indicadores
            ))

    cab_rows = list(cab_map.values())
    mil_rows = list(mil_map.values())
    print(f"parsed: py={len(py_rows)} cab={len(cab_rows)} "
          f"mil={len(mil_rows)} ind={len(ind_rows)} skipped={skipped}")

    con = psycopg2.connect(dsn())
    con.autocommit = False
    cur = con.cursor()

    # --- country_indicators: crear si no existe + RLS + GRANT ---
    cur.execute("""
    CREATE TABLE IF NOT EXISTS country_indicators (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      iso3 char(3) NOT NULL,
      country_name text,
      year smallint NOT NULL,
      reportes_uif int,
      sentencias_firmes int,
      acceso_negado int,
      allanamientos int,
      casos_abiertos int,
      imputaciones int,
      casos_corrupcion int,
      criterio_gabinete text,
      fuente_indicadores text,
      created_at timestamptz DEFAULT now(),
      UNIQUE (iso3, year)
    );
    ALTER TABLE country_indicators ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS ci_sel ON country_indicators;
    CREATE POLICY ci_sel ON country_indicators FOR SELECT USING (true);
    GRANT SELECT ON country_indicators TO anon, authenticated;
    """)

    # president_year: columnas de inflación (idempotente)
    cur.execute("""
      ALTER TABLE president_year
        ADD COLUMN IF NOT EXISTS inflation numeric,
        ADD COLUMN IF NOT EXISTS inflation_source text,
        ADD COLUMN IF NOT EXISTS inflation_status text;
    """)
    # president_year UPSERT
    execute_values(cur, """
      INSERT INTO president_year
        (iso3,country_name,year,president,approval,poverty_pct,
         homicide_rate,gdp_growth,gdp_comment,political_stance,
         inflation,inflation_source,inflation_status)
      VALUES %s
      ON CONFLICT (iso3,year) DO UPDATE SET
        country_name=EXCLUDED.country_name,
        president=EXCLUDED.president,
        approval=EXCLUDED.approval,
        poverty_pct=EXCLUDED.poverty_pct,
        homicide_rate=EXCLUDED.homicide_rate,
        gdp_growth=EXCLUDED.gdp_growth,
        gdp_comment=EXCLUDED.gdp_comment,
        political_stance=EXCLUDED.political_stance,
        inflation=EXCLUDED.inflation,
        inflation_source=EXCLUDED.inflation_source,
        inflation_status=EXCLUDED.inflation_status
    """, py_rows)

    # cabinet: reemplazo limpio por (iso3,year,portfolio)
    cur.execute("DELETE FROM cabinet_ministers")
    execute_values(cur, """
      INSERT INTO cabinet_ministers
        (iso3,country_name,year,portfolio,minister_name,source_role,political_stance)
      VALUES %s
    """, cab_rows)

    # milestones: reemplazo total por hitos reales
    cur.execute("DELETE FROM milestones")
    execute_values(cur, """
      INSERT INTO milestones (iso3,country_name,year,idx,text)
      VALUES %s
    """, mil_rows)

    # country_indicators UPSERT
    execute_values(cur, """
      INSERT INTO country_indicators
        (iso3,country_name,year,reportes_uif,sentencias_firmes,acceso_negado,
         allanamientos,casos_abiertos,imputaciones,casos_corrupcion,
         criterio_gabinete,fuente_indicadores)
      VALUES %s
      ON CONFLICT (iso3,year) DO UPDATE SET
        country_name=EXCLUDED.country_name,
        reportes_uif=EXCLUDED.reportes_uif,
        sentencias_firmes=EXCLUDED.sentencias_firmes,
        acceso_negado=EXCLUDED.acceso_negado,
        allanamientos=EXCLUDED.allanamientos,
        casos_abiertos=EXCLUDED.casos_abiertos,
        imputaciones=EXCLUDED.imputaciones,
        casos_corrupcion=EXCLUDED.casos_corrupcion,
        criterio_gabinete=EXCLUDED.criterio_gabinete,
        fuente_indicadores=EXCLUDED.fuente_indicadores
    """, ind_rows)

    con.commit()
    for t in ("president_year", "cabinet_ministers", "milestones",
              "country_indicators"):
        cur.execute(f"SELECT count(*) FROM {t}")
        print(f"  {t}: {cur.fetchone()[0]} filas")
    con.close()
    print("OK")


if __name__ == "__main__":
    main()
