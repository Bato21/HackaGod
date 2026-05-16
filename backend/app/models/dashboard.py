"""Composite response schemas.

Aggregate payloads built by the API by joining several tables so the
frontend renders a country card or a comparison chart from one call.
"""

from pydantic import BaseModel, ConfigDict

from app.models.country import Country
from app.models.iea import IEAScore, IEAScoreComponent
from app.models.risk_signal import RiskSignal


class CountryDashboard(BaseModel):
    """Single-payload country profile: structure (IEA) + dynamics (SRD)."""

    model_config = ConfigDict(from_attributes=True)

    country: Country
    latest_iea: IEAScore | None = None
    iea_components: list[IEAScoreComponent] = []
    active_signals: list[RiskSignal] = []


class CompareIndicator(BaseModel):
    """One indicator's value side-by-side for two countries."""

    indicator_id: int
    code: str
    label_es: str
    weight: float
    country1_value: float | None = None
    country2_value: float | None = None


class CompareResponse(BaseModel):
    """Chart-ready comparison of two countries' indicators + composites."""

    country1: Country
    country2: Country
    country1_composite: float | None = None
    country2_composite: float | None = None
    fiscal_year: int | None = None
    indicators: list[CompareIndicator] = []
