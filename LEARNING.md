# Full Todos - Learning Checklist

> 目標：透過練習掌握 FastAPI + PostgreSQL + Docker + 全端 API 整合
> 流程：MVP 全端 — 照 GfG 教學風格，按「一檔案/概念一 Phase」順序，先把後端跑通再做前端，最後生產化重構
> 標記：🤖 = Claude 引導 / 👤 = 你自己完成 / 🤝 = 一起做

## Phase 0：API 設計（前置）

### Todo
- [X] 0-1. 🤖 設計 todos table
- [X] 0-2. 🤖 設計 GET /todos
- [X] 0-3. 🤖 設計 POST /todos
- [X] 0-4. 👤 設計 PATCH /todos/{id}
- [X] 0-5. 👤 設計 DELETE /todos/{id}
- [X] 0-6. 👤 決定是否需要 PATCH /todos/{id}/complete，寫下理由

### User
- [X] 0-7. 🤖 設計 users table
- [ ] 0-8. 🤖 設計 POST /auth/register
- [ ] 0-9. 🤖 設計 POST /auth/login
- [ ] 0-10. 🤖 設計 POST /auth/logout

### Project
- [ ] 0-11. 👤 設計 projects table
- [ ] 0-12. 👤 設計 POST /projects
- [ ] 0-13. 👤 設計 GET /projects
- [ ] 0-14. 👤 設計 PATCH /projects/{id}
- [ ] 0-15. 👤 設計 DELETE /projects/{id}

## Phase 1：環境準備

- [X] 1-1. 🤖 初始化 uv 專案（`uv init`）
- [X] 1-2. 🤖 安裝 `fastapi[standard]`
- [X] 1-3. 🤖 寫 `docker-compose.yaml` 建立 PostgreSQL 17 容器（port 5555）
- [X] 1-4. 🤖 跑 `uv run fastapi dev` 確認 hello world endpoint 可連

## Phase 2：資料庫連線設定

- [X] 2-1. 🤖 用 `pydantic-settings` 在 `app/config.py` 建 `Settings` class
- [X] 2-2. 🤖 寫 `get_settings()` cached 函式
- [X] 2-3. 🤖 在 `app/database/db.py` 建立 SQLModel `engine`
- [X] 2-4. 🤖 寫 `get_session()` generator 函式
- [X] 2-5. 🤖 建立 `SessionDep = Annotated[Session, Depends(get_session)]` 型別別名
- [X] 2-6. 🤖 寫 `create_db_and_tables()` 函式

## Phase 3：ORM 模型（`app/database/models.py`）

- [X] 3-1. 🤖 定義 `Todo` SQLModel class（含 `id`、`title`、`description`、`is_completed`、`project_id` 預留欄位、`created_at`/`updated_at`/`deleted_at`）
- [ ] 3-2. 🤖 定義 `User` SQLModel class（含 `id`、`username`、`hashed_password`）
- [ ] 3-3. 👤 定義 `Project` SQLModel class（含 `id`、`name`、`description`、`owner_id`）

## Phase 4：Pydantic Schemas（`app/schemas.py`）

- [X] 4-1. 🤖 定義 `TodoCreateRequest`
- [X] 4-2. 🤖 定義 `TodosGetRequest`
- [X] 4-3. 🤖 在 `TodosGetRequest` 寫 `apply()` 漸進式 WHERE 方法
- [ ] 4-4. 🤖 定義 `UserCreate`（`username`、`password`；register 與 login 共用）
- [ ] 4-5. 👤 定義 `ProjectCreateRequest`
- [ ] 4-6. 👤 定義 `ProjectsGetRequest`

## Phase 5：FastAPI 主應用初始化骨架（`app/main.py`）

- [X] 5-1. 🤖 寫 `lifespan` async context manager（內含 `create_db_and_tables()`）
- [X] 5-2. 🤖 初始化 `app = FastAPI(lifespan=lifespan)`
- [X] 5-3. 🤖 加 `CORSMiddleware`（讀 settings）

