import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { getErrorMessage } from "../../utils/index.ts"
import { helloInputSchema, sayHello } from "./functions/hello.ts"

export const registerHello = (server: McpServer) => {
  server.tool("say_hello", helloInputSchema.shape, async (input) => {
    try {
      return {
        content: [
          {
            type: "text",
            text: sayHello(input)
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
