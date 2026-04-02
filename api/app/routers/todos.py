from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.models import Todo

router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("")
def list_todos(
    session: SessionDep,
    project_id: int | None = None,
    is_completed: bool | None = None,
):
    # TODO(human): 實作查詢邏輯
    # 1. 用 select(Todo) 建立查詢
    # 2. 排除已 soft delete 的項目（deleted_at 不是 None 的）
    # 3. 如果有傳 project_id，加上篩選條件
    # 4. 如果有傳 is_completed，加上篩選條件
    # 5. 用 session.exec() 執行查詢，回傳 .all()
    pass


@router.post("", status_code=HTTPStatus.CREATED)
def create_todo(todo: Todo, session: SessionDep):
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
