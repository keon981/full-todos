import * as z from "zod";

// schemas
const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  is_completed: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  project_id: z.number().nullable(),
});

const todoCreateSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
})

const todoEditSchema = todoCreateSchema.extend({ id: z.number() })

const todoCheckedSchema = z.object({
  id: z.number(),
  checked: z.boolean(),
})

// type
type TodoData = z.infer<typeof todoSchema>
type CreateTodoData = z.infer<typeof todoCreateSchema>
type EditTodoData = z.infer<typeof todoEditSchema>
type CheckedTodo = z.infer<typeof todoCheckedSchema>

export { todoSchema, todoCreateSchema, todoCheckedSchema, todoEditSchema }
export type { TodoData, CreateTodoData, CheckedTodo, EditTodoData }