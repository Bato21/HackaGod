"""`countries` table schema (195 rows).

Reference table, RLS currently disabled. Public-read in practice.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Country(BaseModel):
    """A sovereign country tracked by AletheiaPath."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    iso_alpha2: str = Field(..., min_length=2, max_length=2)
    iso_alpha3: str = Field(..., min_length=3, max_length=3)
    name_es: str
    name_en: str
    region: str = "Latin America"
    capital: str | None = None
    population: int | None = Field(default=None, ge=0)
    flag_emoji: str | None = None
    created_at: datetime
