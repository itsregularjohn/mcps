import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { getErrorMessage } from "../../utils/index.ts"
import { columnIndexToLetter } from "./utils/index.ts"
import {
  addRowConditionalFormatting,
  addRowConditionalFormattingInputSchema,
  deleteRow,
  deleteRowInputSchema,
  getSheetProperties,
  getSheetPropertiesInputSchema,
  listSheetContent,
  listSheetContentInputSchema,
  listSheets,
  listSheetsInputSchema,
  updateSheet,
  updateSheetInputSchema
} from "./functions/index.ts"

export const registerGoogleSheets = (server: McpServer) => {
  server.tool("list_sheets", listSheetsInputSchema.shape, async (input) => {
    try {
      const sheets = await listSheets(input)
      return {
        content: [
          {
            type: "text",
            text:
              sheets.length > 0
                ? `Available sheets:\n${sheets.join("\n")}`
                : "No sheets found in the spreadsheet"
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing sheets: ${getErrorMessage(error)}`
          }
        ]
      }
    }
  })

  server.tool(
    "list_sheet_content",
    listSheetContentInputSchema.shape,
    async (input) => {
      try {
        const content = await listSheetContent(input)

        let tableText = ""
        if (content.values.length > 0) {
          for (const row of content.values) {
            tableText += row.join("\t") + "\n"
          }
          tableText += `\nPage ${content.currentPage} of ${content.totalPages} (${content.totalRows} total rows)`
        } else {
          tableText = "No data found in the specified range"
        }

        return {
          content: [
            {
              type: "text",
              text: tableText
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error reading sheet content: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool("update_sheet", updateSheetInputSchema.shape, async (input) => {
    try {
      await updateSheet(input)
      return {
        content: [
          {
            type: "text",
            text: `Successfully updated ${input.sheetName}!${input.range}`
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error updating sheet: ${getErrorMessage(error)}`
          }
        ]
      }
    }
  })

  server.tool("delete_row", deleteRowInputSchema.shape, async (input) => {
    try {
      await deleteRow(input)
      return {
        content: [
          {
            type: "text",
            text: `Successfully deleted row ${input.rowIndex} from sheet "${input.sheetName}"`
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting row: ${getErrorMessage(error)}`
          }
        ]
      }
    }
  })

  server.tool(
    "get_sheet_properties",
    getSheetPropertiesInputSchema.shape,
    async (input) => {
      try {
        const properties = await getSheetProperties(input)
        return {
          content: [
            {
              type: "text",
              text: `Sheet Properties for "${input.sheetName}":\n${JSON.stringify(properties, null, 2)}`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting sheet properties: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "add_row_conditional_formatting",
    addRowConditionalFormattingInputSchema.shape,
    async (input) => {
      try {
        const result = await addRowConditionalFormatting(input)
        return {
          content: [
            {
              type: "text",
              text: `${result.result}\nA conditional formatting rule has been added to sheet "${input.sheetName}" that will highlight entire rows when column ${columnIndexToLetter(input.checkboxColumnIndex)} contains TRUE.`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error adding conditional formatting rule: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )
}
