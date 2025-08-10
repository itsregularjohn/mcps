import { z } from "zod"
import { DEFAULT_SPREADSHEET_ID, googleSheets } from "../utils/index.ts"

export const updateSheetInputSchema = z.object({
  sheetName: z.string().describe("The name of the sheet to update"),
  range: z.string().describe("Range in A1 notation (e.g., 'A1:C10')"),
  values: z.array(z.array(z.any())).describe("2D array of values to update")
})

export type UpdateSheetInput = z.infer<typeof updateSheetInputSchema>

export async function updateSheet({
  sheetName,
  range,
  values
}: UpdateSheetInput) {
  try {
    const fullRange = range.includes("!") ? range : `${sheetName}!${range}`

    await googleSheets.spreadsheets.values.update({
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      range: fullRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values
      }
    })
  } catch (error: any) {
    console.error("Error updating sheet:", error)
    throw new Error(`Failed to update sheet: ${error.message}`)
  }
}
