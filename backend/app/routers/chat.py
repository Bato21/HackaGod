"""Chatbot endpoint — POST /api/v1/chat.

Llama 3.3 70B vía OpenRouter (gateway). Acceso completo a tablas de
datos (cpi_scores, countries, presidents, public_expenditures). Sin
acceso a tablas de usuario (user_profiles, forum_*, country_follows,
post_likes). Respuestas cortas y precisas, limitadas al scope de
Aletheia.
"""

import re
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db

router = APIRouter(prefix="/chat", tags=["chat"])

_OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
_DEFAULT_MODEL = "anthropic/claude-haiku-4-5"
_TIMEOUT = 45.0

_SYSTEM = """Eres el asistente de datos de **Aletheia**.

INSTRUCCIÓN PRINCIPAL:
Responde ÚNICAMENTE con los datos del bloque DATOS DISPONIBLES.
Para scores, rankings y cifras: usa solo los números que aparecen ahí.
Si preguntan un score específico que NO está → "No tengo ese dato en Aletheia DB."
Para rankings (más/menos corrupto): USA el ranking inyectado, identifica
la posición 1 o la última posición según corresponda.

ESCALAS — no confundir jamás:
• CPI original TI: 100=muy transparente, 0=muy corrupto. MAYOR CPI = MENOS corrupto.
• Aletheia score (invertido): 100=muy corrupto, 0=transparente. MAYOR = MÁS corrupto.
→ Responde siempre en Aletheia score.

SCOPE: CPI/corrupción, presidentes, gasto público, gobernanza LATAM.
Fuera de scope → "Eso está fuera de mis datos Aletheia."

FORMATO:
• Max 4 oraciones simples, 8 para análisis o comparaciones
• Cita: "Aletheia score X/100 (AÑO)"
• Termina con: [Fuente: CPI TI vía Aletheia DB]"""


# ── Detección de países mencionados ──────────────────────────────────

_ISO_ALIASES: dict[str, str] = {
    "mexico": "MEX", "méxico": "MEX", "chile": "CHL", "argentina": "ARG",
    "colombia": "COL", "perú": "PER", "peru": "PER", "brasil": "BRA",
    "brazil": "BRA", "venezuela": "VEN", "bolivia": "BOL", "ecuador": "ECU",
    "paraguay": "PRY", "uruguay": "URY", "cuba": "CUB", "haiti": "HTI",
    "haití": "HTI", "guatemala": "GTM", "honduras": "HND", "nicaragua": "NIC",
    "panama": "PAN", "panamá": "PAN", "costa rica": "CRI", "el salvador": "SLV",
    "dominicana": "DOM", "república dominicana": "DOM", "jamaica": "JAM",
    "trinidad": "TTO", "guyana": "GUY", "surinam": "SUR",
    "estados unidos": "USA", "usa": "USA", "eeuu": "USA",
    "china": "CHN", "rusia": "RUS", "dinamarca": "DNK", "somalia": "SOM",
}


def _detect_iso3s(message: str) -> list[str]:
    msg = message.lower()
    found = []
    for alias, iso in _ISO_ALIASES.items():
        if alias in msg and iso not in found:
            found.append(iso)
    # Also match bare ISO3 codes (3 uppercase letters)
    for m in re.findall(r'\b([A-Z]{3})\b', message):
        if m not in found:
            found.append(m)
    return found[:3]  # max 3 countries per query


# ── Builders de contexto (solo tablas de datos) ───────────────────────

async def _cpi_history(iso3: str, db: AsyncSession) -> str:
    rows = (
        await db.execute(
            text(
                "SELECT year, cpi_score, aletheia_score "
                "FROM cpi_scores WHERE iso3=:iso3 AND year>=2017 ORDER BY year DESC"
            ),
            {"iso3": iso3},
        )
    ).mappings().all()
    if not rows:
        return ""
    lines = [
        f"{r['year']}: CPI {r['cpi_score']}/100 → Aletheia {r['aletheia_score']}/100"
        for r in rows
    ]
    return "CPI histórico:\n" + "\n".join(lines)


