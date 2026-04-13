"use client"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { fetchHandler } from '@/lib/fetch'
import { EditTodoData, todoEditSchema } from '@/types/todo.type'
import { IconEdit } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

async function editTodoMutation({ id, ...formData }: EditTodoData) {
  const res = await fetchHandler(`api/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(formData),
  })
  return res.json()
}

interface Props {
  data: EditTodoData
}

function EditTodo({ data }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: editTodoMutation,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setDialogOpen(false)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const editData = todoEditSchema.parse({
      ...data,
      ...Object.fromEntries(formData.entries()),
    })
    mutate(editData)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <IconEdit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form className='grid gap-6' onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>

          {/* Form */}
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder='Title' defaultValue={data.title} />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={data.description ?? undefined} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTodo