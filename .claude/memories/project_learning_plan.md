---
name: full-todos learning plan
description: This project is for practicing Next.js + FastAPI + PostgreSQL + Docker. Frontend is just a shell, focus is on backend learning.
type: project
---

Project purpose: learning full-stack development through a TODO app.

**Why:** User is a frontend React/TS developer with 0 backend experience, learning Python/FastAPI.

**How to apply:**
- Frontend (Next.js + shadcn) is scaffolding, not the learning focus
- Backend (FastAPI) is the main learning target
- 教學順序參照 FastAPI 官方教學 https://fastapi.tiangolo.com/zh/tutorial/sql-databases/
  - 第一階段：單一 Model 跑通全部 CRUD（POST → GET list → GET one → DELETE）
  - 第二階段：拆分多個 Model（Base/Create/Public/Update）+ 重構 + 加 PATCH
- Use client-side fetch (not route.ts) since FastAPI is the separate API server
- Learning checklist is saved at `/LEARNING.md` in project root
- Style: shadcn/ui (base-vega), tabler icons
- Output style: Learning mode (TODO(human) markers for practice)

**Current progress (2026-04-02):**
- Phase 1 (API Design): done
- Phase 2 (Infrastructure): done — PostgreSQL Docker, SQLModel connection, CORS, pydantic-settings config
- Phase 3 (Inbox CRUD): in progress — 3-1 model done, 3-2 POST done, next is 3-3 GET list
- Phase 3 分三段：單一 Model CRUD → 多個 Model 重構 + PATCH → 前後端串接
