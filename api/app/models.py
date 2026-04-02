from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


def now_utc():
    return datetime.now(timezone.utc)


class Todo(SQLModel, table=True):
    __tablename__ = "todos"  # type: ignore[assignment]

    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: str = ""
    is_completed: bool = False
    project_id: int | None = None
    created_at: datetime | None = Field(default_factory=now_utc)
    updated_at: datetime | None = Field(default_factory=now_utc)
    deleted_at: datetime | None = None
