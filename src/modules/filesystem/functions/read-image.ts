import { access, readFile, stat } from "node:fs/promises"
import { extname, basename } from "node:path"
import { z } from "zod"

export const readImageInputSchema = z.object({
  filePath: z.string().describe("Path to the image file to read")
})

export type ReadImageInput = z.infer<typeof readImageInputSchema>

interface ImageResult {
  fileName: string
  filePath: string
  fileSize: number
  format: string
  base64: string
  mimeType: string
}

export async function readImage(input: ReadImageInput): Promise<ImageResult | string> {
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

    const extension = extname(filePath).toLowerCase()
    const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg']
    
    if (!supportedFormats.includes(extension)) {
      return `Unsupported image format: ${extension}. Supported formats: ${supportedFormats.join(', ')}`
    }

    const stats = await stat(filePath)
    const buffer = await readFile(filePath)
    const base64 = buffer.toString('base64')
    
    const mimeTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    }

    return {
      fileName: basename(filePath),
      filePath: filePath,
      fileSize: stats.size,
      format: extension.slice(1),
      base64: base64,
      mimeType: mimeTypeMap[extension] || 'application/octet-stream'
    }

  } catch (error) {
    return `Error reading image: ${error instanceof Error ? error.message : String(error)}`
  }
}
