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
import { useMutation } from '@tanstack/react-query'



function AddTodo() {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'New Todo',
          description: 'Description for new todo'
        })
      })
      return res.json()
    }
  })

  return (
    <Dialog>
      <form className='text-end'>
        <DialogTrigger asChild>
          <Button>+ Add New Todo</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
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
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default AddTodo