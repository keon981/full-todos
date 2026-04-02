# 2-2 FastAPI 連接 PostgreSQL（SQLModel）

> 目標：讓 FastAPI 能透過 SQLModel 連上 PostgreSQL，為後續 CRUD 打底

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

**改了什麼：** `pg_isready -U todos_user` → `pg_isready -U root`

**為什麼：** `POSTGRES_USER=root` 建立的使用者是 `root`，但 healthcheck 檢查 `todos_user`（不存在），會一直回報 unhealthy。

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

### 3-1. 連線字串（DATABASE_URL）

```
postgresql+psycopg://root:123456@localhost:5555/todos_db
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

### 筆記

> 

---

## 驗證

```bash
# 1. 啟動 PostgreSQL（Docker）
docker compose -f api/docker-compose.yaml up -d

# 2. 啟動 FastAPI（本機）
cd api && uv run fastapi dev app/main.py

# 3. 測試
# http://localhost:8000/health → {"status": "healthy"}
# http://localhost:8000/docs   → Swagger UI
```
