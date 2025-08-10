export function rowColToA1Notation(row: number, col: number): string {
  const colStr = columnIndexToLetter(col)
  return `${colStr}${row + 1}`
}

// Helper to convert column index to letter (0 = A, 1 = B, etc.)
export function columnIndexToLetter(index: number): string {
  let temp: number,
    letter = ""
  while (index >= 0) {
    temp = index % 26
    letter = String.fromCharCode(temp + 65) + letter
    index = (index - temp) / 26 - 1
  }
  return letter
}

// Helper to parse A1 notation to row/column indices
export function parseA1Notation(a1Notation: string): {
  startRow: number
  startCol: number
  endRow?: number
  endCol?: number
} {
  const match = a1Notation.match(/([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?/)
  if (!match) {
    throw new Error(`Invalid A1 notation: ${a1Notation}`)
  }

  const [_, startCol, startRow, endCol, endRow] = match

  const result: {
    startRow: number
    startCol: number
    endRow?: number
    endCol?: number
  } = {
    startRow: parseInt(startRow) - 1,
    startCol: letterToColumnIndex(startCol)
  }

  if (endCol && endRow) {
    result.endRow = parseInt(endRow) - 1
    result.endCol = letterToColumnIndex(endCol)
  }

  return result
}

// Helper to convert column letter to index (A = 0, B = 1, etc.)
export function letterToColumnIndex(column: string): number {
  let index = 0
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + column.charCodeAt(i) - 64
  }
  return index - 1
}
