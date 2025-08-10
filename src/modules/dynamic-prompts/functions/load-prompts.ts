import matter from "gray-matter"
import { readFile, readdir } from "node:fs/promises"
import { extname, join, basename } from "node:path"
import { toSnakeCase } from "../utils/to-snake-case.ts"

interface PromptFrontmatter {
  name?: string
  description?: string
}

interface PromptFile {
  path: string
  name: string
  description: string
  content: string
}

function getPromptsDirectory(): string {
  const envDir = process.env.PROMPTS_DIRECTORY
  if (envDir) {
    return envDir
  }
  return "./prompts"
}

async function readMarkdownFiles(directory: string): Promise<PromptFile[]> {
  try {
    const files = await readdir(directory)
    const markdownFiles = files.filter((file) => extname(file) === ".md")

    const promptFiles: PromptFile[] = []

    for (const file of markdownFiles) {
      try {
        const filePath = join(directory, file)
        const fileContent = await readFile(filePath, "utf-8")
        const parsed = matter(fileContent)

        // Get name from frontmatter or derive from filename
        let name = parsed.data.name
        if (!name) {
          const filenameWithoutExt = basename(file, '.md')
          name = toSnakeCase(filenameWithoutExt)
        }

        // Get description from frontmatter or use empty string as default
        const description = parsed.data.description || ""

        promptFiles.push({
          path: filePath,
          name,
          description,
          content: parsed.content
        })
      } catch (error) {
        console.warn(`Error processing ${file}:`, error)
        continue
      }
    }

    return promptFiles
  } catch (error) {
    // Directory doesn't exist or can't be read - return empty array silently
    return []
  }
}

export async function loadPrompts(): Promise<PromptFile[]> {
  const directory = getPromptsDirectory()
  
  try {
    const promptFiles = await readMarkdownFiles(directory)
    return promptFiles
  } catch (error) {
    // Silently return empty array if loading fails
    return []
  }
}
