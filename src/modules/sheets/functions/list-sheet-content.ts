import { z } from "zod"
import { DEFAULT_SPREADSHEET_ID, googleSheets } from "../utils/index.ts"

export const listSheetContentInputSchema = z.object({
  sheetName: z.string().describe("The name of the sheet to read content from"),
  range: z.string().optional().describe("Optional range in A1 notation (e.g., 'A1:C10')"),
  page: z.number().int().min(1).default(1).describe("Page number for pagination"),
  pageSize: z.number().int().min(1).max(1000).default(50).describe("Number of rows per page")
})

export type ListSheetContentInput = z.infer<typeof listSheetContentInputSchema>

export type SheetContent = {
  values: any[][]
  totalRows: number
  totalPages: number
  currentPage: number
}

export async function listSheetContent({
  sheetName,
  range,
  page,
  pageSize
}: ListSheetContentInput): Promise<SheetContent> {
  try {
    const sheetResponse = await googleSheets.spreadsheets.get({
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      ranges: [`${sheetName}!A1:Z`],
      includeGridData: false
    })

    const sheet = sheetResponse.data.sheets?.[0]
    const gridProperties = sheet?.properties?.gridProperties
    const totalRows = gridProperties?.rowCount || 0

    const startRow = (page - 1) * pageSize
    const endRow = Math.min(startRow + pageSize, totalRows)
    const totalPages = Math.ceil(totalRows / pageSize)

    let effectiveRange = range
    if (!effectiveRange) {
      effectiveRange = `A${startRow + 1}:Z${endRow}`
    }

    const fullRange = effectiveRange.includes("!")
      ? effectiveRange
      : `${sheetName}!${effectiveRange}`

    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      range: fullRange,
      valueRenderOption: "FORMATTED_VALUE"
    })

    return {
      values: response.data.values || [],
      totalRows,
      totalPages,
      currentPage: page
    }
  } catch (error: any) {
    console.error("Error listing sheet content:", error)
    throw new Error(`Failed to list sheet content: ${error.message}`)
  }
}
