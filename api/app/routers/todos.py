from typing import Annotated

from app.database.db import SessionDep
from app.database.models import Todo
from app.schemas import TodoCreateRequest, TodosGetRequest
from app.utils import now_utc
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
def get_all_todos(
    session: SessionDep,
    filters: Annotated[TodosGetRequest, Depends()],
):
    query = select(Todo).where(
        Todo.deleted_at == None,  # noqa: E711
        *filters.apply(),
    )
    return session.exec(query).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreateRequest, session: SessionDep):
    todo_session = Todo.model_validate(todo)
    session.add(todo_session)
    session.commit()
    session.refresh(todo_session)
    return todo_session


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    session: SessionDep,
):
    # TODO(human): 實作 soft delete 邏輯
    # 1. 如果 todo 是 None 或已經被 soft delete (deleted_at 不是 None)，
    #    raise HTTPException(status_code=404, detail="Todo not found")
    # 2. 執行 soft delete：對 todo.deleted_at 賦值 now_utc()
    #    ← 這不是 session.delete(todo)，而是「更新欄位」
    # 3. session.commit() 把變更寫入 DB
    # 4. 204 No Content 慣例不回 body，不需要 return
    todo = session.get(Todo, todo_id)
    if todo is None or todo.deleted_at is not None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Not Find")

    todo.deleted_at = now_utc()
    session.commit()
