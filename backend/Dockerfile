# ── Stage 1: build wheels ───────────────────────────────────────────
FROM python:3.12-slim AS builder

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Copy only the requirements first so this layer caches until deps change.
COPY requirements.txt .
RUN pip wheel --wheel-dir /wheels -r requirements.txt


# ── Stage 2: runtime ────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Non-root user for security.
RUN groupadd --system app && useradd --system --gid app --home /app app

WORKDIR /app

# Install from pre-built wheels — no compiler/network in the final image.
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-index --find-links=/wheels -r requirements.txt \
    && rm -rf /wheels

COPY app ./app

USER app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
