# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Todo app（學習用專案）。Monorepo 結構：`api/`（FastAPI）+ `web/`（Next.js）。

學習進度追蹤在 `LEARNING.md`，標記：🤖 = Claude 引導 / 👤 = 自行完成 / 🤝 = 合作。
API 設計規格在 `docs/api-design.md`。

## Development Commands

### API（FastAPI + uv）

```bash
cd api
uv run fastapi dev app/main.py          # Dev server (port 8000)
uv add <package>                         # Add dependency
docker compose -f docker-compose.yaml up -d  # Start PostgreSQL
```

### Web（Next.js + pnpm）

```bash
cd web
pnpm dev           # Dev server (port 3000)
pnpm build         # Production build
pnpm lint          # ESLint
```

## Architecture

```
full-todos/
├── api/              # FastAPI backend (Python 3.13, uv)
│   ├── app/
│   │   ├── main.py       # App entry, lifespan, endpoints
│   │   ├── config.py     # pydantic-settings (reads .env)
│   │   ├── database.py   # Engine, session dependency
│   │   └── models.py     # SQLModel table models
│   ├── docker-compose.yaml
│   ├── Dockerfile
│   └── pyproject.toml
├── web/              # Next.js 16 frontend (React 19, pnpm)
│   ├── app/              # App Router pages
│   └── components/       # shadcn/ui (base-vega style, tabler icons)
├── docs/             # API design specs + learning notes
└── LEARNING.md       # Phase-based learning checklist
```

### Data Flow

```
Next.js (port 3000) → fetch → FastAPI (port 8000) → SQLModel → PostgreSQL (port 5555)
```

### Key Tech Stack

| Layer | Tech |
|-------|------|
| API | FastAPI, SQLModel (ORM), psycopg3 (driver) |
| DB | PostgreSQL 17-alpine (Docker, port 5555) |
| Web | Next.js 16, React 19, Tailwind 4, shadcn/ui |
| Package Mgmt | uv (API), pnpm (Web) |

## Database

PostgreSQL runs in Docker, API runs locally (not in Docker).

```
Connection: See api/.env (credentials not committed to git)
```

## Teaching Rules

這是學習用專案，所有教學必須遵守以下規則：

1. **基礎跑通再進階：** 先用最簡單的方式讓功能跑起來，使用者理解後才引入進階寫法。例如先用單一 Model 完成 CRUD，之後再拆 Base/Create/Public
2. **不建還沒用到的東西：** 當前步驟不需要的 class、function、type 就不要建。不要預建 `pass` 的空 class
3. **修程式碼時同步修文件：** `docs/` 的學習筆記必須和程式碼保持一致，改了 code 就改 docs
4. **自己測試再交付：** 寫完 code 後自己啟動 server、打 endpoint 測試通過，才告訴使用者可以用
5. **查文件順序：** FastAPI 官方文件優先，不夠再查 SQLModel 文件。不要跳過 FastAPI 直接查進階的 SQLModel 文件
6. **不用 Node.js 後端類比：** 禁止用 Prisma、Express、Sequelize 等後端工具做解釋，只能用 React/JS/TS 前端概念類比
7. **進階內容依性質插入適當位置：** 不影響功能的優化進階（如 DB 端時間戳取代 Python 端）放在 docs/ 文件末尾「進階版本」區塊；屬於學習路徑必經的進階（如多個 Model 拆分）則插入 LEARNING.md 的適當位置
8. **敏感資訊要 grep 全 repo：** 改到密碼、連線字串等敏感資訊時，用 grep 掃全 repo 確認沒有其他地方洩露
9. **LEARNING.md 是活的大綱：** 過程中發現缺失、順序不對、需要補充進階內容時，向使用者提出，經確認後更新 LEARNING.md。不要死守原本的大綱，也不要自己偷改
10. **教學進度追蹤在 `.claude/fastapi-learning-progress.md`：** 記錄使用者對各章節的概念掌握程度（不是重複 LEARNING.md 的任務清單）。筆記只寫進行中的項目，記「會什麼、還沒學什麼」，不寫未來計畫

## Conventions

- API design follows `docs/api-design.md` — soft delete via `deleted_at`, `updated_at` on every mutation
- Learning docs go in `docs/` by phase (e.g., `docs/phase-2-infrastructure.md`, `docs/phase-3-inbox-crud.md`)
- Commit messages use emoji prefixes: 🎉 init, ✨ feat, 📃 docs, 🐛 fix
