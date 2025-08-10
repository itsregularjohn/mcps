import { access } from "node:fs/promises"
import { basename } from "node:path"
import trash from "trash"
import { z } from "zod"

export const moveFileToTrashInputSchema = z.object({
  filePath: z.string().describe("Path to the file to move to trash")
})

export type MoveFileToTrashInput = z.infer<typeof moveFileToTrashInputSchema>

export async function moveFileToTrash(input: MoveFileToTrashInput): Promise<string> {
  try {
    const { filePath } = input

    if (!filePath) {
      return `Error: No file path provided. Received: ${JSON.stringify(input)}`
    }

    try {
      await access(filePath)
    } catch (error) {
      return `File not found: ${filePath}`
    }

    await trash(filePath)

    return `Successfully moved "${basename(filePath)}" to trash`
  } catch (error) {
    return `Error moving file to trash: ${error instanceof Error ? error.message : String(error)}`
  }
}
