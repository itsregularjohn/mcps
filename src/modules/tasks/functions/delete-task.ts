import { z } from "zod"
import { tasks } from "../client.ts"

export const deleteTaskInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list"),
  taskId: z.string().describe("ID of the task to delete")
})

export type DeleteTaskInput = z.infer<typeof deleteTaskInputSchema>

export async function deleteTask(args: DeleteTaskInput) {
  await tasks.tasks.delete({
    tasklist: args.taskListId,
    task: args.taskId
  })
  return { id: args.taskId }
}