## Phase 6：Todo CRUD endpoints（`app/routers/todos.py`）

- [X] 6-1. 🤝 建立 `app/routers/todos.py`（空 `APIRouter`）
- [X] 6-2. 🤝 在 `main.py` 加 `app.include_router(todos.router, prefix="/todos")`
- [X] 6-3. 🤝 實作 POST /todos
- [X] 6-4. 👤 實作 GET /todos（含 filter 篩選 + 排除 soft deleted）
- [X] 6-5. 👤 實作 DELETE /todos/{id}（soft delete + 404）
- [X] 6-6. 👤 實作 PATCH /todos/{id}

## Phase 7：User Auth + Todo 加認證保護

> MVP 用 **bcrypt 雜湊密碼 + cookie 存 user_id**（照 GfG 最簡單做法）。進階 JWT 留到 Phase 10。

### 套件與工具
- [ ] 7-1. 🤖 安裝 `passlib[bcrypt]`
- [ ] 7-2. 🤖 建立 `app/auth.py`
- [ ] 7-3. 🤖 在 `app/auth.py` 寫 `pwd_context = CryptContext(schemes=["bcrypt"])`
- [ ] 7-4. 🤝 建立 `app/routers/auth.py`（空 `APIRouter`）
- [ ] 7-5. 🤝 在 `main.py` 加 `app.include_router(auth.router, prefix="/auth")`

### Auth endpoints
- [ ] 7-6. 🤝 實作 POST /auth/register
- [ ] 7-7. 🤝 實作 POST /auth/login
- [ ] 7-8. 🤝 實作 POST /auth/logout

### 套用認證到 Todo
- [ ] 7-9. 👤 寫 `get_current_user` dependency（從 cookie 讀 user_id → 查 User → 無則 401）
- [ ] 7-10. 👤 在 Todo model 加 `owner_id` FK 欄位
- [ ] 7-11. 👤 GET /todos 加 `Depends(get_current_user)` 並只回當前 user 的 todos
- [ ] 7-12. 👤 POST /todos 加 `Depends(get_current_user)` 並把 `owner_id` 設為當前 user
- [ ] 7-13. 👤 DELETE /todos/{id} 加 `Depends(get_current_user)` 並驗證 owner
- [ ] 7-14. 👤 PATCH /todos/{id} 加 `Depends(get_current_user)` 並驗證 owner

## Phase 8：Projects CRUD endpoints

### Router 設置
- [ ] 8-1. 👤 建立 `app/routers/projects.py`（空 `APIRouter`）
- [ ] 8-2. 👤 在 `main.py` 加 `app.include_router(projects.router, prefix="/projects")`

### CRUD endpoints
- [ ] 8-3. 👤 實作 POST /projects（含 `Depends(get_current_user)`）
- [ ] 8-4. 👤 實作 GET /projects（含 `Depends(get_current_user)`）
- [ ] 8-5. 👤 實作 PATCH /projects/{id}（含 `Depends(get_current_user)`）
- [ ] 8-6. 👤 實作 DELETE /projects/{id}（soft delete，含 `Depends(get_current_user)`）

### Todo ↔ Project 關聯與測試
- [ ] 8-7. 👤 在 Project model 加 `owner_id` FK 欄位
- [ ] 8-8. 👤 把 Todo 的 `project_id` 從預留欄位改成 FK 約束
- [ ] 8-9. 👤 為 GET /todos 的 `project_id` 篩選參數寫測試

## Phase 9：前端全端整合（Next.js）

