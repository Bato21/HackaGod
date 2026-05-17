#!/usr/bin/env python3
"""
etl_news_classify.py — Asigna country_id correcto a news_events.

El feed (InSight Crime vía Make.com) inserta TODAS las noticias con un
country_id por defecto incorrecto (todas a Chile) aunque marca
mistral_processed=true. El país real SÍ viene en los datos, explícito:

  1. source_url slug   ── /colombia-organized-crime-news/...      (señal fuerte)
  2. topics[]          ── ['extradition, Costa Rica, US']
  3. entities_json     ── {"institutions": ["Brazil","Honduras","Colombia"]}
  4. headline          ── "What Spain's Record Cocaine Bust..."

Clasificador determinista (gazetteer construido desde la tabla countries +
alias de organizaciones criminales / ciudades). Sin LLM: gratis, idempotente.

Uso:
    python etl_news_classify.py --dry-run     # muestra cambios sin aplicar
    python etl_news_classify.py               # aplica UPDATE (solo si difiere)

La función `classify_news(row, gaz)` es reutilizable desde el pipeline de
ingesta: clasificar ANTES del INSERT en vez de re-procesar después.
"""

import argparse
import json
import os
import re
import sys
import unicodedata

import psycopg2
import psycopg2.extras

# ── Alias: organización criminal / ciudad → iso3 ───────────────────────
# Cuando el texto no nombra el país pero sí una entidad inequívoca.
ALIAS_ISO3 = {
    "tren de aragua": "VEN",
    "cartel de los soles": "VEN",
    "gulf clan": "COL",
    "clan del golfo": "COL",
    "gaitanistas": "COL",
    "urabenos": "COL",
    "agc": "COL",
    "shottas": "COL",
    "espartanos": "COL",
    "buenaventura": "COL",
    "primer comando capital": "BRA",
    "pcc": "BRA",
    "comando vermelho": "BRA",
    "sinaloa": "MEX",
    "jalisco nueva generacion": "MEX",
    "cjng": "MEX",
}

# Score por fuente de señal (mayor = más confiable).
W_URL_SLUG = 100
W_ALIAS = 60
W_ENTITY = 12
W_TOPIC = 10
W_HEADLINE = 5


def strip_accents(s: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn"
    )


def norm(s: str) -> str:
    """lower, sin acentos, espacios colapsados, nbsp→espacio."""
    s = strip_accents(str(s or "")).lower()
    s = s.replace("\xa0", " ").replace("-", " ")
    return re.sub(r"\s+", " ", s).strip()


def build_gazetteer(cur) -> dict:
    """
    iso3 → set de frases normalizadas que, si aparecen, implican ese país.
    Construido desde countries (name_es, name_en) + gentilicios LATAM/ES.
    """
    cur.execute("SELECT iso_alpha3, name_es, name_en FROM countries")
    gaz = {}
    for r in cur.fetchall():
        iso3, es, en = r["iso_alpha3"].strip(), r["name_es"], r["name_en"]
        terms = set()
        for n in (es, en):
            if n and len(n) >= 4:
                terms.add(norm(n))
        gaz[iso3] = terms

    # Gentilicios frecuentes en titulares EN/ES (no derivables genéricamente).
    DEMONYMS = {
        "COL": ["colombian", "colombiano", "colombiana"],
        "VEN": ["venezuelan", "venezolano", "venezolana"],
        "CRI": ["costa rican", "costarricense", "costa ricans"],
        "ESP": ["spanish", "spaniard", "espanol", "espanola"],
        "BRA": ["brazilian", "brasileno", "brasilena"],
        "MEX": ["mexican", "mexicano", "mexicana"],
        "HND": ["honduran", "hondureno", "hondurena"],
        "PER": ["peruvian", "peruano", "peruana"],
        "ECU": ["ecuadorian", "ecuatoriano", "ecuatoriana"],
        "ARG": ["argentine", "argentinian", "argentino", "argentina"],
        "USA": ["american", "estadounidense", "u.s.", "united states"],
    }
    for iso3, words in DEMONYMS.items():
        if iso3 in gaz:
            gaz[iso3].update(norm(w) for w in words)
    return gaz


