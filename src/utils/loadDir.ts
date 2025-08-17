import FileNode from "@/models/FileNode"
import RustFileNode from "@/types/backend/FileNode"
import { invoke } from "@tauri-apps/api/core"

const convertRustFileNode = (item: RustFileNode): FileNode => ({
  name: item.name,
  path: item.path,
  isDirectory: item.is_dir,
  open: item.is_dir ? false : undefined,
  children: item.is_dir ? item.children?.map(convertRustFileNode) : undefined
})

export default async function loadDir(path: string): Promise<FileNode[]> {
  const response = await invoke("list_dir", { path })
  return (response as RustFileNode[]).map(convertRustFileNode)
};
