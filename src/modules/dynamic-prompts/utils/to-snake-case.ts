export function toSnakeCase(str: string): string {
  return str
    .trim() // remove leading/trailing whitespace
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // camelCase or PascalCase to snake_case
    .replace(/[\s-]+/g, '_') // spaces and dashes to underscore
    .replace(/[^a-zA-Z0-9_]/g, '') // remove special characters except underscore
    .replace(/__+/g, '_') // collapse multiple underscores
    .toLowerCase();
}
