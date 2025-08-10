import { GoogleAuth } from "google-auth-library"

export const DEFAULT_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "1p_3QSC7RSSKKv3MeOxLlFBHw8jAzUBjMgQCYIgU3XTs"

export function createGoogleAuth() {
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS
  
  if (!credentialsJson) {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS environment variable is not set. Please configure your Google Sheets credentials.")
  }

  let credentials
  try {
    credentials = JSON.parse(credentialsJson)
  } catch (error) {
    throw new Error("Invalid JSON in GOOGLE_SHEETS_CREDENTIALS environment variable")
  }

  return new GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  })
}
