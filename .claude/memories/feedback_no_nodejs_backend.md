---
name: 禁止用 Node.js 後端類比
description: Never use Node.js backend tools (Prisma, Express, etc.) as analogies - user has zero backend experience
type: feedback
---

對比解釋 Python 概念時，禁止使用 Node.js 後端工具（Prisma、Express、Sequelize 等）做類比。

**Why:** 使用者是純前端開發者，沒碰過任何後端框架。用 Prisma 類比 SQLModel 等於用一個不認識的東西解釋另一個不認識的東西。

**How to apply:** 類比只能用 React/JS/TS 前端概念（interface、fetch、useEffect、Context 等）。如果沒有好的前端類比，直接解釋概念本身，不要硬湊。
