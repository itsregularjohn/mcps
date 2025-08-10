import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { registerCommand } from "./modules/command/index.ts"
import { registerFilesystem } from "./modules/filesystem/index.ts"
import { registerOpenAI } from "./modules/openai/index.ts"
import { registerGoogleSheets } from "./modules/sheets/index.ts"
import { registerGoogleTasks } from "./modules/tasks/index.ts"
import { registerDynamicPrompts } from "./modules/dynamic-prompts/index.ts"

const server = new McpServer({
  name: "JP MCPs",
  version: "1.0.0"
})

registerCommand(server)
registerFilesystem(server)
registerGoogleSheets(server)
registerGoogleTasks(server)
registerOpenAI(server)
await registerDynamicPrompts(server)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("MCP Server running on stdio")
}

main().catch((error) => {
  console.error("Fatal error in main():", error)
  process.exit(1)
})