async def _country_profile(iso3: str, db: AsyncSession) -> str:
    country = (
        await db.execute(
            text(
                "SELECT name_es, region, capital, population "
                "FROM countries WHERE iso_alpha3=:iso3 LIMIT 1"
            ),
            {"iso3": iso3},
        )
    ).mappings().first()
    if not country:
        return f"País {iso3} no encontrado en la base de datos."

    pop = f"{country['population']:,}" if country["population"] else "N/D"
    return (
        f"País: {country['name_es']} | Región: {country['region']} | "
        f"Capital: {country['capital'] or 'N/D'} | Población: {pop}"
    )


async def _presidents(iso3: str, db: AsyncSession) -> str:
    rows = (
        await db.execute(
            text(
                "SELECT p.full_name, p.year_start, p.year_end, "
                "p.political_stance, p.party, p.is_current "
                "FROM presidents p JOIN countries c ON c.id=p.country_id "
                "WHERE c.iso_alpha3=:iso3 AND p.year_start>=2010 "
                "ORDER BY p.year_start DESC LIMIT 5"
            ),
            {"iso3": iso3},
        )
    ).mappings().all()
    if not rows:
        return ""
    lines = [
        f"{'[ACTUAL] ' if r['is_current'] else ''}{r['full_name']} "
        f"({r['year_start']}–{r['year_end'] or 'presente'}) "
        f"| {r['political_stance'] or ''} {r['party'] or ''}"
        for r in rows
    ]
    return "Presidentes recientes:\n" + "\n".join(lines)


async def _expenditure_summary(iso3: str, db: AsyncSession) -> str:
    rows = (
        await db.execute(
            text(
                """
                SELECT pe.sector, pe.fiscal_year, SUM(pe.amount) AS total
                FROM public_expenditures pe
                JOIN countries c ON c.id=pe.country_id
                WHERE c.iso_alpha3=:iso3 AND pe.scale='pct_gdp'
                  AND pe.fiscal_year>= (
                    SELECT MAX(fiscal_year)-2 FROM public_expenditures
                    JOIN countries cc ON cc.id=country_id WHERE cc.iso_alpha3=:iso3
                  )
                GROUP BY pe.sector, pe.fiscal_year
                ORDER BY pe.fiscal_year DESC, total DESC
                LIMIT 10
                """
            ),
            {"iso3": iso3},
        )
    ).mappings().all()
    if not rows:
        return ""
    lines = [f"  {r['fiscal_year']} {r['sector']}: {round(r['total'],2)}% PIB" for r in rows]
    return "Gasto público (% PIB, sectores principales):\n" + "\n".join(lines)


async def _regional_ranking(db: AsyncSession) -> str:
    rows = (
        await db.execute(
            text(
                """
                SELECT c.name_es, c.region, TRIM(cs.iso3) AS iso3,
                       cs.cpi_score, cs.aletheia_score, cs.year
                FROM cpi_scores cs
                JOIN countries c ON TRIM(c.iso_alpha3) = TRIM(cs.iso3)
                WHERE cs.year=(SELECT MAX(year) FROM cpi_scores)
                ORDER BY cs.aletheia_score ASC
                """
            )
        )
    ).mappings().all()
    if not rows:
        return ""
    year = rows[0]["year"] if rows else "?"

    _LATAM = {"América del Sur", "América Central", "Caribe", "América del Norte"}

    all_rows   = list(rows)
    latam_rows = [r for r in all_rows if (r["region"] or "") in _LATAM]
    # most transparent = low aletheia (already ASC), most corrupt = high aletheia (reverse)
    most_transparent = all_rows[:15]
    most_corrupt     = list(reversed(all_rows))[:15]

    def fmt(r, i, label=""):
        return (
            f"  {i+1}. {r['name_es']} ({r['iso3']}) [{r['region']}]: "
            f"CPI {r['cpi_score']}/100 → Aletheia {r['aletheia_score']}/100"
        )

    def fmt_latam(r, i):
        return (
            f"  {i+1}. {r['name_es']} ({r['iso3']}): "
            f"CPI {r['cpi_score']}/100 → Aletheia {r['aletheia_score']}/100"
        )

    out  = f"AÑO DE LOS DATOS: {year}\n\n"
    out += f"=== PAÍSES MÁS TRANSPARENTES DEL MUNDO (menor Aletheia = menos corrupto) ===\n"
    out += "\n".join(fmt(r, i) for i, r in enumerate(most_transparent))
    out += f"\n\n=== PAÍSES MÁS CORRUPTOS DEL MUNDO (mayor Aletheia = más corrupto) ===\n"
    out += "\n".join(fmt(r, i) for i, r in enumerate(most_corrupt))
    out += f"\n\n=== RANKING LATAM COMPLETO (de menos a más corrupto) ===\n"
    latam_sorted = sorted(latam_rows, key=lambda r: r["aletheia_score"])
    out += "\n".join(fmt_latam(r, i) for i, r in enumerate(latam_sorted))
    return out


