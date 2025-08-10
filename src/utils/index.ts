/**
 * Safely extracts message from any error type
 */
export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
