import { invoke } from "@tauri-apps/api/core"

export default async function readFile(path: string): Promise<string> {
  const fileContent = await invoke("read_file", { path })
  return fileContent as string
}