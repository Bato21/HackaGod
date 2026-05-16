"""Database access layer.

Two complementary clients are exposed:

* an **async SQLAlchemy** engine/session for relational and vector
  queries against the existing Supabase Postgres schema (read-optimized,
  uses the transaction pooler);
* the **supabase-py** client for auth-aware or RPC-style calls.

The schema already exists in Supabase (migrations live under
`supabase/migrations/`), so we query it with SQLAlchemy Core `text()`
rather than re-declaring the full ORM — this keeps the API thin and
avoids drift against the source-of-truth migrations.
"""

from collections.abc import AsyncGenerator
from functools import lru_cache

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from supabase import Client, create_client

from app.config import Settings, get_settings


@lru_cache
def get_engine() -> AsyncEngine:
    """Create (once) the async SQLAlchemy engine bound to the pooler."""
    settings: Settings = get_settings()
    return create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DB_ECHO,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_pre_ping=True,
        # Supabase's transaction pooler does not support prepared
        # statement caching across checkouts.
        connect_args={"statement_cache_size": 0},
    )


@lru_cache
def get_sessionmaker() -> async_sessionmaker[AsyncSession]:
    """Return the cached async session factory."""
    return async_sessionmaker(
        bind=get_engine(),
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding a scoped async session."""
    factory = get_sessionmaker()
    async with factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


@lru_cache
def get_supabase() -> Client:
    """Return the cached supabase-py client (auth / RPC use cases)."""
    settings: Settings = get_settings()
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


async def dispose_engine() -> None:
    """Dispose the engine's connection pool on application shutdown."""
    await get_engine().dispose()
