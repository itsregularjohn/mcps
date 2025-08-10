import { z } from "zod"
import { tasks } from "../client.ts"

export const updateTaskListInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list to update"),
  title: z.string().describe("New title for the task list")
})

export type UpdateTaskListInput = z.infer<typeof updateTaskListInputSchema>

export async function updateTaskList(args: UpdateTaskListInput) {
  const response = await tasks.tasklists.update({
    tasklist: args.taskListId,
    requestBody: {
      id: args.taskListId,
      title: args.title
    }
  })
  return response.data
}
