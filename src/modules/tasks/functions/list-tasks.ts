import { z } from "zod"
import { tasks } from "../client.ts"

export const listTasksInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list"),
  maxResults: z.number().optional().describe("Maximum number of tasks to return"),
  showCompleted: z.boolean().optional().describe("Include completed tasks"),
  showHidden: z.boolean().optional().describe("Include hidden tasks")
})

export type ListTasksInput = z.infer<typeof listTasksInputSchema>

export async function listTasks(args: ListTasksInput) {
  const response = await tasks.tasks.list({
    tasklist: args.taskListId,
    showCompleted: args.showCompleted,
    showHidden: args.showHidden,
    maxResults: args.maxResults
  })
  return response.data.items || []
}