def _scan(text: str, gaz: dict, weight: int, scores: dict) -> None:
    """Suma `weight` a cada país cuya frase aparezca en `text` (ya normalizado)."""
    if not text:
        return
    for iso3, terms in gaz.items():
        for t in terms:
            if t and re.search(r"\b" + re.escape(t) + r"\b", text):
                scores[iso3] = scores.get(iso3, 0) + weight
                break


def classify_news(row: dict, gaz: dict):
    """
    Devuelve (iso3, score, evidencia) o (None, 0, '') si no hay señal.
    row: dict con source_url, topics(list), entities_json(dict|str), headline.
    """
    scores: dict = {}
    why = []

    # 1. URL slug — señal más fuerte: /<pais>-organized-crime-news/ o /<pais>-profile
    url = norm(row.get("source_url") or "")
    m = re.search(r"/([a-z ]+?) organized crime news/", url) or re.search(
        r"/([a-z ]+?) (?:profile|news)/", url
    )
    if m:
        slug = m.group(1).strip()
        for iso3, terms in gaz.items():
            if slug in terms:
                scores[iso3] = scores.get(iso3, 0) + W_URL_SLUG
                why.append(f"url:{slug}->{iso3}")
                break

    # 2. Alias de organizaciones / ciudades
    blob = norm(
        " ".join(
            [
                str(row.get("headline") or ""),
                " ".join(row.get("topics") or []),
                json.dumps(row.get("entities_json") or {}, ensure_ascii=False),
            ]
        )
    )
    for alias, iso3 in ALIAS_ISO3.items():
        if re.search(r"\b" + re.escape(norm(alias)) + r"\b", blob):
            scores[iso3] = scores.get(iso3, 0) + W_ALIAS
            why.append(f"alias:{alias}->{iso3}")

    # 3. entities_json.institutions (lista de países a veces)
    ent = row.get("entities_json")
    if isinstance(ent, str):
        try:
            ent = json.loads(ent)
        except Exception:
            ent = {}
    inst = " ".join((ent or {}).get("institutions", []) or [])
    _scan(norm(inst), gaz, W_ENTITY, scores)

    # 4. topics
    _scan(norm(" ".join(row.get("topics") or [])), gaz, W_TOPIC, scores)

    # 5. headline
    _scan(norm(row.get("headline") or ""), gaz, W_HEADLINE, scores)

    if not scores:
        return None, 0, ""
    best = max(scores.items(), key=lambda kv: kv[1])
    return best[0], best[1], "; ".join(why) or f"text->{best[0]}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="no aplica cambios")
    args = ap.parse_args()

    dsn = os.environ.get("DATABASE_URL", "")
    if not dsn:
        print("ERROR: DATABASE_URL no seteada (source backend/.env)", file=sys.stderr)
        return 1
    dsn = dsn.replace("postgresql+asyncpg://", "postgresql://")

    conn = psycopg2.connect(dsn)
    conn.autocommit = False
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    gaz = build_gazetteer(cur)
    iso2id = {}
    cur.execute("SELECT id, iso_alpha3 FROM countries")
    for r in cur.fetchall():
        iso2id[r["iso_alpha3"].strip()] = r["id"]

    cur.execute(
        """SELECT n.id, n.headline, n.source_url, n.topics, n.entities_json,
                  c.iso_alpha3 AS cur_iso
           FROM news_events n
           LEFT JOIN countries c ON c.id = n.country_id
           ORDER BY n.published_at DESC"""
    )
    rows = cur.fetchall()

    changed = unmatched = same = 0
    for row in rows:
        iso3, score, why = classify_news(row, gaz)
        cur_iso = (row["cur_iso"] or "—").strip()
        head = (row["headline"] or "")[:55]
        if not iso3:
            unmatched += 1
            print(f"  ?  [{cur_iso}] {head}  (sin señal — revisar manual)")
            continue
        if iso3 == cur_iso:
            same += 1
            continue
        changed += 1
        print(f"  →  {cur_iso} ⇒ {iso3}  ({why}, score={score})  {head}")
        if not args.dry_run:
            cur.execute(
                "UPDATE news_events SET country_id = %s WHERE id = %s",
                (iso2id[iso3], row["id"]),
            )

    if args.dry_run:
        conn.rollback()
        print(f"\n[DRY-RUN] {changed} cambiarían · {same} ya OK · {unmatched} sin señal")
    else:
        conn.commit()
        print(f"\nAplicado: {changed} actualizadas · {same} ya OK · {unmatched} sin señal")

    cur.close()
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
