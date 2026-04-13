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

const todoFormSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
})

const todoCheckedSchema = z.object({
  id: z.number(),
  checked: z.boolean(),
})

// type
type TodoData = z.infer<typeof todoSchema>
type CreateTodoData = z.infer<typeof todoFormSchema>
type CheckedTodo = z.infer<typeof todoCheckedSchema>

export { todoSchema, todoFormSchema, todoCheckedSchema }
export type { TodoData, CreateTodoData, CheckedTodo }