import FileNode from "@/types/frontend/FileNode"
import { ContextMenuItemProps } from "./ContextMenuItem"
import { Trash } from "lucide-react"
import { deletePath } from "@/utils/file"

interface Props {
  x: number
  y: number
  node: FileNode
  onClose: () => void
  menuItems: ContextMenuItemProps[]
}

export default function FileContextMenu({
  x, y, onClose, node
}: Props) {
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
            deletePath(node.path)
          }}
        >
          <Trash className="w-4 h-4" />
          Delete
        </button>
      </div>
    </>
  )
}