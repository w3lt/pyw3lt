import FileNode from "@/types/frontend/FileNode"
import { createContext } from "react"

const FileTreeContext = createContext<{
  contextMenu?: { x: number, y: number, node: FileNode }
  setContextMenu: (pos: { x: number, y: number, node: FileNode } | undefined) => void
  setCreateNewFileFolder: (dialog: { type: "file" | "folder", parentPath: string } | undefined) => void
}>({
  contextMenu: undefined,
  setContextMenu: () => { },
  setCreateNewFileFolder: () => { }
})

export default FileTreeContext