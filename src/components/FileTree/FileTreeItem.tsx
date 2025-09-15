import FileNode from "@/types/frontend/FileNode"
import { MouseEventHandler, useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react"
import { ProjectContext } from "@/contexts/ProjectContext"
import getFileIcon from "@/utils/fileIcon"
import log from "@/utils/log"
import FileTreeContext from "./FileTreeContext"
import { readFile } from "@/utils/file"

interface FileTreeItemProps {
  node: FileNode
  depth?: number
  onSelect?: (node: FileNode) => void
}

export default function FileTreeItem({ node, depth = 0, onSelect }: FileTreeItemProps) {
  const { setBuffers, buffers } = useContext(ProjectContext)
  const { setContextMenu } = useContext(FileTreeContext)
  const [isExpanded, setIsExpanded] = useState(node.open ?? false)
  const isDirectory = node.isDirectory

  const handleClick = () => {
    if (isDirectory) { // If the item is a directory, then we toggle (open/close) it
      setIsExpanded(!isExpanded)
    } else { // If the item is a file, we read the file content and load it into the editor
      const existingBufferIndex = buffers.findIndex(b => b.file.path === node.path)
      if (existingBufferIndex !== -1) {
        setBuffers(prev => {
          const newPrev = [...prev]
          newPrev.forEach(b => b.active = false) // Deactivate all buffers
          newPrev[existingBufferIndex] = {
            ...newPrev[existingBufferIndex],
            active: true
          }
          return newPrev
        })
      } else {
        // Load the file content to the buffer
        readFile(node.path)
          .then(content => {
            setBuffers(prev => {
              const newPrev = [...prev]
              newPrev.forEach(b => b.active = false) // Deactivate all buffers
              newPrev.push({
                file: node,
                bufferContent: content,
                active: true,
                isDirty: false
              })
              return newPrev
            })
          })
          .catch(async err => {
            log(err.toString())
          })
      }
    }
    onSelect?.(node)
  }

  const handleRightClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node
    })
  }

  const Icon = getFileIcon(node.name)

  return (
    <div className="select-none">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-1 h-auto py-1 px-1 font-medium text-sm",
          "hover:bg-accent/50 active:bg-accent/70",
          "text-foreground/90 hover:text-foreground",
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-4 h-4 flex items-center justify-center">
          {isDirectory ? (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )
          ) : null}
        </div>

        {/* File/Folder Icon */}
        <div className="w-4 h-4 flex items-center justify-center">
          {node.isDirectory ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <Icon className="w-4 h-4 text-blue-500" />
          )}
        </div>

        {/* File/Folder Name */}
        <span className="truncate">{node.name}</span>
      </Button>

      {/* Children */}
      {isDirectory && isExpanded && (
        <div className="ml-0">
          {node.children!.map((child, index) => (
            <FileTreeItem key={`${child.name}-${index}`} node={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}