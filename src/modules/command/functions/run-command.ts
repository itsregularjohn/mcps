import { execa } from "execa"
import { z } from "zod"

export const runCommandInputSchema = z.object({
  command: z.string().min(1).describe("The command to run"),
  args: z.array(z.string()).optional().default([]).describe("Arguments to pass to the command"),
  cwd: z.string().optional().describe("Working directory where the command will be executed"),
  env: z.record(z.string()).optional().describe("Environment variables to pass to the command"),
  shell: z.boolean().optional().default(true).describe("Whether to run the command in a shell - often required for Windows commands"),
  timeout: z.number().positive().optional().describe("Maximum time (in milliseconds) the command is allowed to run")
})

export type RunCommandInput = z.infer<typeof runCommandInputSchema>

const potentiallyDangerousCommands = [
  "rm",
  "rmdir", 
  "del",
  "format",
  "mkfs",
  "dd"
]

export async function runCommand({ command, args = [], cwd, env, shell = true, timeout }: RunCommandInput) {
  try {
    if (
      potentiallyDangerousCommands.includes(command) ||
      (args && args.some((arg) => arg === "-rf" || arg === "/s" || arg === "/q"))
    ) {
      console.warn(`Potentially dangerous command detected: ${command} ${args.join(" ")}`)
    }

    const result = await execa(command, args, {
      cwd,
      env,
      shell,
      timeout,
      stdout: "pipe",
      stderr: "pipe",
      reject: false
    })

    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
      command: [command, ...args].join(" "),
      successful: result.exitCode === 0
    }
  } catch (error: any) {
    console.error("Command execution error:", JSON.stringify(error, null, 2))

    let errorMessage = ""
    if (error.code === "ENOENT") {
      errorMessage = `Command not found: ${command}`
    } else if (error.code === "ETIMEDOUT") {
      errorMessage = `Command timed out after ${timeout}ms`
    } else {
      errorMessage = error.message ?? "Unknown error"
    }

    return {
      exitCode: error.exitCode ?? 1,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? errorMessage,
      command: [command, ...args].join(" "),
      successful: false
    }
  }
}
