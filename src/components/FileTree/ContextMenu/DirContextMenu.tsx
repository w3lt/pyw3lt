import { File, Folder } from "lucide-react"
import { ContextMenuItemProps } from "./ContextMenuItem"
import { useContext } from "react"
import FileTreeContext from "../FileTreeContext"
import FileNode from "@/types/frontend/FileNode"

interface Props {
  x: number
  y: number
  node: FileNode
  onClose: () => void
  menuItems: ContextMenuItemProps[]
}

export default function DirContextMenu({ x, y, onClose, node }: Props) {
  const { setCreateNewFileFolder } = useContext(FileTreeContext)

  return (
    <>
      {/* Backdrop to close menu */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Context menu */}
      <div
        className="fixed z-50 bg-background border border-border rounded-md shadow-lg py-1 min-w-[160px]"
        style={{ left: x, top: y }}
      >
        <button
          className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
          onClick={() => {
            onClose()
            setCreateNewFileFolder({ type: "file", parentPath: node.path })
          }}
        >
          <File className="w-4 h-4" />
          New File
        </button>
        <button
          className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
          onClick={() => {
            onClose()
            setCreateNewFileFolder({ type: "folder", parentPath: node.path })
          }}
        >
          <Folder className="w-4 h-4" />
          New Folder
        </button>
      </div>
    </>
  )
}