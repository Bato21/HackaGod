"""Briefing schemas.

The planning doc calls these "briefings"; the live table is `reports`
(one row per generated briefing, linked to the triggering risk signal).
`Report` mirrors that table. The request/response pair drives the
`POST /briefings/generate` endpoint, which is currently a structured
placeholder for the multi-agent writer flow (Scout → Analyst → Pattern
→ Researcher → Validator → Writer/Claude).
"""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Report(BaseModel):
    """A generated briefing persisted in `reports`."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    signal_id: UUID
    generated_by: UUID | None = None
    model_used: str = "claude-opus-4-5"
    content_markdown: str
    comparable_cases: list[dict[str, Any]] | None = None
    token_cost: int | None = None
    generation_ms: int | None = None
    created_at: datetime


class BriefingGenerateRequest(BaseModel):
    """Input to the multi-agent briefing generator."""

    country_id: UUID = Field(..., description="Target country UUID.")
    signal_id: UUID = Field(
        ..., description="Risk signal that triggered the briefing."
    )


class BriefingGenerateResponse(BaseModel):
    """Structured placeholder output of the writer flow.

    `status='mock'` flags that no model was actually invoked yet — the
    shape is final so the frontend can integrate against it now.
    """

    status: str = "mock"
    country_id: UUID
    signal_id: UUID
    model_used: str
    content_markdown: str
    comparable_cases: list[dict[str, Any]]
    pipeline: list[str]
    generated_at: datetime
