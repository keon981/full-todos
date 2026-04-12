---
name: 自己先測試再交給使用者
description: Always test code yourself (run server, hit endpoints) before asking user to execute
type: feedback
---

寫完程式碼後要自己啟動、測試確認沒問題，才叫使用者執行。

**Why:** 使用者連續遇到好幾次錯誤才修好，體驗很差。應該在交付前自己驗證。

**How to apply:** 每次修改完程式碼，自己跑 server + 打 endpoint 測試，確認通過後才告訴使用者「可以用了」。
