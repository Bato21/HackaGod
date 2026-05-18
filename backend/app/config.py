"""Global configuration.

Loads environment variables through Pydantic Settings so secrets never
live in the codebase. A single cached `Settings` instance is exposed via
`get_settings()` for dependency injection.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly-typed application settings.

    Values are read from the process environment or a local `.env` file.
    Nothing here has a real default for secrets — the app fails fast at
    startup if a required credential is missing.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── Supabase ────────────────────────────────────────────────────
    SUPABASE_URL: str = Field(
        ...,
        description="Project REST URL, e.g. https://<ref>.supabase.co",
    )
    SUPABASE_KEY: str = Field(
        ...,
        description="Publishable / anon key used by the supabase-py client.",
    )

    # ── Groq (legacy, ya no usado — reemplazado por OpenRouter) ──────
    GROQ_API_KEY: str = Field(
        default="",
        description="Groq API key (deprecated). Mantener vacío.",
    )

    # ── OpenRouter (country analysis) ───────────────────────────────
    OPENROUTER_API_KEY: str = Field(
        default="",
        description="OpenRouter API key used by /country/analyze.",
    )
    OPENROUTER_MODEL: str = Field(
        default="anthropic/claude-sonnet-4",
        description="OpenRouter model slug for the country analysis agent.",
    )

    # ── OpenRouter (chatbot) ────────────────────────────────────────
    OPENROUTER_API_KEY_CHATBOT: str = Field(
        default="",
        description="OpenRouter API key dedicated to the /chat endpoint.",
    )
    OPENROUTER_MODEL_CHATBOT: str = Field(
        default="anthropic/claude-haiku-4-5",
        description="OpenRouter model slug for the chatbot.",
    )

    # ── Direct Postgres (transaction pooler) ────────────────────────
    # Use the Supabase connection pooler host (port 6543) with the
    # asyncpg driver: postgresql+asyncpg://user:pass@host:6543/postgres
    DATABASE_URL: str = Field(
        ...,
        description="Async SQLAlchemy DSN to the pooled Postgres endpoint.",
    )

    # ── API surface ─────────────────────────────────────────────────
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "AletheiaPath API"

    # Comma-separated list of allowed CORS origins.
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5500"

    # SQLAlchemy pool tuning (kept small — the pooler does the heavy lifting).
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 5
    DB_ECHO: bool = False

    @property
    def cors_origins_list(self) -> list[str]:
        """CORS origins as a clean list."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return a process-wide cached `Settings` instance."""
    return Settings()  # type: ignore[call-arg]
