import { sheets_v4 } from "@googleapis/sheets"
import { createGoogleAuth } from "./config.ts"

let _auth: any = null
let _googleSheets: sheets_v4.Sheets | null = null

export function getGoogleSheetsClient() {
  if (!_googleSheets) {
    _auth = createGoogleAuth()
    _googleSheets = new sheets_v4.Sheets({ auth: _auth })
  }
  return _googleSheets
}

// For backward compatibility
export const googleSheets = new Proxy({} as sheets_v4.Sheets, {
  get(target, prop) {
    return getGoogleSheetsClient()[prop as keyof sheets_v4.Sheets]
  }
})

export function getAuth() {
  if (!_auth) {
    _auth = createGoogleAuth()
  }
  return _auth
}

export const auth = new Proxy({} as any, {
  get(target, prop) {
    return getAuth()[prop as string]
  }
})
