# FastAPI + uv + Docker 教學進度追蹤

> 文章來源：[FastAPI with uv: Install, Run, and Dockerize FastAPI](https://www.markcallen.com/getting-started-with-fastapi-using-uv-and-docker-com/)

---

## 1. 安裝 uv

- [x] 使用 Homebrew 安裝 `uv`（`brew install uv`）

## 2. 初始化專案

- [x] 使用 `uv init` 初始化專案目錄
- [x] 產生 `pyproject.toml`、`README.md`
- [x] 刪除根目錄的 `main.py`（教學指示不需要）

## 3. 建立 FastAPI App

- [x] 建立 `app/main.py`
- [x] 撰寫 `get_ip_address()` — 呼叫 ipify API 取得公開 IP
- [x] 撰寫 `GET /ip` endpoint

## 4. 安裝依賴

- [x] `uv add fastapi --extra standard`
- [x] `uv add requests`

## 5. 本機啟動與測試

- [x] 執行 `uv run fastapi dev`
- [x] 用 `curl localhost:8000/ip` 測試 endpoint 並確認回傳 JSON

---

## 6. 建立 Dockerfile（Docker 化）

### 6.1 概念說明

這個 Dockerfile 使用 **multi-stage build**（多階段建構），目的是讓最終 image 越小越好：

| 階段        | 做什麼                                               | 為什麼                                     |
| ----------- | ---------------------------------------------------- | ------------------------------------------ |
| **builder** | 安裝 `uv`，執行 `uv sync` 安裝所有依賴到 `.venv/`    | 建構階段需要 `uv`，但 production 不需要    |
| **runtime** | 只複製 builder 產出的 `/app`（含 `.venv/` 和程式碼） | 最終 image 不含 `uv`、build tool，體積更小 |

### 6.2 建立 Dockerfile

- [x] 在 `api/` 根目錄建立 `Dockerfile`，內容如下：

```dockerfile
# syntax=docker/dockerfile:1.4

# ── Stage 1: Builder ──────────────────────────────────
FROM python:3.12-slim AS builder

# 從官方 uv image 複製 uv 執行檔（不需要 pip install uv）
COPY --from=ghcr.io/astral-sh/uv:0.8 /uv /uvx /bin/

WORKDIR /app

# 先複製依賴定義檔，利用 Docker layer cache
# 只要這兩個檔沒變，下面的 uv sync 就會用 cache，不用重裝
COPY pyproject.toml uv.lock .

# --frozen: 不更新 lockfile，確保裝的是 lock 裡鎖定的版本
RUN uv sync --frozen

# 再複製程式碼（這層變動頻率高，放後面）
COPY app ./app

# ── Stage 2: Runtime ──────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# 從 builder 複製整個 /app（含 .venv/ 和程式碼）
COPY --from=builder /app /app

EXPOSE 8000

# 直接用 .venv 裡的 fastapi CLI 啟動
# run（非 dev）= production mode，不會 auto-reload
CMD ["/app/.venv/bin/fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0"]
```

> [!NOTE]
> **`fastapi dev` vs `fastapi run` 的差異：**
> - `dev`：開發模式，有 auto-reload、詳細錯誤頁面
> - `run`：Production 模式，關閉 auto-reload、隱藏詳細錯誤
>
> Docker 容器裡用 `run`，因為本地開發的 watch 功能由 Docker Compose 處理。

### 6.3 建構 Docker Image

- [x] 執行以下指令建構 image：

```bash
docker build -t python-fastapi-uv-example:latest .
```

> 第一次會比較慢（需下載 base image），之後有 layer cache 會快非常多。

### 6.4 啟動容器

- [x] 執行以下指令啟動容器：

```bash
docker run -p 8000:8000 python-fastapi-uv-example:latest
```

> `-p 8000:8000`：將容器內的 port 8000 映射到本機的 port 8000。

### 6.5 測試容器化版本

- [x] 開另一個 terminal，執行：

```bash
curl localhost:8000/ip
```

應回傳類似 `{"ip": "203.0.113.42"}` 的 JSON。

- [x] 測試完成後，回到原 terminal，按 `Ctrl+C` 停止容器。

---

## 7. Docker Compose + Watch（開發熱更新）

### 7.1 概念說明

Docker Compose Watch 可以讓你在本機改程式碼時，**不用手動重建 image**：
- **sync**：程式碼檔案變更 → 自動同步到容器內（即時生效）
- **rebuild**：`pyproject.toml` 變更（加了新依賴）→ 自動觸發重建 image

### 7.2 建立 docker-compose.yaml

- [x] 在 `api/` 根目錄建立 `docker-compose.yaml`：

```yaml
services:
  develop:
    build: .                    # 使用當前目錄的 Dockerfile
    ports:
      - "8000:8000"             # port 映射
    develop:
      watch:
        - action: sync          # 程式碼變更 → 自動同步
          path: .               # 監控整個目錄
          target: /app          # 同步到容器內的 /app
          ignore:
            - .venv/            # 排除虛擬環境（不需要同步）
        - action: rebuild       # pyproject.toml 變更 → 自動重建
          path: ./pyproject.toml
```

### 7.3 啟動 Compose + Watch

- [x] 執行以下指令：

```bash
docker compose build && docker compose up --watch
```

> [!TIP]
> 啟動後，你可以直接修改 `app/main.py` 的程式碼，容器會自動同步變更。
> 如果你用 `uv add` 加了新套件（修改了 `pyproject.toml`），容器會自動重建。

---

## 8. 最終驗證

- [x] 瀏覽 http://localhost:8000/ip，確認回傳 JSON：
```json
{"ip": "你的公開 IP"}
```
- [x] 修改 `app/main.py`（例如改 endpoint 的回傳內容），確認 Watch 有自動同步
- [x] `Ctrl+C` 停止 Compose，執行 `docker compose down` 清理容器

---

## 總結

| 階段                                      | 狀態     |
| ----------------------------------------- | -------- |
| 1–5 專案初始化 + 程式碼 + 依賴 + 本機測試 | ✅ 已完成 |
| 6 Dockerfile 建構與測試                   | ✅ 已完成 |
| 7 Docker Compose + Watch                  | ✅ 已完成 |
| 8 最終驗證                                | ✅ 已完成 |
