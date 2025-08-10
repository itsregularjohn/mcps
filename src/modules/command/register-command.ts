import { platform } from "node:os"

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { getErrorMessage } from "../../utils/index.ts"
import { runCommand, runCommandInputSchema } from "./functions/run-command.ts"

export const registerCommand = (server: McpServer) => {
  server.tool(
    "run_command",
    `Run commands on this ${platform()} machine`,
    runCommandInputSchema.shape,
    async (input) => {
      try {
        const result = await runCommand(input)
        let responseText = `Command: ${result.command}\n\n`

        if (result.stdout) {
          responseText += `STDOUT:\n${result.stdout}\n\n`
        }

        if (result.stderr) {
          responseText += `STDERR:\n${result.stderr}\n\n`
        }

        responseText += `Exit code: ${result.exitCode}`
        if (result.exitCode === 0) {
          responseText += " (Success)"
        } else {
          responseText += " (Failed)"
        }

        return {
          content: [
            {
              type: "text",
              text: responseText
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing command: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )
}
