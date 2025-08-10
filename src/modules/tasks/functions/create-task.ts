import { z } from "zod"
import { tasks } from "../client.ts"

export const createTaskInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list"),
  title: z.string().max(1024).describe("Title of the task (max 1024 characters)"),
  notes: z.string().max(8192).optional().describe("Notes for the task (max 8192 characters)"),
  due: z.string().optional().describe("Due date of the task (RFC 3339 timestamp)"),
  parent: z.string().optional().describe("Parent task ID for subtasks")
})

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>

export async function createTask(args: CreateTaskInput) {
  const response = await tasks.tasks.insert({
    tasklist: args.taskListId,
    parent: args.parent,
    requestBody: {
      title: args.title,
      notes: args.notes,
      due: args.due ? new Date(args.due).toISOString() : undefined
    }
  })
  return response.data
}
