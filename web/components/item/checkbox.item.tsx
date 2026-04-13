"use client"

import * as React from "react"
import { IconEdit } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
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
import { TodoData } from "@/types/todo.type"
import { useSuspenseQuery } from "@tanstack/react-query"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function CheckboxItems() {
  const { data } = useSuspenseQuery<TodoData[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/todos`)
      return res.json()
    }
  })

  return (
    <ItemGroup className="max-w-sm mx-auto">
      {data?.map((item) => (
        <Item key={item.id} variant="outline" className="items-start">
          <ItemMedia>
            <Checkbox />
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle>{item.title}</ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon" className="rounded-full">
              <IconEdit />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}

export { CheckboxItems }