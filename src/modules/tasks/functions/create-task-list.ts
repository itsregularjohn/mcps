import { z } from "zod"
import { tasks } from "../client.ts"

export const createTaskListInputSchema = z.object({
  title: z.string().describe("Title of the new task list")
})

export type CreateTaskListInput = z.infer<typeof createTaskListInputSchema>

export async function createTaskList(args: CreateTaskListInput) {
  const response = await tasks.tasklists.insert({
    requestBody: {
      title: args.title
    }
  })
  return response.data
}
