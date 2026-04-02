---
name: 修程式碼時同步修文件
description: When fixing code errors, immediately update any related docs/teaching files in the same step
type: feedback
---

修完程式碼錯誤後，必須同步更新相關的教學文件（docs/）。不要等使用者提醒才回頭修文件。

**Why:** 文件是使用者邊做邊學的參考資料。如果程式碼修了但文件還留著錯誤的版本，使用者之後翻閱會看到錯誤內容。

**How to apply:** 每次修 bug 或改程式碼後，立刻檢查對應的 docs/ 檔案是否引用了舊的（錯誤的）程式碼或說明，有的話一併修正。這是修 code 的一部分，不是獨立步驟。
