# Full Todos - Learning Checklist

> 目標：透過練習掌握 FastAPI + PostgreSQL + Docker + 全端 API 整合
> 流程：MVP 全端 — 按功能垂直切片（Todo → User → Project），每個功能前後端做到底再做下一個，最後生產化重構
> 標記：🤖 = Claude 引導 / 👤 = 你自己完成 / 🤝 = 一起做

## Phase 0：API 設計（前置）

### Todo

- [X] 0-1. 🤖 設計 todos table
- [X] 0-2. 🤖 設計 GET /todos
- [X] 0-3. 🤖 設計 POST /todos
- [X] 0-4. 👤 設計 PATCH /todos/{id}
- [X] 0-5. 👤 設計 DELETE /todos/{id}
- [X] 0-6. 👤 決定是否需要 PATCH /todos/{id}/complete，寫下理由

### User（Phase 7 時再做）

- [X] 0-7. 🤖 設計 users table
- [X] 0-8. 🤖 設計 POST /auth/register
- [X] 0-9. 🤖 設計 POST /auth/login
- [X] 0-10. 🤖 設計 DELETE /auth/logout

### Project（Phase 8 再做）

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

## Phase 3：ORM 模型（`app/database/models/`）

- [X] 3-1. 🤖 定義 `Todo` SQLModel class（含 `id`、`title`、`description`、`is_completed`、`project_id` 預留欄位、`created_at`/`updated_at`/`deleted_at`）
- [X] 3-2. 🤖 定義 `User` SQLModel class（含 `id`、`username`、`hashed_password`）
- [ ] 3-3. 👤 定義 `Project` SQLModel class（含 `id`、`name`、`description`、`owner_id`）

## Phase 4：Pydantic Schemas（`app/schemas/`）

- [X] 4-1. 🤖 定義 `TodoCreateRequest`
- [X] 4-2. 🤖 定義 `TodosGetRequest`
- [X] 4-3. 🤖 在 `TodosGetRequest` 寫 `apply()` 漸進式 WHERE 方法
- [X] 4-4. 🤖 定義 `UserCreate`（`username`、`password`；register 與 login 共用）
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

## Phase 7：Todo 前端（Next.js）

- [X] 7-1. 🤝 收件匣頁面：列出 todos（GET /todos + 渲染列表）
- [X] 7-2. 👤 收件匣：新增任務功能（表單元件 + POST /todos 接線）
- [X] 7-3. 👤 收件匣：完成狀態 checkbox（PATCH /todos/{id}）
- [X] 7-4. 👤 收件匣：刪除任務按鈕（DELETE /todos/{id}）

## Phase 8：User Auth（後端 + 前端）

> MVP 用 **Argon2 雜湊密碼 + cookie 存 user_id**。進階 JWT 留到 Phase 10。

### 套件與工具

- [ ] 8-1. 🤖 安裝 `pwdlib[argon2]`
- [ ] 8-2. 🤖 建立 `app/auth.py`
- [ ] 8-3. 🤖 在 `app/auth.py` 寫 `password_hash = PasswordHash.recommended()`

### Auth endpoints

- [ ] 8-4. 🤝 建立 `app/routers/auth.py`（空 `APIRouter`）
- [ ] 8-5. 🤝 在 `main.py` 加 `app.include_router(auth.router, prefix="/auth")`
- [ ] 8-6. 🤝 實作 POST /auth/register
- [ ] 8-7. 🤝 實作 POST /auth/login
- [ ] 8-8. 🤝 實作 DELETE /auth/logout

### 套用認證到 Todo

- [ ] 8-9. 👤 寫 `get_current_user` dependency（從 cookie 讀 user_id → 查 User → 無則 401）
- [ ] 8-10. 👤 在 Todo model 加 `owner_id` FK 欄位
- [ ] 8-11. 👤 GET /todos 加 `Depends(get_current_user)` 並只回當前 user 的 todos
- [ ] 8-12. 👤 POST /todos 加 `Depends(get_current_user)` 並把 `owner_id` 設為當前 user
- [ ] 8-13. 👤 DELETE /todos/{id} 加 `Depends(get_current_user)` 並驗證 owner
- [ ] 8-14. 👤 PATCH /todos/{id} 加 `Depends(get_current_user)` 並驗證 owner

### Auth 前端

- [ ] 8-15. 👤 註冊功能（頁面 UI + POST /auth/register 接線）
- [ ] 8-16. 👤 登入功能（頁面 UI + POST /auth/login 接線，fetch 加 `credentials: "include"`）
- [ ] 8-17. 👤 登出按鈕（DELETE /auth/logout）
- [ ] 8-18. 👤 全域登入狀態管理（context / store）

## Phase 9：Projects（API 設計 + 後端 + 前端）

### API 設計

