from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from app.database.db import SessionDep
from app.database.models.todos import Todo
from app.schemas.todos import TodoCreateRequest, TodosGetRequest, TodoUpdateRequest
from app.utils import now_utc

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
def get_all_todos(
    session: SessionDep,
    filters: Annotated[TodosGetRequest, Depends()],
):
    query = (
        select(Todo)
        .where(
            Todo.deleted_at == None,  # noqa: E711
            *filters.apply(),
        )
        .order_by(Todo.created_at)  # type: ignore
    )
    return session.exec(query).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreateRequest, session: SessionDep):
    todo_session = Todo.model_validate(todo)
    session.add(todo_session)
    session.commit()
    session.refresh(todo_session)
    return todo_session


# def get_todo_id(todo_id: int, session: SessionDep):


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    session: SessionDep,
):
    todo = session.get(Todo, todo_id)
    if todo is None or todo.deleted_at is not None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Todo not found")

    todo.deleted_at = now_utc()
    session.commit()


@router.patch("/{todo_id}", status_code=status.HTTP_200_OK)
def update_todo(
    todo_id: int,
    session: SessionDep,
    todo_update: TodoUpdateRequest,
):
    todo = session.get(Todo, todo_id)
    if todo is None or todo.deleted_at is not None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Todo not found")

    for column, value in todo_update.model_dump(exclude_none=True).items():
        setattr(todo, column, value)
    todo.updated_at = now_utc()
    session.commit()
    session.refresh(todo)

    return todo
