import { z } from "zod"
import { tasks } from "../client.ts"

export const completeTaskInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list"),
  taskId: z.string().describe("ID of the task to complete")
})

export type CompleteTaskInput = z.infer<typeof completeTaskInputSchema>

export async function completeTask(args: CompleteTaskInput) {
  const existingTask = await tasks.tasks.get({
    tasklist: args.taskListId,
    task: args.taskId
  })

  const response = await tasks.tasks.update({
    tasklist: args.taskListId,
    task: args.taskId,
    requestBody: {
      id: args.taskId,
      title: existingTask.data.title,
      status: "completed",
      completed: new Date().toISOString()
    }
  })
  return response.data
}
