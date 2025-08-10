import { z } from "zod"
import { tasks } from "../client.ts"

export const createSubtaskInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list"),
  parentId: z.string().describe("ID of the parent task"),
  title: z.string().max(1024).describe("Title of the subtask (max 1024 characters)"),
  notes: z.string().max(8192).optional().describe("Notes for the subtask (max 8192 characters)"),
  due: z.string().optional().describe("Due date of the subtask (RFC 3339 timestamp)")
})

export type CreateSubtaskInput = z.infer<typeof createSubtaskInputSchema>

export async function createSubtask(args: CreateSubtaskInput) {
  const response = await tasks.tasks.insert({
    tasklist: args.taskListId,
    parent: args.parentId,
    requestBody: {
      title: args.title,
      notes: args.notes,
      due: args.due ? new Date(args.due).toISOString() : undefined
    }
  })
  return response.data
}
