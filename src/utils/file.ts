import { invoke } from "@tauri-apps/api/core"

export async function readFile(path: string): Promise<string> {
  const fileContent = await invoke("read_file", { path })
  return fileContent as string
}

export async function createFile(parentPath: string, name: string): Promise<void> {
  await invoke("create_file", { parentPath, fileName: name })
}

export async function createFolder(parentPath: string, name: string): Promise<void> {
  await invoke("create_folder", { parentPath, dirName: name })
}

export async function deletePath(path: string): Promise<void> {
  await invoke("delete_path", { path })
}
