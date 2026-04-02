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
│   │   └── database.py   # Engine, session dependency
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

## Conventions

- API design follows `docs/api-design.md` — soft delete via `deleted_at`, `updated_at` on every mutation
- Learning docs go in `docs/` (e.g., `docs/2-2-connect-postgresql.md`) for each LEARNING.md task
- Commit messages use emoji prefixes: 🎉 init, ✨ feat, 📃 docs, 🐛 fix
