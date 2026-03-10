"""
Database engine and session management.

This module sets up the single async SQLAlchemy engine and a session factory
that the rest of the application uses via the `get_db` FastAPI dependency.

Design decisions:
  - pool_size=20 / max_overflow=10 supports up to 30 concurrent connections,
    which is suitable for a small-to-medium e-commerce workload.
  - expire_on_commit=False prevents lazy-load errors when accessing ORM objects
    after a commit inside an async context.
  - The `Base` class is imported by every model file so all tables are
    registered under the same metadata and Alembic can discover them.
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# ---------------------------------------------------------------------------
# Async engine
# ---------------------------------------------------------------------------
# `echo=settings.DEBUG` logs every SQL statement when DEBUG=True, which is
# useful during development but should be False in production.
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=20,       # Persistent connections kept in the pool
    max_overflow=10,    # Extra connections allowed beyond pool_size under load
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
# `expire_on_commit=False` keeps ORM attributes accessible on model instances
# after the session commits, avoiding implicit async I/O in response serialization.
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ---------------------------------------------------------------------------
# Declarative base
# ---------------------------------------------------------------------------
# All model classes inherit from this. SQLAlchemy uses it to track the schema
# and Alembic uses it for auto-generating migration scripts.
class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------
async def get_db() -> AsyncSession:
    """
    Yield a database session for the duration of a single HTTP request.

    Usage in endpoint:
        async def my_route(db: AsyncSession = Depends(get_db)): ...

    The session is committed on success, rolled back on any exception, and
    always closed in the `finally` block to return the connection to the pool.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
