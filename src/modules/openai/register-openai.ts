import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { getErrorMessage } from "../../utils/index.ts"
import {
  chatCompletion,
  chatCompletionInputSchema,
  checkGrammar,
  checkGrammarInputSchema
} from "./functions/index.ts"

export const registerOpenAI = (server: McpServer) => {
  server.tool("ask_chatgpt", chatCompletionInputSchema.shape, async (input) => {
    try {
      const response = await chatCompletion(input)
      return {
        content: [
          {
            type: "text",
            text: response
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calling OpenAI chat completion: ${getErrorMessage(error)}`
          }
        ]
      }
    }
  })

  server.tool("check_grammar", checkGrammarInputSchema.shape, async (input) => {
    try {
      const correctedText = await checkGrammar(input)
      return {
        content: [
          {
            type: "text",
            text: correctedText
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error checking grammar: ${getErrorMessage(error)}`
          }
        ]
      }
    }
  })
}
