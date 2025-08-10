import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { getErrorMessage } from "../../utils/index.ts"
import { moveFileToTrash, moveFileToTrashInputSchema } from "./functions/move-file-to-trash.ts"
import { readImage, readImageInputSchema } from "./functions/read-image.ts"

export const registerFilesystem = (server: McpServer) => {
  server.tool("move_file_to_trash", moveFileToTrashInputSchema.shape, async (input) => {
    try {
      const result = await moveFileToTrash(input)
      return {
        content: [
          {
            type: "text",
            text: result
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: getErrorMessage(error)
          }
        ]
      }
    }
  })

  server.tool("read_image", readImageInputSchema.shape, async (input) => {
    try {
      const result = await readImage(input)
      if (typeof result === 'string') {
        return {
          content: [
            {
              type: "text", 
              text: result
            }
          ]
        }
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Image: ${result.fileName} (${result.format}, ${result.fileSize} bytes)`
          },
          {
            type: "image",
            data: result.base64,
            mimeType: result.mimeType
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: getErrorMessage(error)
          }
        ]
      }
    }
  })
}
