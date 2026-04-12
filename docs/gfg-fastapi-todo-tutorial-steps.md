# GfG FastAPI ToDo Tutorial - Step Checklist

> 來源：https://www.geeksforgeeks.org/python/to-do-list-app-using-fastapi/
> 技術棧：FastAPI + SQLAlchemy + SQLite + Jinja2 + passlib[bcrypt] + Cookie Session
> 標記：🤖 = Claude 引導 / 👤 = 你自己完成 / 🤝 = 一起做

## Phase 1：環境準備

- [ ] 1-1. 🤖 安裝套件：`pip install fastapi uvicorn sqlalchemy jinja2 passlib[bcrypt] python-multipart`
- [ ] 1-2. 🤖 建立專案目錄結構（project root + `templates/` 資料夾）

## Phase 2：資料庫設定（`database.py`）

- [ ] 2-1. 🤖 定義 `DATABASE_URL = "sqlite:///./todo.db"`
- [ ] 2-2. 🤖 建立 `engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})`
- [ ] 2-3. 🤖 建立 `SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)`
- [ ] 2-4. 🤖 宣告 `Base = declarative_base()`

## Phase 3：ORM 模型（`models.py`）

- [ ] 3-1. 🤖 定義 `User` model：`id`（PK）、`username`（unique, index）、`hashed_password`
- [ ] 3-2. 🤖 在 `User` 加上 `tasks = relationship("Task", back_populates="owner")`
- [ ] 3-3. 🤖 定義 `Task` model：`id`（PK）、`title`（index）、`completed`（預設 False）、`owner_id`（FK → users.id）
- [ ] 3-4. 🤖 在 `Task` 加上 `owner = relationship("User", back_populates="tasks")`

## Phase 4：Pydantic Schemas（`schemas.py`）

- [ ] 4-1. 🤖 定義 `UserCreate`（`username`、`password`）
- [ ] 4-2. 🤖 定義 `TaskCreate`（`title`）
- [ ] 4-3. 🤖 定義 `TaskResponse`（`id`、`title`、`completed`、`owner_id`）並加入 `Config.orm_mode = True`

## Phase 5：FastAPI 主應用初始化（`app.py`）

- [ ] 5-1. 🤖 import 所需模組（FastAPI、Depends、Request、Form、HTTPException、HTMLResponse、RedirectResponse、Jinja2Templates、Session、CryptContext、database、models）
- [ ] 5-2. 🤖 執行 `Base.metadata.create_all(bind=engine)` 自動建表
- [ ] 5-3. 🤖 初始化 `app = FastAPI()`
- [ ] 5-4. 🤖 設定 `templates = Jinja2Templates(directory="templates")`
- [ ] 5-5. 🤖 建立 `pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")`
- [ ] 5-6. 🤖 實作 `get_db` dependency（`yield` + `finally: db.close()`）

## Phase 6：使用者認證 — Register

- [ ] 6-1. 🤖 實作 `GET /register`：回傳 `register.html` 表單
- [ ] 6-2. 🤖 實作 `POST /register`：接收 `username`、`password` Form
- [ ] 6-3. 🤖 `POST /register`：檢查 username 是否已存在，重複則回傳錯誤
- [ ] 6-4. 🤖 `POST /register`：`pwd_context.hash(password)` 雜湊密碼
- [ ] 6-5. 🤖 `POST /register`：建立 `User` → `db.add` → `db.commit`
- [ ] 6-6. 🤖 `POST /register`：`RedirectResponse(url="/login", status_code=303)`

## Phase 7：使用者認證 — Login / Logout

- [ ] 7-1. 🤖 實作 `GET /login`：回傳 `login.html` 表單
- [ ] 7-2. 🤖 實作 `POST /login`：接收 `username`、`password` Form
- [ ] 7-3. 🤖 `POST /login`：查詢 `User` by username，找不到則回錯誤
- [ ] 7-4. 🤖 `POST /login`：`pwd_context.verify(password, user.hashed_password)` 驗證密碼
- [ ] 7-5. 🤖 `POST /login`：`response.set_cookie(key="user_id", value=str(user.id), httponly=True)`
- [ ] 7-6. 🤖 實作 `GET /logout`：`response.delete_cookie("user_id")` + redirect `/login`

## Phase 8：Task CRUD — 讀取與新增

- [ ] 8-1. 🤖 實作 `GET /`：從 cookie 取 `user_id`、查詢該使用者 tasks、渲染 `index.html`
- [ ] 8-2. 🤖 實作 `GET /add-task`：驗證登入（未登入 redirect `/login`）、渲染 `add_task.html`
- [ ] 8-3. 🤖 實作 `POST /tasks`：接收 `title` Form、驗證登入、建立 `Task(owner_id=user_id)` → commit → redirect `/`

## Phase 9：Task CRUD — 更新與刪除

- [ ] 9-1. 🤖 實作 `POST /tasks/{task_id}/toggle`：驗證登入 + owner、翻轉 `completed`、404 處理
- [ ] 9-2. 🤖 實作 `POST /tasks/{task_id}/update`：接收 `title` Form、驗證 owner、更新 `title`、commit
- [ ] 9-3. 🤖 實作 `POST /tasks/{task_id}/delete`：驗證 owner、`db.delete(task)` + commit、redirect `/`

## Phase 10：HTML Templates（`templates/`）

- [ ] 10-1. 🤖 `templates/register.html`：註冊表單（`username` + `password`）+ error 顯示
- [ ] 10-2. 🤖 `templates/login.html`：登入表單 + error 顯示
- [ ] 10-3. 🤖 `templates/add_task.html`：新增任務表單（`title` + `description` + `deadline` + `category`）
- [ ] 10-4. 🤖 `templates/index.html`：CSS 樣式 + 頁首 hero 區塊
- [ ] 10-5. 🤖 `templates/index.html`：任務卡片 Jinja2 `{% for %}` 迴圈渲染 + 交替配色（紫/黃）
- [ ] 10-6. 🤖 `templates/index.html`：右上角使用者資訊區塊 + Logout 按鈕
- [ ] 10-7. 🤖 `templates/index.html`：時間問候語 JavaScript（Good Morning/Afternoon/Evening/Night）
- [ ] 10-8. 🤖 `templates/index.html`：`editTask()` JS 函式（`prompt` + 動態建立 form 提交）
- [ ] 10-9. 🤖 `templates/index.html`：刪除按鈕 inline `<form method="post" action="/tasks/{id}/delete">`

## Phase 11：啟動與端到端測試

- [ ] 11-1. 🤖 執行 `uvicorn app:app --reload` 啟動伺服器
- [ ] 11-2. 👤 訪問 `http://127.0.0.1:8000/register` 註冊使用者（驗證 username 重複偵測）
- [ ] 11-3. 👤 訪問 `/login` 登入（驗證 cookie 設置、密碼錯誤處理）
- [ ] 11-4. 👤 在主頁新增 2~3 個任務
- [ ] 11-5. 👤 編輯任務標題（測 `editTask()` JS prompt）
- [ ] 11-6. 👤 切換任務完成狀態
- [ ] 11-7. 👤 刪除任務
- [ ] 11-8. 👤 登出並驗證 cookie 清除、重定向回 `/login`
