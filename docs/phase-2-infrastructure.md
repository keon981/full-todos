# Phase 2：基礎建設

> 包含：2-2 FastAPI 連接 PostgreSQL、2-3 設定 CORS

## 概念總覽

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  FastAPI  │────▶│  SQLModel │────▶│  PostgreSQL  │
│ (後端框架) │     │  (ORM)    │     │  (資料庫)     │
└──────────┘     └──────────┘     └──────────────┘
                       │
              ┌────────┴────────┐
              │  SQLAlchemy     │  ← 底層資料庫引擎
              │  + Pydantic     │  ← 資料驗證
              └─────────────────┘
```

**SQLModel 是什麼？**
FastAPI 同作者開發的套件，把 SQLAlchemy（操作 DB）和 Pydantic（驗證資料）合成一個 class。
前端類比：像是一個 TypeScript `interface` 同時能當 API response type 和 DB schema。

---

## Step 1：修復 docker-compose healthcheck

**改了什麼：**
1. 帳密從 hardcode 改為 `${...}` 變數引用，實際值放在 `.env`（被 gitignore）
2. healthcheck 改為 `pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}`

**為什麼：** docker-compose.yaml 會被 commit 進 git，帳密不應該寫死在裡面。Docker Compose 預設讀取同目錄的 `.env` 檔，自動替換 `${...}` 變數。

### 筆記

> 

---

## Step 2：安裝依賴

```bash
cd api && uv add sqlmodel "psycopg[binary]"
```

| 套件 | 用途 |
|------|------|
| `sqlmodel` | ORM — 定義 model class 對應 DB table |
| `psycopg[binary]` | PostgreSQL driver — 實際與 DB 溝通的底層驅動 |

**前端類比：** `sqlmodel` 像是用 TypeScript `interface` 定義資料結構，但它還能自動幫你建 DB table 和驗證資料。`psycopg` 則像 `fetch` 底層的 HTTP 協議 — 你不會直接用它，但沒有它就連不上 DB。

### 筆記

> 

---

## Step 3：建立 `api/app/database.py`

這個檔案負責「連線設定」，不處理商業邏輯。

建立前先確認檔案結構：

```
api/app/
  __init__.py   ← 空檔案，讓 Python 把 app/ 當作 package（JS/TS 不需要這個，Python 需要）
  main.py
  database.py
```

### 3-1. 連線字串（DATABASE_URL）

```
postgresql+psycopg://user:password@localhost:5555/todos_db
├── protocol ──────┘     │    │        │         │
├── user ────────────────┘    │        │         │
├── password ─────────────────┘        │         │
├── host:port ─────────────────────────┘         │
└── database name ───────────────────────────────┘
```

### 3-2. Engine

```python
engine = create_engine(DATABASE_URL)
```

**Engine 是什麼？**
管理「連線池」的物件。不會每次 request 都重新連線 DB，而是重複利用已建立的連線。
前端類比：像是 `axios.create({ baseURL: '...' })` — 建立一次，到處重用。

### 3-3. get_session()（你來寫！）

**Session 是什麼？**
每次 API request 用來跟 DB 溝通的「對話」。用完就關掉，避免佔用連線。

FastAPI 用 **Dependency Injection** 自動把 session 傳給 endpoint：

```python
# 前端類比
# React Context：Provider 提供值，Consumer 自動拿到
# FastAPI Depends：get_session 提供值，endpoint 參數自動拿到

# React:
# <SessionContext.Provider value={session}>
#   <MyComponent />  ← 自動拿到 session
# </SessionContext.Provider>

# FastAPI:
# @app.get("/todos")
# def get_todos(session: Session = Depends(get_session)):
#     ...  ← 自動拿到 session
```

### 筆記

> 

---

## Step 4：更新 `api/app/main.py`

### 4-1. Lifespan（應用程式生命週期）

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- 啟動時執行 ---
    create_db_and_tables()
    yield
    # --- 關閉時執行 ---（目前不需要）
```

**前端類比：** 像 React 的 `useEffect` cleanup pattern：
```typescript
useEffect(() => {
  // 啟動時（mount）
  initDB()
  return () => {
    // 關閉時（unmount）
  }
}, [])
```

