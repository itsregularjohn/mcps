import { z } from "zod"
import { DEFAULT_SPREADSHEET_ID, googleSheets } from "../utils/index.ts"

export const deleteRowInputSchema = z.object({
  sheetName: z.string().describe("The name of the sheet to delete row from"),
  rowIndex: z.number().int().min(0).describe("0-based index of the row to delete")
})

export type DeleteRowInput = z.infer<typeof deleteRowInputSchema>

export async function deleteRow({ sheetName, rowIndex }: DeleteRowInput) {
  try {
    const spreadsheet = await googleSheets.spreadsheets.get({
      spreadsheetId: DEFAULT_SPREADSHEET_ID
    })

    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    )

    if (!sheet || !sheet.properties?.sheetId) {
      throw new Error(`Sheet "${sheetName}" not found`)
    }

    const sheetId = sheet.properties.sheetId

    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1
              }
            }
          }
        ]
      }
    })
  } catch (error: any) {
    console.error("Error deleting row:", error)
    throw new Error(`Failed to delete row: ${error.message}`)
  }
}
