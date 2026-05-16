"""`iea_scores` and `iea_score_components` schemas.

`iea_scores` holds one composite score per country per fiscal year.
`iea_score_components` decomposes that score into per-indicator
contributions, each citing its source record (traceability principle).
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class IEAScoreComponent(BaseModel):
    """One indicator's contribution to a composite IEA score."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    iea_score_id: UUID
    indicator_id: int
    raw_value: float | None = None
    normalized_value: float | None = Field(default=None, ge=0, le=100)
    weighted_contribution: float | None = None
    source_record_url: str | None = None
    retrieved_at: datetime | None = None


class IEAScore(BaseModel):
    """Composite Institutional Effectiveness Assessment for a country/year."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    country_id: UUID
    fiscal_year: int = Field(..., ge=2000, le=2100)
    composite_score: float = Field(..., ge=0, le=100)
    band_low: float = Field(..., ge=0)
    band_high: float = Field(..., le=100)
    percentile_rank: float | None = None
    methodology_version: str = "2.0"
    computed_at: datetime
    notes: str | None = None
