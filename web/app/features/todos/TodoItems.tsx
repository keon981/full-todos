"use client"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Checkbox } from "../../../components/ui/checkbox"
import { CheckedTodo, TodoData } from "@/types/todo.type"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { fetchHandler } from "@/lib/fetch"
import EditTodo from "@/app/features/todos/EditTodo"
import { DeleteDialog } from "./DeleteDialog"

function TodoItems() {
  const { data, refetch } = useSuspenseQuery<TodoData[]>({
    queryKey: ['todos'],
    queryFn: getTodoHandler
  })

  const { mutate: checkedMutate } = useMutation({
    mutationFn: checkedTodoHandler,
    onSuccess: refetch,
  })

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteTodoHandler,
    onSuccess: refetch,
  })

  return (
    <ItemGroup className="max-w-sm mx-auto">
      {data?.map((item) => (
        <Item key={item.id} variant="outline" className="items-start">
          <ItemMedia>
            <Checkbox
              checked={item.is_completed}
              onCheckedChange={(checked) => {
                checkedMutate({ id: item.id, checked: !!checked })
              }}
            />
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle>{item.title}</ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <EditTodo key={`${item.id}-${item.updated_at}`} data={item} />
            <DeleteDialog onDelete={() => deleteMutate(item.id)} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}

export { TodoItems }

async function getTodoHandler() {
  const res = await fetchHandler('api/todos')
  return res.json()
}

async function checkedTodoHandler({ id, checked }: CheckedTodo) {
  const res = await fetchHandler(`api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_completed: checked }),
  })
  return res.json()
}

async function deleteTodoHandler(id: number) {
  await fetchHandler(`api/todos/${id}`, {
    method: "DELETE"
  })
}