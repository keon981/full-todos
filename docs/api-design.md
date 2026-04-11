# API Design — Full Todos

> Base URL: `http://localhost:2026`

## Todos API Schemas

### GET /todos — 取得任務列表

**Query Parameters:**

| 參數         | 類型 | 必填 | 說明               |
| ------------ | ---- | ---- | ------------------ |
| project_id   | int  | 否   | 篩選特定專案的任務 |
| is_completed | bool | 否   | 篩選已完成/未完成  |

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

| 欄位        | 類型        | 必填 | 說明                          |
| ----------- | ----------- | ---- | ----------------------------- |
| title       | string      | 是   | 任務名稱，最少 1 字           |
| description | string      | 否   | 任務描述，預設 ""             |
| project_id  | int \| null | 否   | 所屬專案，預設 null（收件匣） |

```json
{
  "title": "買牛奶",
  "description": "去全聯買低脂牛奶",
  "project_id": null
}
```

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

### PATCH /todos/{id} — 更新任務

**Request Body:**

```json
{
  "title": "買豆漿"
}
```

```json
{
   "is_completed": true
}
```

| 欄位         | 類型          | 必填 | 說明                              |
| ------------ | ------------- | ---- | --------------------------------- |
| title        | string\|null  | 否   | 更新任務名稱，預設 null           |
| description  | string\| null | 否   | 更新任務描述，預設 null（不更新） |
| project_id   | int \| null   | 否   | 更新所屬專案，預設 null（收件匣） |
| is_completed | bool \| null  | 否   | 更新已完成/未完成                 |

**Response 200:**

```json
{
  "id": 1,
  "title": "買豆漿",
  "description": "去全聯買低脂牛奶",
  "is_completed": true,
  "project_id": null,
  "created_at": "2026-03-31T10:00:00Z",
  "updated_at": "2026-03-31T14:00:00Z"
}
```

**Response 404（id不存在）:**

```json
{
   "detail": "Todo not found"
}
```

---

### DELETE /todos/{id} — 刪除任務

(新增 get `/trash`，到時候可以 undo 復原不小心刪除的。這裏的 Delete 只是移動到 trash 區域而不是真正刪除)

**Response 204:**

空回傳

**Response 404（id不存在）:**

```json
{
   "detail": "Todo not found"
}
```

---


## User API Schemas


### POST /auth/register — 註冊

**Request Body:**

| 欄位     | 類型   | 必填 | 說明                               |
| -------- | ------ | ---- | ---------------------------------- |
| username | string | 是   | 使用者名稱（MVP階段不使用帳號）    |
| password | string | 是   | 使用者密碼，至少 6 個字元 |

```json
{
  "username": "root",
  "password": "123456"
}
```

**Response 201:**

```json
{
  "detail": "註冊成功",
  "user": {
    "id": 123,
    "username": "root"
  }
}
```

**Response 409（衝突）:**

```json
{
  "detail": "使用者名稱已被註冊"
}
```

**Response 422（驗證錯誤）:**

> 如密碼強度不足、驗證碼錯誤

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

---

### POST /auth/login — 登入

**Request Body:**

| 欄位     | 類型   | 必填 | 說明                               |
| -------- | ------ | ---- | ---------------------------------- |
| username | string | 是   | 使用者名稱（MVP階段不使用帳號）    |
| password | string | 是   | 使用者密碼，至少 6 個字元 |

```json
{
  "username": "root",
  "password": "123456"
}
```

**Response 200:**

> MVP：登入成功時透過 `Set-Cookie` header 設定 `user_id` cookie

```json
{
  "detail": "登入成功",
  "user": {
    "id": 123,
    "username": "root"
  }
}
```

> Phase 10：改回傳 JWT token

```json
{
  "detail": "登入成功",
  "user": {
    "id": 123,
    "username": "root"
  },
  "token": "abc..."
}
```

**Response 400（登入失敗）:**

```json
{
  "detail": "帳號或密碼錯誤"
}
```

**Response 422（驗證錯誤）:**

> 如密碼強度不足、驗證碼錯誤

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "Field required",
      "type": "missing"
    }
  ]
}
```

---

### DELETE /auth/logout — 登出

> MVP：清除 `user_id` cookie，無需 request body

**Response 204:**

空回傳

> Phase 10：改為驗證 JWT token

| 欄位  | 類型   | 必填 | 說明             |
| ----- | ------ | ---- | ---------------- |
| token | string | 是   | 設置為登出已到期 |

```json
{
  "token": "abc..."
}
```

---

## DB Models

### todos

| 欄位         | 類型                        | 說明                   |
| ------------ | --------------------------- | ---------------------- |
| id           | SERIAL PRIMARY KEY          | 自動遞增               |
| title        | VARCHAR(255) NOT NULL       | 任務名稱               |
| description  | TEXT DEFAULT ''             | 任務描述               |
| is_completed | BOOLEAN DEFAULT false       | 是否已完成             |
| owner_id     | INT REFERENCES users(id)    | 擁有者（哪個使用者的） |
| project_id   | INT REFERENCES projects(id) | 所屬專案（nullable）   |
| created_at   | TIMESTAMP DEFAULT now()     | 建立時間               |
| updated_at   | TIMESTAMP DEFAULT now()     | 更新時間               |
| deleted_at   | TIMESTAMP DEFAULT null      | 刪除時間               |

### users


| 欄位            | 類型                         | 說明       |
| --------------- | ---------------------------- | ---------- |
| id              | SERIAL PRIMARY KEY           | 自動遞增   |
| username        | VARCHAR(255) NOT NULL UNIQUE | 使用者名稱 |
| hashed_password | VARCHAR(255) NOT NULL        | 密碼哈希值 |
