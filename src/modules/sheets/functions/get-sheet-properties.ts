import { z } from "zod"
import { DEFAULT_SPREADSHEET_ID, googleSheets } from "../utils/index.ts"

export const getSheetPropertiesInputSchema = z.object({
  sheetName: z.string().describe("The name of the sheet to get properties for")
})

export type GetSheetPropertiesInput = z.infer<typeof getSheetPropertiesInputSchema>

export async function getSheetProperties({
  sheetName
}: GetSheetPropertiesInput) {
  try {
    const response = await googleSheets.spreadsheets.get({
      spreadsheetId: DEFAULT_SPREADSHEET_ID
    })

    const sheet = response.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    )

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in the spreadsheet`)
    }

    return {
      sheetId: sheet.properties?.sheetId,
      title: sheet.properties?.title,
      index: sheet.properties?.index,
      sheetType: sheet.properties?.sheetType,
      gridProperties: {
        rowCount: sheet.properties?.gridProperties?.rowCount,
        columnCount: sheet.properties?.gridProperties?.columnCount,
        frozenRowCount: sheet.properties?.gridProperties?.frozenRowCount,
        frozenColumnCount: sheet.properties?.gridProperties?.frozenColumnCount
      },
      hidden: sheet.properties?.hidden,
      rightToLeft: sheet.properties?.rightToLeft
    }
  } catch (error: any) {
    console.error("Error getting sheet properties:", error)
    throw new Error(`Failed to get sheet properties: ${error.message}`)
  }
}
