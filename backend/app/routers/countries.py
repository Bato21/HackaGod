"""Country endpoints.

* ``GET /countries``                      — list, filtered by region
* ``GET /countries/{id}/dashboard``       — structure (IEA) + dynamics (SRD)
* ``GET /compare``                        — two-country indicator comparison

All reads go through the async SQLAlchemy session against the existing
Supabase schema. A signal counts as *active* when its status is not
``DISMISSED``.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import (
    CompareResponse,
    Country,
    CountryDashboard,
    IEAScore,
    IEAScoreComponent,
    RiskSignal,
)
from app.models.dashboard import CompareIndicator

router = APIRouter(prefix="/countries", tags=["countries"])
compare_router = APIRouter(tags=["compare"])

_ACTIVE_SIGNAL_FILTER = "status <> 'DISMISSED'"


@router.get("", response_model=list[Country], summary="List countries by region")
async def list_countries(
    region: str = Query(
        default="Latin America",
        description="Region filter. The frontend's 'LATAM' maps to 'Latin America'.",
    ),
    db: AsyncSession = Depends(get_db),
) -> list[Country]:
    """Return every country in ``region`` ordered by Spanish name.

    The frontend uses the label *LATAM*; the stored value is
    *Latin America*, so that alias is accepted transparently.
    """
    normalized = "Latin America" if region.strip().upper() == "LATAM" else region
    result = await db.execute(
        text(
            """
            SELECT id, iso_alpha2, iso_alpha3, name_es, name_en,
                   region, capital, population, flag_emoji, created_at
            FROM countries
            WHERE region = :region
            ORDER BY name_es
            """
        ),
        {"region": normalized},
    )
    return [Country.model_validate(row) for row in result.mappings()]


@router.get(
    "/{country_id}/dashboard",
    response_model=CountryDashboard,
    summary="Country profile: IEA structure + active risk signals",
)
async def country_dashboard(
    country_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> CountryDashboard:
    """Cross structural indicators and active dynamic signals in one payload.

    Resolves: the country row, its most recent ``iea_scores`` row plus
    the per-indicator ``iea_score_components`` breakdown, and every
    non-dismissed ``risk_signals`` row.
    """
    country_row = (
        await db.execute(
            text(
                """
                SELECT id, iso_alpha2, iso_alpha3, name_es, name_en,
                       region, capital, population, flag_emoji, created_at
                FROM countries
                WHERE id = :cid
                """
            ),
            {"cid": str(country_id)},
        )
    ).mappings().first()

    if country_row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Country {country_id} not found",
        )

    latest_iea_row = (
        await db.execute(
            text(
                """
                SELECT id, country_id, fiscal_year, composite_score,
                       band_low, band_high, percentile_rank,
                       methodology_version, computed_at, notes
                FROM iea_scores
                WHERE country_id = :cid
                ORDER BY fiscal_year DESC, computed_at DESC
                LIMIT 1
                """
            ),
            {"cid": str(country_id)},
        )
    ).mappings().first()

    components: list[IEAScoreComponent] = []
    latest_iea: IEAScore | None = None
    if latest_iea_row is not None:
        latest_iea = IEAScore.model_validate(latest_iea_row)
        comp_result = await db.execute(
            text(
                """
                SELECT id, iea_score_id, indicator_id, raw_value,
                       normalized_value, weighted_contribution,
                       source_record_url, retrieved_at
                FROM iea_score_components
                WHERE iea_score_id = :sid
                ORDER BY indicator_id
                """
            ),
            {"sid": str(latest_iea_row["id"])},
        )
        components = [
            IEAScoreComponent.model_validate(r) for r in comp_result.mappings()
        ]

    signals_result = await db.execute(
        text(
            f"""
            SELECT id, country_id, pattern_code, signal_strength,
                   window_start, window_end, claude_summary,
                   claude_raw_json, status, detected_at, forum_thread_id
            FROM risk_signals
            WHERE country_id = :cid AND {_ACTIVE_SIGNAL_FILTER}
            ORDER BY signal_strength DESC, detected_at DESC
            """
        ),
        {"cid": str(country_id)},
    )
    active_signals = [
        RiskSignal.model_validate(r) for r in signals_result.mappings()
    ]

    return CountryDashboard(
        country=Country.model_validate(country_row),
        latest_iea=latest_iea,
        iea_components=components,
        active_signals=active_signals,
    )


@compare_router.get(
    "/compare",
    response_model=CompareResponse,
    summary="Compare two countries' IEA indicators",
)
async def compare_countries(
    country1_id: UUID = Query(..., description="First country UUID."),
    country2_id: UUID = Query(..., description="Second country UUID."),
    db: AsyncSession = Depends(get_db),
) -> CompareResponse:
    """Return a chart-ready, indicator-by-indicator comparison.

    Uses each country's latest ``iea_scores`` row; indicator values come
    from ``iea_score_components`` joined to the ``indicators`` catalog.
    The union of indicators across both countries is returned so the
    frontend can render aligned bars even when coverage differs.
    """
    if country1_id == country2_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="country1_id and country2_id must differ",
        )

    async def _country(cid: UUID) -> Country:
        row = (
            await db.execute(
                text(
                    """
                    SELECT id, iso_alpha2, iso_alpha3, name_es, name_en,
                           region, capital, population, flag_emoji, created_at
                    FROM countries WHERE id = :cid
                    """
                ),
                {"cid": str(cid)},
            )
        ).mappings().first()
        if row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Country {cid} not found",
            )
        return Country.model_validate(row)

    c1 = await _country(country1_id)
    c2 = await _country(country2_id)

    # One CTE per country = its latest IEA score; LEFT JOIN components→indicators.
    rows = (
        await db.execute(
            text(
                """
                WITH latest AS (
                  SELECT DISTINCT ON (country_id)
                         id, country_id, fiscal_year, composite_score
                  FROM iea_scores
                  WHERE country_id IN (:c1, :c2)
                  ORDER BY country_id, fiscal_year DESC, computed_at DESC
                )
                SELECT
                  i.id            AS indicator_id,
                  i.code          AS code,
                  i.label_es      AS label_es,
                  i.weight        AS weight,
                  MAX(l1.fiscal_year)     AS fiscal_year,
                  MAX(l1.composite_score) AS c1_composite,
                  MAX(l2.composite_score) AS c2_composite,
                  MAX(comp1.normalized_value) AS c1_value,
                  MAX(comp2.normalized_value) AS c2_value
                FROM indicators i
                LEFT JOIN latest l1 ON l1.country_id = :c1
                LEFT JOIN latest l2 ON l2.country_id = :c2
                LEFT JOIN iea_score_components comp1
                       ON comp1.iea_score_id = l1.id AND comp1.indicator_id = i.id
                LEFT JOIN iea_score_components comp2
                       ON comp2.iea_score_id = l2.id AND comp2.indicator_id = i.id
                WHERE i.is_active = true
                  AND (comp1.id IS NOT NULL OR comp2.id IS NOT NULL)
                GROUP BY i.id, i.code, i.label_es, i.weight
                ORDER BY i.id
                """
            ),
            {"c1": str(country1_id), "c2": str(country2_id)},
        )
    ).mappings().all()

    indicators = [
        CompareIndicator(
            indicator_id=r["indicator_id"],
            code=r["code"],
            label_es=r["label_es"],
            weight=float(r["weight"]),
            country1_value=(
                float(r["c1_value"]) if r["c1_value"] is not None else None
            ),
            country2_value=(
                float(r["c2_value"]) if r["c2_value"] is not None else None
            ),
        )
        for r in rows
    ]

    fiscal_year = rows[0]["fiscal_year"] if rows else None
    c1_composite = (
        float(rows[0]["c1_composite"])
        if rows and rows[0]["c1_composite"] is not None
        else None
    )
    c2_composite = (
        float(rows[0]["c2_composite"])
        if rows and rows[0]["c2_composite"] is not None
        else None
    )

    return CompareResponse(
        country1=c1,
        country2=c2,
        country1_composite=c1_composite,
        country2_composite=c2_composite,
        fiscal_year=fiscal_year,
        indicators=indicators,
    )
