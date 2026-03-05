# --Stage 1: builder
FROM python:3.13-slim-trixie AS builder

# 從官方 uv image 複製 uv 執行檔
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 關鍵設定：不使用 symlink（捷徑），強制複製實際檔案，讓 .venv 可以獨立搬移到其他 stage
ENV UV_LINK_MODE=copy
ENV UV_COMPILE_BYTECODE=1

WORKDIR /app

COPY pyproject.toml uv.lock ./

# 第一階段不裝程式碼，先裝好依賴，這層 docker layer 可以被 cache
RUN uv sync --frozen --no-install-project

# 再複製程式碼並完成最終同步
COPY app ./app
RUN uv sync --frozen

# -- stage 2: Runtime
FROM python:3.13-slim-trixie

# 把 Python 加入 PATH，確保可以正確執行
ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# 從 builder 複製整個 /app（含剛剛建立且沒有外連 symlink 的 .venv/ 和程式碼）
COPY --from=builder /app /app

EXPOSE 8000

# 直接用 fastapi CLI 啟動（因為前面已經加了 PATH，所以不需寫絕對路徑）
CMD ["fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0"]