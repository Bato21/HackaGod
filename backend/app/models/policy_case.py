"""`policy_cases` table schema.

Curated real-world reform cases used by the Comparable-Cases engine.
`embedding` (pgvector) is intentionally excluded from the API payload.
"""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

CaseOutcome = Literal[
    "REFORMA_EXITOSA",
    "REFORMA_PARCIAL",
    "SIN_CAMBIO",
    "RETROCESO",
    "EN_CURSO",
    "DESCONOCIDO",
]


class PolicyCase(BaseModel):
    """A documented institutional reform case with a measured outcome."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    country_id: UUID
    pattern_code: str | None = None
    title: str
    abstract: str
    outcome: CaseOutcome
    year_start: int | None = None
    year_end: int | None = None
    source_org: str | None = None
    source_url: str | None = None
    created_at: datetime
