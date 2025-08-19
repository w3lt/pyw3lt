/**
 * Get the programming language of a file based on its extension.
 * @param fileName The name of the file.
 * @returns The programming language of the file.
 */
const langOfFile = (fileName: string) => {
  if (fileName.endsWith(".py")) return "python"
  if (fileName.endsWith(".ts")) return "typescript"
  if (fileName.endsWith(".js")) return "javascript"
  if (fileName.endsWith(".json")) return "json"
  if (fileName.endsWith(".css")) return "css"
  if (fileName.endsWith(".html")) return "html"
  return "plaintext"
}

export default langOfFile