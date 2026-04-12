---
name: 基礎先穩再進階，不要空中樓閣
description: Always teach basics before advanced patterns - foundation first, never skip ahead
type: feedback
---

教學原則：基礎先穩再進階，不要空中樓閣直接進階。

**Why:** 使用者還沒熟悉單一 Model 的 CRUD，就被丟了多個 Model 繼承寫法（Base/Create/Public），導致困惑。先讓基礎跑通、理解了，再引入進階概念。

**How to apply:** 
- 每個新概念都建立在使用者已經理解的基礎上
- 先用最簡單的方式跑通，確認理解了，再教進階做法
- 官方教學的順序可以作為參考，但核心是「基礎→進階」的原則
- 查文件時優先查 FastAPI 文件，不夠再查 SQLModel 文件
- 永遠不要因為使用者不懂你提前引入的東西而怪他們
