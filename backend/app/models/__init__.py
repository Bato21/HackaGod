"""Pydantic v2 schemas mirroring the live Supabase tables.

Field names and types track the real database (verified against the
running project), not the idealized spec — the DB is the source of
truth. Where the planning doc used different names (e.g. `briefings`
the actual table is `reports`), the real table is modeled and the
difference is noted in the module docstring.
"""

from app.models.briefing import (
    BriefingGenerateRequest,
    BriefingGenerateResponse,
    Report,
)
from app.models.country import Country
from app.models.dashboard import CompareResponse, CountryDashboard
from app.models.iea import IEAScore, IEAScoreComponent
from app.models.indicator import Indicator
from app.models.policy_case import PolicyCase
from app.models.risk_signal import RiskSignal

__all__ = [
    "BriefingGenerateRequest",
    "BriefingGenerateResponse",
    "Report",
    "Country",
    "CompareResponse",
    "CountryDashboard",
    "IEAScore",
    "IEAScoreComponent",
    "Indicator",
    "PolicyCase",
    "RiskSignal",
]
