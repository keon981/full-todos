from datetime import datetime

from app.utils import now_utc
from sqlmodel import Field, SQLModel


class TodoBase(SQLModel):
    title: str = Field(max_length=255)
    description: str | None = None
    is_completed: bool = False
    project_id: int | None = None


class Todo(TodoBase, table=True):
    __tablename__ = "todos"  # type: ignore[assignment]

    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime | None = Field(default_factory=now_utc)
    updated_at: datetime | None = Field(default_factory=now_utc)
    deleted_at: datetime | None = None