async def _build_context(
    message: str, country_iso3: str | None, db: AsyncSession
) -> tuple[str, list[str]]:
    """Pull data-only context. Always includes global ranking + per-country detail."""
    parts: list[str] = []
    sources: list[str] = []

    # ALWAYS inject full ranking so model never needs to guess scores
    ranking = await _regional_ranking(db)
    if ranking:
        parts.append(ranking)
        sources.append("CPI TI — ranking mundial vía Aletheia DB")

    # Detect countries from message + explicit param
    isos = _detect_iso3s(message)
    if country_iso3 and country_iso3.upper() not in isos:
        isos.insert(0, country_iso3.upper())
    isos = isos[:3]

    # Per-country deep context
    for iso in isos:
        profile = await _country_profile(iso, db)
        cpi     = await _cpi_history(iso, db)
        pres    = await _presidents(iso, db)
        exp     = await _expenditure_summary(iso, db)

        if cpi:
            block = f"=== DETALLE {iso} ===\n{profile}\n{cpi}"
            if pres: block += f"\n{pres}"
            if exp:  block += f"\n{exp}"
            parts.append(block)
            sources.append(f"Detalle CPI + presidentes + gasto — {iso}")
        else:
            # Explicit "no data" so model doesn't hallucinate
            parts.append(f"=== {iso} ===\nNO HAY DATOS de {iso} en Aletheia DB.")

    ctx = "\n\n".join(parts)
    return ctx, sources


# ── Endpoint ──────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    country_iso3: str | None = Field(default=None, min_length=3, max_length=3)
    history: list[dict[str, str]] = Field(default_factory=list, max_length=20)


class ChatResponse(BaseModel):
    response: str
    context_used: list[str]
    model: str = _DEFAULT_MODEL


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat Aletheia — Llama 3.3 70B (OpenRouter) + datos reales de Supabase",
)
async def chat(payload: ChatRequest, db: AsyncSession = Depends(get_db)) -> ChatResponse:
    settings = get_settings()
    api_key = getattr(settings, "OPENROUTER_API_KEY_CHATBOT", "") or getattr(
        settings, "OPENROUTER_API_KEY", ""
    )
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OPENROUTER_API_KEY_CHATBOT no configurada en el backend.",
        )
    model = (
        getattr(settings, "OPENROUTER_MODEL_CHATBOT", None) or _DEFAULT_MODEL
    )

    context_str, sources = await _build_context(
        payload.message, payload.country_iso3, db
    )

    system_prompt = _SYSTEM
    if context_str:
        system_prompt += f"\n\n## DATOS DISPONIBLES (fuente Aletheia DB)\n{context_str}"

    messages: list[dict[str, Any]] = [{"role": "system", "content": system_prompt}]
    for h in payload.history[-8:]:
        if h.get("role") in ("user", "assistant") and h.get("content"):
            messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": payload.message})

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aletheia-xi.vercel.app",
        "X-Title": "Aletheia Chatbot",
    }
    body = {
        "model": model,
        "messages": messages,
        "max_tokens": 512,
        "temperature": 0.4,
    }

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            r = await client.post(_OPENROUTER_URL, headers=headers, json=body)
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="OpenRouter no respondió a tiempo.",
        )
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error de red con OpenRouter: {str(e)}",
        )

    if r.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key de OpenRouter inválida.",
        )
    if r.status_code == 429:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Límite de OpenRouter alcanzado. Reintenta en unos segundos.",
        )
    if r.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"OpenRouter devolvió {r.status_code}: {r.text[:200]}",
        )

    data = r.json()
    try:
        response_text = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Respuesta inesperada de OpenRouter.",
        )

    return ChatResponse(response=response_text, context_used=sources, model=model)
