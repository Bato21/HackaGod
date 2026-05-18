"""Country AI analysis endpoint — POST /api/v1/country/analyze.

Generates an evidence-based explanation of WHY a country is in its
current corruption/governance state. Uses OpenRouter (model configurable
via OPENROUTER_MODEL env var) and the same data context as the chatbot:
CPI history, presidents, public expenditure, regional ranking.

Output format: structured Markdown with three sections — Lo bueno /
Lo problemático / Lectura general. Cited from Aletheia DB only.
"""

from __future__ import annotations

import time
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.routers.chat import (
    _country_profile,
    _cpi_history,
    _expenditure_summary,
    _presidents,
    _regional_ranking,
)

router = APIRouter(prefix="/country", tags=["country-analysis"])

_OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
_DEFAULT_MODEL = "anthropic/claude-sonnet-4"
_TIMEOUT = 45.0

_SYSTEM = """Eres un analista de gobernanza de **Aletheia** que explica con
evidencia por qué un país está en el nivel de corrupción/transparencia que
tiene. Usas ÚNICAMENTE los datos del bloque DATOS DISPONIBLES (CPI, presidentes,
gasto público, ranking regional). No inventas cifras ni hechos.

REGLAS:
• Escala Aletheia: 100 = muy corrupto, 0 = transparente. MENOR es MEJOR.
• Si el score Aletheia es bajo (<35) → destaca lo bueno (estabilidad, niveles
  de gasto razonables, tendencia mejorando, etc).
• Si el score Aletheia es alto (>55) → destaca los problemas (deterioro CPI,
  rotación presidencial, gasto opaco, posición en ranking).
• Si está en medio → equilibra fortalezas y problemas.
• Cita cifras concretas con año entre paréntesis.
• Compara contra el ranking regional cuando ayude (ej: "peor que 12 de 20
  países LATAM").
• NUNCA atribuyas responsabilidad personal a individuos vivos.

FORMATO obligatorio en Markdown, 3 secciones siempre presentes:

## ✅ Lo bueno
- 2-3 bullets con fortalezas o señales positivas (si no hay, di "Sin
  señales positivas relevantes en los datos.").

## ⚠️ Lo problemático
- 2-3 bullets con debilidades o tendencias negativas (si no hay, di "Sin
  problemas estructurales visibles en los datos.").

## 📊 Lectura general
Un párrafo de 2-3 oraciones que sintetice por qué el país está donde está.

Termina con: `_Fuente: Aletheia DB · CPI TI · presidentes · gasto público_`"""


class AnalyzeRequest(BaseModel):
    iso3: str = Field(..., min_length=3, max_length=3)
    year: int | None = Field(default=None, ge=2010, le=2030)


class AnalyzeResponse(BaseModel):
    analysis: str
    iso3: str
    year: int | None
    sources: list[str]
    model: str
    cached: bool = False


# Simple in-memory cache: {(iso3, year): (timestamp, response)}
_CACHE: dict[tuple[str, int | None], tuple[float, AnalyzeResponse]] = {}
_CACHE_TTL_SECONDS = 60 * 60 * 6  # 6h


async def _build_analysis_context(
    iso3: str, db: AsyncSession
) -> tuple[str, list[str]]:
    parts: list[str] = []
    sources: list[str] = []

    profile = await _country_profile(iso3, db)
    cpi = await _cpi_history(iso3, db)
    pres = await _presidents(iso3, db)
    exp = await _expenditure_summary(iso3, db)
    ranking = await _regional_ranking(db)

    if cpi:
        block = f"=== DETALLE {iso3} ===\n{profile}\n{cpi}"
        if pres:
            block += f"\n{pres}"
        if exp:
            block += f"\n{exp}"
        parts.append(block)
        sources.append(f"Detalle CPI + presidentes + gasto — {iso3}")
    else:
        parts.append(f"=== {iso3} ===\nNO HAY DATOS de {iso3} en Aletheia DB.")

    if ranking:
        parts.append(ranking)
        sources.append("Ranking CPI mundial vía Aletheia DB")

    return "\n\n".join(parts), sources


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Análisis IA del estado de un país (OpenRouter)",
)
async def analyze_country(
    payload: AnalyzeRequest, db: AsyncSession = Depends(get_db)
) -> AnalyzeResponse:
    settings = get_settings()
    api_key = getattr(settings, "OPENROUTER_API_KEY", None)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OPENROUTER_API_KEY no configurada en el backend.",
        )

    iso3 = payload.iso3.upper()
    cache_key = (iso3, payload.year)

    # Cache hit
    cached = _CACHE.get(cache_key)
    if cached and (time.time() - cached[0]) < _CACHE_TTL_SECONDS:
        resp = cached[1].model_copy(update={"cached": True})
        return resp

    context_str, sources = await _build_analysis_context(iso3, db)

    user_prompt = (
        f"Analiza el estado del país {iso3}"
        + (f" para el año {payload.year}" if payload.year else "")
        + ". Explica por qué está donde está según los datos disponibles. "
        + "Usa estrictamente el formato de 3 secciones especificado."
    )

    messages = [
        {"role": "system", "content": _SYSTEM + f"\n\n## DATOS DISPONIBLES\n{context_str}"},
        {"role": "user", "content": user_prompt},
    ]

    model = getattr(settings, "OPENROUTER_MODEL", _DEFAULT_MODEL) or _DEFAULT_MODEL

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aletheia-xi.vercel.app",
        "X-Title": "Aletheia Country Analysis",
    }

    body: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "max_tokens": 700,
        "temperature": 0.35,
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
        analysis = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Respuesta inesperada de OpenRouter.",
        )

    response = AnalyzeResponse(
        analysis=analysis,
        iso3=iso3,
        year=payload.year,
        sources=sources,
        model=model,
        cached=False,
    )
    _CACHE[cache_key] = (time.time(), response)
    return response
