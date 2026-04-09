from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from app.database.db import SessionDep
from app.database.models import Todo
from app.schemas import TodoCreateRequest, TodosGetRequest

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


@router.get("/{todo_id}", status_code=status.HTTP_200_OK)
def get_todo(
    todo_id: int,
    session: SessionDep,
):
    todo = session.get(Todo, todo_id)
    # TODO(human): 如果 todo 不存在，或被 soft delete 了，都要回 404
    # 提示：
    # 1. session.get() 找不到 primary key 時回傳 None
    # 2. 被 soft delete 的 todo 會有 todo.deleted_at 不是 None
    # 3. 用 raise HTTPException(status_code=404, detail="Todo not found")
    #    來拋出 404。注意是 raise 不是 return
    return todo


@router.post("", status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreateRequest, session: SessionDep):
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo():
    pass
