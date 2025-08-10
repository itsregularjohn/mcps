import { z } from "zod"
import { tasks } from "../client.ts"

export const updateTaskInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list"),
  taskId: z.string().describe("ID of the task to update"),
  title: z.string().max(1024).optional().describe("New title for the task (max 1024 characters)"),
  notes: z.string().max(8192).optional().describe("New notes for the task (max 8192 characters)"),
  due: z.string().optional().describe("New due date of the task (RFC 3339 timestamp)"),
  completed: z.boolean().optional().describe("Mark task as completed"),
  status: z.enum(["needsAction", "completed"]).optional().describe("Task status")
})

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>

export async function updateTask(args: UpdateTaskInput) {
  const existingTask = await tasks.tasks.get({
    tasklist: args.taskListId,
    task: args.taskId
  })

  const updatePayload: any = {
    id: args.taskId,
    title: args.title || existingTask.data.title,
    notes: args.notes !== undefined ? args.notes : existingTask.data.notes,
    status: args.status || existingTask.data.status
  }

  if (args.due !== undefined) {
    updatePayload.due = args.due ? new Date(args.due).toISOString() : null
  }

  const response = await tasks.tasks.update({
    tasklist: args.taskListId,
    task: args.taskId,
    requestBody: updatePayload
  })
  return response.data
}
