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

// type
type TodoData = z.infer<typeof todoSchema>
type CreateTodoData = z.infer<typeof todoCreateSchema>

export { todoSchema, todoCreateSchema }
export type { TodoData, CreateTodoData }