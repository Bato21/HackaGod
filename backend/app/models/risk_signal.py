"""`risk_signals` table schema.

Dynamic SRD layer. A signal is communicated as an alert and never
mutates the structural IEA score. `embedding` (pgvector) is excluded
from the API payload — it is an internal similarity-search artifact.
"""

from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

SignalStatus = Literal["NEW", "REVIEWING", "CONFIRMED", "DISMISSED"]


class RiskSignal(BaseModel):
    """An emerging corruption-risk pattern detected over a time window."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    country_id: UUID
    pattern_code: str
    signal_strength: float = Field(..., ge=0, le=1)
    window_start: datetime
    window_end: datetime
    claude_summary: str | None = None
    claude_raw_json: dict[str, Any] | None = None
    status: SignalStatus = "NEW"
    detected_at: datetime
    forum_thread_id: UUID | None = None