- [ ] 0-11. 👤 設計 projects table
- [ ] 0-12. 👤 設計 POST /projects
- [ ] 0-13. 👤 設計 GET /projects
- [ ] 0-14. 👤 設計 PATCH /projects/{id}
- [ ] 0-15. 👤 設計 DELETE /projects/{id}

### Model & Schema

- [ ] 3-3. 👤 定義 `Project` SQLModel class（含 `id`、`name`、`description`、`owner_id`）
- [ ] 4-5. 👤 定義 `ProjectCreateRequest`
- [ ] 4-6. 👤 定義 `ProjectsGetRequest`

### Router 設置

- [ ] 9-1. 👤 建立 `app/routers/projects.py`（空 `APIRouter`）
- [ ] 9-2. 👤 在 `main.py` 加 `app.include_router(projects.router, prefix="/projects")`

### CRUD endpoints

- [ ] 9-3. 👤 實作 POST /projects（含 `Depends(get_current_user)`）
- [ ] 9-4. 👤 實作 GET /projects（含 `Depends(get_current_user)`）
- [ ] 9-5. 👤 實作 PATCH /projects/{id}（含 `Depends(get_current_user)`）
- [ ] 9-6. 👤 實作 DELETE /projects/{id}（soft delete，含 `Depends(get_current_user)`）

### Todo ↔ Project 關聯

- [ ] 9-7. 👤 在 Project model 加 `owner_id` FK 欄位
- [ ] 9-8. 👤 把 Todo 的 `project_id` 從預留欄位改成 FK 約束
- [ ] 9-9. 👤 為 GET /todos 的 `project_id` 篩選參數寫測試

### Projects 前端

- [ ] 9-10. 👤 sidebar 顯示專案列表（GET /projects）
- [ ] 9-11. 👤 專案詳細頁（依 project_id 篩 todos）

## Phase 10：端到端測試

- [ ] 10-1. 👤 端到端測試：註冊 → 登入 → 建專案 → 新增任務 → 切換完成 → 刪除任務 → 登出

## Phase 11：生產化重構

> MVP 完成後才回頭做的「品質提升」。把 MVP 為了速度而粗糙的地方改成正式寫法。

### Todo Model 拆分

- [ ] 11-1. 🤖 定義 `TodoBase`（共用欄位）
- [ ] 11-2. 🤖 定義 `TodoCreate`（POST 用，繼承 `TodoBase`）
- [ ] 11-3. 🤖 定義 `TodoPublic`（response 用，含 `id` 與時間戳）
- [ ] 11-4. 🤖 定義 `TodoUpdate`（PATCH 用，欄位全 optional）
- [ ] 11-5. 🤝 重構 POST /todos 簽名為 `TodoCreate → TodoPublic`
- [ ] 11-6. 🤝 重構 GET /todos 簽名為 `list[TodoPublic]`
- [ ] 11-7. 🤝 重構 PATCH /todos/{id} 簽名為 `TodoUpdate → TodoPublic`

### 時間戳改用 DB 端

- [ ] 11-8. 👤 `created_at` 改用 `Field(sa_column_kwargs={"server_default": func.now()})`
- [ ] 11-9. 👤 `updated_at` 改用 `Field(sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()})`
- [ ] 11-10. 👤 移除 `app/utils.py` 的 `now_utc()`（如果不再被引用）

### 錯誤處理統一

- [ ] 11-11. 👤 定義統一錯誤 response schema（`{"detail": str, "code": str}`）
- [ ] 11-12. 👤 把所有 `HTTPException` 訊息改用統一格式

### Auth 升級為 JWT

- [ ] 11-13. 🤝 安裝 `python-jose[cryptography]`
- [ ] 11-14. 🤝 在 `app/auth.py` 寫 `create_access_token(data, expires)` 函式
- [ ] 11-15. 🤝 改 POST /auth/login 回傳 `{access_token, token_type}` 而非 set cookie
- [ ] 11-16. 🤝 改 `get_current_user` 從 `Authorization: Bearer <token>` header 解 JWT

### 環境變數分離

- [ ] 11-17. 👤 建立 `.env.dev`
- [ ] 11-18. 👤 建立 `.env.prod`
- [ ] 11-19. 👤 `Settings.model_config` 根據 `APP_ENV` 環境變數選擇 `.env` 檔

---

> **備註 — 結構變更紀錄**
>
> - **v2（2026-04-12）**：從「水平層」改為「垂直切片」— 每個功能（Todo → User → Project）前後端做到底再做下一個。原 Phase 7-9 重新編排為 Phase 7（Todo 前端）→ Phase 8（User 全端）→ Phase 9（Project 全端）。原 Phase 10 重構不變，編號移至 Phase 11。
> - **v1**：照 GfG「水平層」風格——所有後端做完（Phase 7-8）再做所有前端（Phase 9）。舊版備份在 `LEARNING-old.md`
> - **舊 3-5 `GET /todos/{id}`**：仍為「已移除」狀態，詳見 `docs/phase-3-inbox-crud.md`