### 4-2. GET /health

測試 DB 是否連得上的 endpoint。開發時很實用，一打開就知道有沒有問題。

```python
@app.get("/health")
def health():
    with Session(engine) as session:
        session.exec(select(1))  # 用 SQLModel 的 select，不用原生 SQL
        return {"status": "healthy"}
```

### 筆記

> 

---

## 補充：`session.exec()` vs `session.execute()`

SQLModel 的 Session 同時有兩個方法可用：

| 方法 | 來源 | 接受什麼 | 回傳什麼 |
|------|------|----------|----------|
| `session.exec()` | SQLModel | `select(Model)` 等 ORM query | Model 物件 |
| `session.execute()` | SQLAlchemy | 任何 SQL（包括 `text("...")` 原生 SQL） | Row |

本專案統一用 `session.exec()` + `select()`。

---

# 2-3 設定 CORS

> 目標：讓 Next.js（port 3000）能跨域請求 FastAPI（port 8000）

## CORS 是什麼？

瀏覽器的安全機制：不同 origin（protocol + domain + port）之間的請求會被擋。

```
http://localhost:3000  →  http://localhost:8000
      Next.js                   FastAPI
      (origin A)                (origin B)
      
瀏覽器：「不同 origin，擋下來！」
除非 FastAPI 回應 header 說：「我允許 localhost:3000 來的請求」
```

前端類比：像 `<iframe>` 的 `sandbox` 屬性 — 預設什麼都不能做，要明確開放權限。

## Step 1：進階配置 — `config.py`

CORS 設定（和 DB 連線等）不直接寫在 `main.py`，而是集中到 `config.py`：

```python
# api/app/config.py
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str  # 沒有預設值 → 必須從 .env 或環境變數提供

    cors_origins: list[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def get_settings():
    return Settings()
```

三個重點：

- **`model_config = SettingsConfigDict(env_file=".env", extra="ignore")`** — 讓 Settings 自動讀取 `.env` 檔的值來覆蓋預設值。`extra="ignore"` 讓 pydantic 忽略 `.env` 裡不在 Settings 中的變數（如 `POSTGRES_*` 是給 Docker 用的）
- **`@lru_cache`** — 快取結果，`.env` 只讀一次，不會每個 request 都重新讀檔
- **不在模組層級建立 `settings = Settings()`** — 改用 `get_settings()` 函數，方便測試時替換

**為什麼要分開？**

```
# ❌ 設定散落各處
main.py    → origins = ["*"]
database.py → DATABASE_URL = "postgresql+psycopg://..."

# ✅ 集中管理
config.py  → 所有設定在這裡
main.py    → from app.config import get_settings
database.py → from app.config import get_settings
```

前端類比：像是把散落在各 component 的 `const API_URL = '...'` 集中到 `.env` + `import.meta.env`。

**`pydantic-settings` 的好處：**
- class 屬性 = 設定項目，有型別和預設值
- 自動從環境變數讀值（例如設定 `DATABASE_URL` 環境變數就會覆蓋預設值）
- 之後部署時只需改環境變數，不用改程式碼

## Step 2：在 main.py 套用

```python
from app.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)
```

### CORS 參數說明

| 參數 | 目前值 | 說明 |
|------|--------|------|
| `allow_origins` | `["*"]` | 允許哪些 origin 來的請求。`*` = 全部允許（開發用），production 應改為 `["http://localhost:3000"]` |
| `allow_credentials` | `True` | 是否允許帶 Cookie / Authorization header |
| `allow_methods` | `["*"]` | 允許哪些 HTTP method（GET、POST、PATCH 等） |
| `allow_headers` | `["*"]` | 允許哪些 request header |

### 筆記

> 

---

## 驗證

```bash
# 1. 啟動 PostgreSQL（Docker）
docker compose -f api/docker-compose.yaml up -d

# 2. 啟動 FastAPI（本機）
cd api && uv run fastapi dev app/main.py

# 3. 測試 DB 連線
# http://localhost:8000/health → {"status": "healthy"}

# 4. 測試 CORS headers
curl -s -I -X OPTIONS http://localhost:8000/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
# 應該看到 access-control-allow-origin: *
```
