import FileNode from "@/models/FileNode";
import { useState } from "react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";

interface FileTreeItemProps {
  node: FileNode;
  depth?: number;
  onSelect?: (node: FileNode) => void;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "tsx":
    case "jsx":
      return "⚛️"
    case "ts":
    case "js":
      return "📜"
    case "css":
    case "scss":
      return "🎨"
    case "json":
      return "📋"
    case "md":
      return "📝"
    case "svg":
      return "🖼️"
    case "ico":
      return "🔷"
    default:
      return "📄"
  }
}

export default function FileTreeItem({ node, depth = 0, onSelect }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isDirectory = node.isDirectory

  const handleToggle = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded)
    }
    onSelect?.(node)
  }

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
        onClick={handleToggle}
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
            <span className="text-xs">{getFileIcon(node.name)}</span>
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