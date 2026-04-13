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
import { Checkbox } from "../ui/checkbox"
import { CheckedTodo, TodoData } from "@/types/todo.type"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { fetchHandler } from "@/lib/fetch"
import EditTodo from "@/app/features/todos/EditTodo"


function CheckboxItems() {
  const { data, refetch } = useSuspenseQuery<TodoData[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetchHandler('api/todos')
      return res.json()
    }
  })

  const { mutate } = useMutation({
    mutationFn: async ({ id, checked }: CheckedTodo) => {
      const res = await fetchHandler(`api/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_completed: checked }),
      })
      return res.json()
    },
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
                mutate({ id: item.id, checked: !!checked })
              }}
            />
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle>{item.title}</ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <EditTodo key={`${item.id}-${item.updated_at}`} data={item} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}

export { CheckboxItems }