- [ ] 9-1. 🤝 收件匣頁面：列出 todos（GET /todos + 渲染列表）
- [ ] 9-2. 👤 收件匣：新增任務功能（表單元件 + POST /todos 接線）
- [ ] 9-3. 👤 收件匣：完成狀態 checkbox（PATCH /todos/{id}）
- [ ] 9-4. 👤 收件匣：刪除任務按鈕（DELETE /todos/{id}）
- [ ] 9-5. 👤 註冊功能（頁面 UI + POST /auth/register 接線）
- [ ] 9-6. 👤 登入功能（頁面 UI + POST /auth/login 接線，fetch 加 `credentials: "include"`）
- [ ] 9-7. 👤 登出按鈕（POST /auth/logout）
- [ ] 9-8. 👤 全域登入狀態管理（context / store）
- [ ] 9-9. 👤 sidebar 顯示專案列表（GET /projects）
- [ ] 9-10. 👤 專案詳細頁（依 project_id 篩 todos）
- [ ] 9-11. 👤 端到端測試：註冊 → 登入 → 建專案 → 新增任務 → 切換完成 → 刪除任務 → 登出

## Phase 10：生產化重構

> MVP 完成後才回頭做的「品質提升」。把 MVP 為了速度而粗糙的地方改成正式寫法。

### Todo Model 拆分
- [ ] 10-1. 🤖 定義 `TodoBase`（共用欄位）
- [ ] 10-2. 🤖 定義 `TodoCreate`（POST 用，繼承 `TodoBase`）
- [ ] 10-3. 🤖 定義 `TodoPublic`（response 用，含 `id` 與時間戳）
- [ ] 10-4. 🤖 定義 `TodoUpdate`（PATCH 用，欄位全 optional）
- [ ] 10-5. 🤝 重構 POST /todos 簽名為 `TodoCreate → TodoPublic`
- [ ] 10-6. 🤝 重構 GET /todos 簽名為 `list[TodoPublic]`
- [ ] 10-7. 🤝 重構 PATCH /todos/{id} 簽名為 `TodoUpdate → TodoPublic`

### 時間戳改用 DB 端
- [ ] 10-8. 👤 `created_at` 改用 `Field(sa_column_kwargs={"server_default": func.now()})`
- [ ] 10-9. 👤 `updated_at` 改用 `Field(sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()})`
- [ ] 10-10. 👤 移除 `app/utils.py` 的 `now_utc()`（如果不再被引用）

### 錯誤處理統一
- [ ] 10-11. 👤 定義統一錯誤 response schema（`{"detail": str, "code": str}`）
- [ ] 10-12. 👤 把所有 `HTTPException` 訊息改用統一格式

### Auth 升級為 JWT
- [ ] 10-13. 🤝 安裝 `python-jose[cryptography]`
- [ ] 10-14. 🤝 在 `app/auth.py` 寫 `create_access_token(data, expires)` 函式
- [ ] 10-15. 🤝 改 POST /auth/login 回傳 `{access_token, token_type}` 而非 set cookie
- [ ] 10-16. 🤝 改 `get_current_user` 從 `Authorization: Bearer <token>` header 解 JWT

### 環境變數分離
- [ ] 10-17. 👤 建立 `.env.dev`
- [ ] 10-18. 👤 建立 `.env.prod`
- [ ] 10-19. 👤 `Settings.model_config` 根據 `APP_ENV` 環境變數選擇 `.env` 檔

---

> **備註 — 與舊版 LEARNING.md 的差異（舊版備份在 `LEARNING-old.md`）**
> - **結構風格**：照 GfG「水平層」風格——每個概念 Phase 跨所有功能（Todo + User + Project）。功能順序（Todo → Auth → Projects）反映在 endpoint Phase 的順序。
> - **概念分類靠 Phase 名稱**：Phase 3 ORM 模型、Phase 4 Schemas 等概念 Phase 直接列所有對應內容（Todo + User + Project），不靠子標題分類
> - **生產化重構獨立 Phase 10**：Model 拆分、DB 時間戳、JWT、環境變數分離等優化統一延後到 MVP 完成後
> - **部署移出 MVP**：原 Phase 6「部署」移除（照 GfG 風格 MVP 不含部署），需要時再開 Phase 11
> - **舊 3-5 `GET /todos/{id}`**：仍為「已移除」狀態，詳見 `docs/phase-3-inbox-crud.md`
