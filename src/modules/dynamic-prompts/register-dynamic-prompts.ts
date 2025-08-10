import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { loadPrompts } from "./functions/load-prompts.ts"

export async function registerDynamicPrompts(server: McpServer) {
  try {
    const promptFiles = await loadPrompts()

    for (const promptFile of promptFiles) {
      try {
        server.prompt(
          promptFile.name,
          promptFile.description,
          {}, // No schema parameters for now
          async () => {
            return {
              messages: [
                {
                  role: "user",
                  content: {
                    type: "text",
                    text: promptFile.content
                  }
                }
              ]
            }
          }
        )
      } catch (error) {
        console.warn(
          `Failed to register prompt ${promptFile.name}:`,
          error
        )
      }
    }

    if (promptFiles.length > 0) {
      console.error(`Registered ${promptFiles.length} dynamic prompts`)
    }
  } catch (error) {
    // Silently ignore if prompts can't be loaded
  }
}
