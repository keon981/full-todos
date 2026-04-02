# Phase 3：收件匣 CRUD

> 目標：實作 Todo 的完整 CRUD API

## 3-1 建立 Todo Model

### SQLModel 的 Model 是什麼？

一個 Python class，同時扮演兩個角色：

```
class Todo(SQLModel, table=True):
    id: int | None = ...
    title: str = ...

# 角色 1：DB 表結構 — SQLModel 根據 class 自動建立 todos table
# 角色 2：資料驗證 — API 收到的資料會自動驗證型別（來自 Pydantic）
```

前端類比：像是一個 TypeScript `interface` 同時能建 DB table 和當 API response type。

### 對應 api-design.md 的 Schema

| DB 欄位 | SQLModel 寫法 | 說明 |
|---------|---------------|------|
| `id SERIAL PRIMARY KEY` | `id: int \| None = Field(default=None, primary_key=True)` | None = 讓 DB 自動產生 |
| `title VARCHAR(255) NOT NULL` | `title: str = Field(max_length=255)` | 必填，最長 255 字 |
| `description TEXT DEFAULT ''` | `description: str = ""` | 預設空字串 |
| `is_completed BOOLEAN DEFAULT false` | `is_completed: bool = False` | 預設未完成 |
| `project_id INT (nullable)` | `project_id: int \| None = None` | Phase 4 才加 foreign key |
| `created_at TIMESTAMP` | `created_at: datetime \| None` | 建立時間 |
| `updated_at TIMESTAMP` | `updated_at: datetime \| None` | 更新時間 |
| `deleted_at TIMESTAMP (nullable)` | `deleted_at: datetime \| None = None` | soft delete 用 |

### 檔案結構

```
api/app/
  __init__.py
  config.py      # 設定
  database.py    # engine + session
  main.py        # 路由 + 啟動
  models.py      # ← 新增：Todo model
```

### 重點：讓 create_db_and_tables() 認得 Model

`SQLModel.metadata.create_all(engine)` 只會建立它「看過」的 model。所以 `models.py` 必須在呼叫 `create_db_and_tables()` 之前被 import，否則 table 不會被建立。

```python
# main.py 中要 import models（即使沒直接用到）
from app.models import Todo  # 這行讓 SQLModel 知道 Todo 的存在
```

### 筆記

> 

---

### 進階版本：由 DB 產生時間戳

目前用 Python 的 `datetime.now()` 產生時間（簡單版）。進階做法是讓 PostgreSQL 的 `now()` 產生，確保時間一致性：

```python
# 進階版 — 用 sa_column 讓 DB 產生時間
from sqlalchemy import Column, DateTime, func

class Todo(SQLModel, table=True):
    # ...其他欄位同上

    created_at: datetime | None = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: datetime | None = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    )
```

**差異：**
- `default_factory`（目前）— Python 端產生時間，`updated_at` 要在 PATCH 手動更新
- `server_default` + `onupdate`（進階）— DB 端產生，`updated_at` 在任何 UPDATE 時自動更新

---

## 3-2 實作 POST /todos

### Endpoint 結構

```python
@app.post("/todos", status_code=201)
def create_todo(todo: Todo, session: SessionDep):
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
```

### 拆解每一步

| 程式碼 | 做了什麼 | 前端類比 |
|--------|----------|----------|
| `todo: Todo` | 接收 request body，自動用 Todo model 驗證型別 | 像 TypeScript 的型別檢查，不符合就回 422 |
| `session.add(todo)` | 把 todo 放進 session 的「待辦區」（尚未寫入 DB） | 像 `setState` 先更新 state，還沒 render |
| `session.commit()` | 真正執行 SQL INSERT，寫入 DB | 像 `flushSync` — 立刻把變更推出去 |
| `session.refresh(todo)` | 從 DB 重新讀取，拿回 DB 產生的欄位（`id`、`created_at`） | 像 fetch 後更新 state 拿到 server 回傳的資料 |
| `return todo` | 回傳完整的 todo（含 DB 產生的欄位）給前端 | response body |

### status_code=201

HTTP 201 Created — 表示「成功建立了一個新資源」。FastAPI 預設回 200，POST 新增資源時慣例用 201。

### 驗證是自動的

因為 `Todo` model 繼承了 `SQLModel`（底層是 Pydantic），FastAPI 收到 request body 時會自動驗證：
- `title` 是必填的 `str`，沒傳就回 422
- `description` 有預設值 `""`，不傳也可以
- `id`、`created_at`、`updated_at` 有預設值，前端不需要傳

### ⚠️ 目前的限制：單一 Model 無法限制輸入欄位

因為 `Todo` 同時當 request body 和 DB model，前端如果傳了 `id`、`created_at`、`deleted_at`，值會被接受並寫入 DB。`default=None` 只在「沒傳」時生效，傳了就覆蓋。

這是 3-6 拆 Model 要解決的問題——用 `TodoCreate`（只含 `title`、`description`、`project_id`）限制前端能傳的欄位。

### 筆記

> 

---

## 3-3 實作 GET /todos（列表）

### Query Parameters — 函式參數即 URL 參數

FastAPI 中，不屬於 path 的函式參數會自動變成 query parameter：

```python
# /todos?project_id=1&is_completed=true
@app.get("/todos")
def list_todos(project_id: int | None = None, is_completed: bool | None = None):
    ...
```

前端類比：
```typescript
// React 需要自己解析 URL 參數
const [searchParams] = useSearchParams()
const projectId = searchParams.get("project_id")  // 手動取、手動轉型

// FastAPI 自動做了：解析 + 轉型 + 驗證，錯誤格式自動回 422
```

### 查詢資料：select + where

POST 用 `session.add()` 寫入，GET 用 `select()` + `session.exec()` 讀取：

| 操作 | 語法 | 說明 |
|------|------|------|
| 查全部 | `select(Todo)` | 相當於 `SELECT * FROM todos` |
| 加條件 | `.where(Todo.欄位 == 值)` | 相當於 `WHERE 欄位 = 值` |
| 執行查詢 | `session.exec(query)` | 送出 SQL |
| 取全部結果 | `.all()` | 回傳 list |

### 設計重點：可選篩選的組合模式

當篩選條件是可選的，不能直接把所有 `.where()` 串在一起——沒傳的條件不該篩選。常見做法是先建立基礎查詢，再用 `if` 動態加條件：

```python
query = select(...)           # 基礎查詢
if 條件A is not None:
    query = query.where(...)  # 有傳才加
if 條件B is not None:
    query = query.where(...)  # 有傳才加
```

### 別忘了：soft delete 過濾

`deleted_at` 有值的 todo 代表「已刪除」，列表不應該顯示。這個條件是**永遠要加的**，不是可選的。

### 筆記

> 
