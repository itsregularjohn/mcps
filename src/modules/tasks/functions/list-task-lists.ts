import { z } from "zod"
import { tasks } from "../client.ts"

export const listTaskListsInputSchema = z.object({})

export type ListTaskListsInput = z.infer<typeof listTaskListsInputSchema>

export async function listTaskLists(args: ListTaskListsInput) {
  const response = await tasks.tasklists.list()
  return response.data.items || []
}
