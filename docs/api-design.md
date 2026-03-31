# API Design — Full Todos

> Base URL: `http://localhost:2026`

## Todos

### GET /todos — 取得任務列表

**Query Parameters:**

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| project_id | int | 否 | 篩選特定專案的任務 |
| is_completed | bool | 否 | 篩選已完成/未完成 |

**Response 200:**

```json
[
  {
    "id": 1,
    "title": "買牛奶",
    "description": "去全聯買低脂牛奶",
    "is_completed": false,
    "project_id": null,
    "created_at": "2026-03-31T10:00:00Z",
    "updated_at": "2026-03-31T10:00:00Z"
  }
]
```

---

### POST /todos — 新增任務

**Request Body:**

```json
{
  "title": "買牛奶",
  "description": "去全聯買低脂牛奶",
  "project_id": null
}
```

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| title | string | 是 | 任務名稱，最少 1 字 |
| description | string | 否 | 任務描述，預設 "" |
| project_id | int \| null | 否 | 所屬專案，預設 null（收件匣） |

**Response 201:**

```json
{
  "id": 1,
  "title": "買牛奶",
  "description": "去全聯買低脂牛奶",
  "is_completed": false,
  "project_id": null,
  "created_at": "2026-03-31T10:00:00Z",
  "updated_at": "2026-03-31T10:00:00Z"
}
```

**Response 422（驗證錯誤）:**

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

---

### PUT /todos/{id} — 更新任務

> TODO(human): 參考上方格式，自己設計這個 endpoint
> 提示：哪些欄位應該可以被更新？全部都是必填嗎？

---

### DELETE /todos/{id} — 刪除任務

> TODO(human): 參考上方格式，自己設計這個 endpoint
> 提示：成功刪除應該回什麼 status code？body 要回什麼？

---

### PATCH /todos/{id}/complete — 切換完成狀態

> TODO(human): 這個 endpoint 是必要的嗎？還是用 PUT 就能做到？
> 寫下你的想法和決定。

---

## DB Schema

### todos

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 自動遞增 |
| title | VARCHAR(255) NOT NULL | 任務名稱 |
| description | TEXT DEFAULT '' | 任務描述 |
| is_completed | BOOLEAN DEFAULT false | 是否已完成 |
| project_id | INT REFERENCES projects(id) | 所屬專案（nullable） |
| created_at | TIMESTAMP DEFAULT now() | 建立時間 |
| updated_at | TIMESTAMP DEFAULT now() | 更新時間 |
