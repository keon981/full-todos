"use client"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { CreateTodoData, todoFormSchema } from '@/types/todo.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

async function editTodoMutation(formData: CreateTodoData) {
  const res = await fetchHandler('api/todos', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
  return res.json()
}

function EditTodo() {
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
    const data = todoFormSchema.parse(Object.fromEntries(formData.entries()))
    mutate(data)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>+ Add New Todo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form className='grid gap-6' onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Todo</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder='Title' />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTodo