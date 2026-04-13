---
name: 不要提前建立還沒用到的程式碼
description: Only create code when it's actually needed in the current step, don't pre-build unused types/schemas
type: feedback
---

每個步驟只建當下需要的東西，不要提前建立「之後可能會用到」的程式碼。

**Why:** 提前建立還沒用到的 class（如 TodoCreate、TodoPublic）會讓使用者困惑 — 為什麼要建一個 pass 的空 class？也違反 YAGNI 原則。

**How to apply:** 嚴格按照當前任務的範圍來寫程式碼。例如 3-1 是「建 Todo model」就只建 Todo(table=True)，3-2 才需要 TodoCreate 時再建。
