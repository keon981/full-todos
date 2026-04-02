# Full Todos - Learning Checklist

> 目標：透過練習掌握 FastAPI + PostgreSQL + Docker + API 設計
> 流程：API Design-First + Feature Slice（先定義 API 合約，再逐功能開發）
> 標記：🤖 = Claude 引導 / 👤 = 你自己完成 / 🤝 = 一起做

## Phase 1：API 設計 — 定義合約（`docs/api-design.md`）

- [X] 1-1. 🤖 設計 DB Schema — todos table
- [X] 1-2. 🤖 設計 GET /todos、POST /todos
- [X] 1-3. 👤 設計 PATCH /todos/{id}
- [X] 1-4. 👤 設計 DELETE /todos/{id}
- [X] 1-5. 👤 決定是否需要 PATCH /todos/{id}/complete，寫下理由

## Phase 2：基礎建設

- [X] 2-1. 🤖 Docker Compose 建立 PostgreSQL 容器
- [X] 2-2. 🤖 FastAPI 連接 PostgreSQL（SQLAlchemy / SQLModel）
- [X] 2-3. 🤖 設定 CORS（允許 Next.js 跨域請求）

## Phase 3：Feature — 收件匣 CRUD

### 單一 Model — 先用 Todo 跑通全部 CRUD
- [X] 3-1. 🤖 後端：建立 Todo model + migration
- [X] 3-2. 🤝 後端：實作 POST /todos
- [X] 3-3. 👤 後端：用 APIRouter 重構路由結構
- [ ] 3-4. 👤 後端：實作 GET /todos（列表）
- [ ] 3-5. 👤 後端：實作 GET /todos/{id}（單筆）+ 404 處理
- [ ] 3-6. 👤 後端：實作 DELETE /todos/{id}（soft delete）+ 404 處理

### 多個 Model — 重構 + 補 PATCH
- [ ] 3-7. 🤖 後端：拆分 Model（TodoBase / TodoCreate / TodoPublic / TodoUpdate）
- [ ] 3-8. 🤝 後端：重構現有 endpoint 使用新 Model
- [ ] 3-9. 👤 後端：實作 PATCH /todos/{id}（需要 TodoUpdate）

### 前後端串接
- [ ] 3-10. 🤝 前端：收件匣頁面串接 API（Claude 示範 fetch 模式，你完成列表渲染）
- [ ] 3-11. 👤 前端：新增任務表單
- [ ] 3-12. 👤 前端：完成/刪除任務操作

## Phase 4：Feature — 專案分類

- [ ] 4-1. 👤 後端：設計 projects table + API endpoints（寫進 api-design.md）
- [ ] 4-2. 👤 後端：Projects CRUD endpoints 實作
- [ ] 4-3. 👤 後端：GET /todos 加入 project_id 篩選
- [ ] 4-4. 🤝 前端：sidebar 顯示真實專案列表
- [ ] 4-5. 👤 前端：專案頁面串接 API

## Phase 5：Feature — 使用者認證

- [ ] 5-1. 🤖 後端：設計 users table + auth endpoints（寫進 api-design.md）
- [ ] 5-2. 🤝 後端：POST /auth/register、POST /auth/login（JWT）
- [ ] 5-3. 👤 後端：API endpoints 加上認證保護
- [ ] 5-4. 👤 後端：todos / projects 綁定 user
- [ ] 5-5. 🤝 前端：登入/註冊頁面
- [ ] 5-6. 👤 前端：token 儲存 + Authorization header

## Phase 6：部署

- [ ] 6-1. 🤝 Docker Compose 整合 FastAPI + PostgreSQL + Next.js
- [ ] 6-2. 👤 環境變數管理（dev / prod 分離）
- [ ] 6-3. 🤝 部署到雲端
