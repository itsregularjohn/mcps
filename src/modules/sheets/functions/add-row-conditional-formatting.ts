import { z } from "zod"
import { DEFAULT_SPREADSHEET_ID, columnIndexToLetter, googleSheets } from "../utils/index.ts"

export const addRowConditionalFormattingInputSchema = z.object({
  sheetName: z.string().describe("The name of the sheet to add conditional formatting to"),
  checkboxColumnIndex: z.number().int().min(0).describe("0-based index of the column containing checkboxes (0 = A, 1 = B, etc.)"),
  red: z.number().int().min(0).max(255).optional().default(255).describe("Red component of RGB color (0-255)"),
  green: z.number().int().min(0).max(255).optional().default(200).describe("Green component of RGB color (0-255)"),
  blue: z.number().int().min(0).max(255).optional().default(200).describe("Blue component of RGB color (0-255)")
})

export type AddRowConditionalFormattingInput = z.infer<typeof addRowConditionalFormattingInputSchema>

export async function addRowConditionalFormatting({
  sheetName,
  checkboxColumnIndex,
  red = 255,
  green = 200,
  blue = 200
}: AddRowConditionalFormattingInput) {
  try {
    const sheetsResponse = await googleSheets.spreadsheets.get({
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      fields: "sheets.properties"
    })

    const sheet = sheetsResponse.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    )

    if (!sheet || !sheet.properties?.sheetId) {
      throw new Error(`Sheet "${sheetName}" not found`)
    }

    const sheetId = sheet.properties.sheetId

    const columnLetter = columnIndexToLetter(checkboxColumnIndex)
    const formula = `=$${columnLetter}1=TRUE`

    const request = {
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            addConditionalFormatRule: {
              rule: {
                ranges: [
                  {
                    sheetId,
                    startRowIndex: 0,
                    startColumnIndex: 0,
                    endColumnIndex: 999
                  }
                ],
                booleanRule: {
                  condition: {
                    type: "CUSTOM_FORMULA",
                    values: [
                      {
                        userEnteredValue: formula
                      }
                    ]
                  },
                  format: {
                    backgroundColor: {
                      red: red / 255,
                      green: green / 255,
                      blue: blue / 255
                    }
                  }
                }
              },
              index: 0
            }
          }
        ]
      }
    }

    const response = await googleSheets.spreadsheets.batchUpdate(request)

    return {
      result: "Conditional formatting rule added successfully",
      details: response.data
    }
  } catch (error: any) {
    console.error("Error adding conditional formatting rule:", error)
    throw new Error(`Failed to add conditional formatting rule: ${error.message}`)
  }
}
