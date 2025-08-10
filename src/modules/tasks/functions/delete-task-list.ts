import { z } from "zod"
import { tasks } from "../client.ts"

export const deleteTaskListInputSchema = z.object({
  taskListId: z.string().describe("ID of the task list to delete")
})

export type DeleteTaskListInput = z.infer<typeof deleteTaskListInputSchema>

export async function deleteTaskList(args: DeleteTaskListInput) {
  await tasks.tasklists.delete({
    tasklist: args.taskListId
  })
  return { id: args.taskListId }
}
