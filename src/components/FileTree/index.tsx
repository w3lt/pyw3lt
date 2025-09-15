import { useFileTree } from "../../hooks/useFileTree"
import FileTreeItem from "./FileTreeItem"
import UtilityContent from "../UtilityContent"
import { useState } from "react"
import FileTreeContext from "./FileTreeContext"
import DirContextMenu from "./ContextMenu/DirContextMenu"
import CreateFileFolderInput from "./CreateFileFolderInput"
import FileNode from "@/types/frontend/FileNode"
import { useBackendEventListener } from "@/hooks/backendEventListener"
import RustFileNode from "@/types/backend/FileNode"
import { convertRustFileNode } from "@/utils/project"
import FileContextMenu from "./ContextMenu/FileContextMenu"

interface Props {
  rootPath: string
}

export default function FileTree({ rootPath }: Props) {
  const { fileTree, isLoading, error, setFileTree } = useFileTree(rootPath)
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, node: FileNode }>()
  const [createNewFileFolder, setCreateNewFileFolder] = useState<{ type: "file" | "folder", parentPath: string }>()

  useBackendEventListener<RustFileNode[]>("project-updated", event => {
    setFileTree(prev => ({
      ...prev,
      children: event.payload.map(convertRustFileNode)
    }))
  })

  if (isLoading || error) return null
  return (
    <FileTreeContext.Provider value={{ contextMenu, setContextMenu, setCreateNewFileFolder }}>
      <UtilityContent title="Explorer">
        <FileTreeItem node={fileTree} />
        {contextMenu?.node.isDirectory && (
          <DirContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(undefined)}
            node={contextMenu.node}
            menuItems={[]}
          />
        )}

        {contextMenu && !contextMenu.node.isDirectory && (
          <FileContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(undefined)}
            node={contextMenu.node}
            menuItems={[]}
          />
        )}

        {createNewFileFolder && (
          <CreateFileFolderInput
            type={createNewFileFolder.type}
            parentPath={createNewFileFolder.parentPath}
            onCancel={() => setCreateNewFileFolder(undefined)}
          />
        )}
      </UtilityContent>
    </FileTreeContext.Provider>
  )
}
