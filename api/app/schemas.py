from pydantic import BaseModel

from app.database.models import Todo


class TodosGetRequest(BaseModel):
    project_id: int | None = None
    is_completed: bool | None = None

    def apply(self):
        mapping = [
            (Todo.project_id, self.project_id),
            (Todo.is_completed, self.is_completed),
        ]

        return [column == value for column, value in mapping if value is not None]


class TodoCreateRequest(BaseModel):
    title: str
    is_completed: bool = False
