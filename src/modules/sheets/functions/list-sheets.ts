import { z } from "zod"
import { DEFAULT_SPREADSHEET_ID, googleSheets } from "../utils/index.ts"

export const listSheetsInputSchema = z.object({})

export type ListSheetsInput = z.infer<typeof listSheetsInputSchema>

export async function listSheets(input: ListSheetsInput) {
  try {
    const response = await googleSheets.spreadsheets.get({
      spreadsheetId: DEFAULT_SPREADSHEET_ID
    })

    if (!response.data.sheets) {
      return []
    }

    return response.data.sheets
      .map((sheet) => sheet.properties?.title || "Unnamed Sheet")
      .filter((title): title is string => Boolean(title))
  } catch (error: any) {
    console.error("Error listing sheets:", error)
    throw new Error(`Failed to list sheets: ${error.message}`)
  }
}
