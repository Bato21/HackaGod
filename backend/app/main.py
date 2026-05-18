"""FastAPI application entrypoint.

Wires CORS (Next.js dev origin), the `/api/v1` routers, a health
probe, and graceful pool disposal on shutdown.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.config import get_settings
from app.database import dispose_engine
from app.routers import briefings, chat, countries, country_analysis


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Dispose the SQLAlchemy connection pool on shutdown."""
    yield
    await dispose_engine()


def create_app() -> FastAPI:
    """Build and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=__version__,
        description=(
            "AletheiaPath — civic-intelligence API bridging the Next.js "
            "frontend with Supabase (Postgres 16 + pgvector)."
        ),
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(countries.router, prefix=settings.API_V1_PREFIX)
    app.include_router(countries.compare_router, prefix=settings.API_V1_PREFIX)
    app.include_router(briefings.router, prefix=settings.API_V1_PREFIX)
    app.include_router(chat.router, prefix=settings.API_V1_PREFIX)
    app.include_router(country_analysis.router, prefix=settings.API_V1_PREFIX)

    @app.get("/health", tags=["meta"], summary="Liveness probe")
    async def health() -> dict[str, str]:
        return {"status": "ok", "version": __version__}

    return app


app = create_app()
