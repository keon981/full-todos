from app.database.models.todos import Todo
from sqlmodel import SQLModel


class TodosGetRequest(SQLModel):
    project_id: int | None = None
    is_completed: bool | None = None

    def apply(self):
        mapping = [
            (Todo.project_id, self.project_id),
            (Todo.is_completed, self.is_completed),
        ]

        return [column == value for column, value in mapping if value is not None]


class TodoCreateRequest(SQLModel):
    title: str
    is_completed: bool = False


class TodoUpdateRequest(SQLModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = None
    project_id: int | None = None
