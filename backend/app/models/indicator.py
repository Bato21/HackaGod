"""`indicators` table schema.

Catalog of the weighted institutional indicators that compose the IEA.
This is the indicator *definition* table; per-country values live in
`iea_score_components` keyed by `indicator_id`.
"""

from pydantic import BaseModel, ConfigDict, Field


class Indicator(BaseModel):
    """Definition + weighting of a single IEA pillar indicator."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    label_es: str
    label_en: str
    source_org: str
    source_url: str | None = None
    weight: float = Field(..., gt=0, le=1)
    # +1 = higher value is healthier, -1 = higher value is worse.
    direction: int = Field(..., ge=-1, le=1)
    is_active: bool = True
    description: str | None = None
