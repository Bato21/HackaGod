"""Briefing generation endpoint.

``POST /briefings/generate`` is the entry point for the multi-agent
writer flow (Scout → Analyst → Pattern → Researcher → Validator →
Writer/Claude). It is currently a **structured placeholder**: it
validates the country/signal, pulls the real context the writer agent
would use (signal summary + comparable policy cases), and returns a
final-shaped Markdown briefing without invoking a model. The response
contract will not change when the real flow is wired in.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import BriefingGenerateRequest, BriefingGenerateResponse

router = APIRouter(prefix="/briefings", tags=["briefings"])

_PIPELINE = [
    "scout",
    "analyst",
    "pattern",
    "researcher",
    "validator",
    "writer",
]
_MODEL = "claude-opus-4-5"


@router.post(
    "/generate",
    response_model=BriefingGenerateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a briefing for a country/signal (mock writer flow)",
)
async def generate_briefing(
    payload: BriefingGenerateRequest,
    db: AsyncSession = Depends(get_db),
) -> BriefingGenerateResponse:
    """Validate inputs, gather context, return a structured mock briefing.

    No model is called yet — ``status='mock'``. The Markdown follows the
    traceability principle (every claim cites its source) so the
    frontend can render the final layout today.
    """
    country = (
        await db.execute(
            text("SELECT id, name_es FROM countries WHERE id = :cid"),
            {"cid": str(payload.country_id)},
        )
    ).mappings().first()
    if country is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Country {payload.country_id} not found",
        )

    signal = (
        await db.execute(
            text(
                """
                SELECT id, pattern_code, signal_strength, claude_summary
                FROM risk_signals
                WHERE id = :sid AND country_id = :cid
                """
            ),
            {"sid": str(payload.signal_id), "cid": str(payload.country_id)},
        )
    ).mappings().first()
    if signal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Risk signal {payload.signal_id} not found "
                f"for country {payload.country_id}"
            ),
        )

    cases = (
        await db.execute(
            text(
                """
                SELECT title, outcome, source_org, source_url
                FROM policy_cases
                WHERE country_id = :cid
                ORDER BY created_at DESC
                LIMIT 3
                """
            ),
            {"cid": str(payload.country_id)},
        )
    ).mappings().all()
    comparable_cases = [dict(c) for c in cases]

    name = country["name_es"]
    pattern = signal["pattern_code"]
    strength = float(signal["signal_strength"])
    summary = signal["claude_summary"] or "_(sin resumen del analista todavía)_"

    cases_md = (
        "\n".join(
            f"- **{c['title']}** — desenlace `{c['outcome']}` "
            f"(fuente: {c['source_org'] or 's/d'})"
            for c in comparable_cases
        )
        or "- _(sin casos comparables curados para este país)_"
    )

    content_markdown = f"""# Briefing — {name}

> ⚠️ **Señal de riesgo dinámica.** Este documento describe un patrón
> institucional emergente. No modifica el Índice Estructural y no
> atribuye responsabilidad a individuos.

## Patrón detectado
- **Código de patrón:** `{pattern}`
- **Fuerza de la señal:** {strength:.2f} / 1.00

## Síntesis del analista
{summary}

## Casos comparados
{cases_md}

---
_Borrador generado por el flujo multi-agente (placeholder). Modelo
objetivo: `{_MODEL}`. Cada afirmación de la versión final citará su
fuente._
"""

    return BriefingGenerateResponse(
        status="mock",
        country_id=payload.country_id,
        signal_id=payload.signal_id,
        model_used=_MODEL,
        content_markdown=content_markdown,
        comparable_cases=comparable_cases,
        pipeline=_PIPELINE,
        generated_at=datetime.now(timezone.utc),
    )
