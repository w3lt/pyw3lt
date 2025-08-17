import { Buffer } from "@/contexts/ProjectContext"
import { cn } from "@/lib/utils"
import getFileIcon from "@/utils/fileIcon"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Props {
  buffer: Buffer
  onSelect: (buffer: Buffer) => void
  onClose: (buffer: Buffer) => void
}

export default function BufferTab({ buffer, onSelect, onClose }: Props) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose(buffer)
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-3 py-2 border-r border-border/50 cursor-pointer",
        "hover:bg-accent/50 active:bg-accent/70 transition-colors",
        "min-w-0 max-w-[200px]",
        buffer.active
          ? "bg-background text-foreground border-b-2 border-b-blue-500"
          : "bg-muted/30 text-foreground/90 hover:text-foreground",
      )}
      onClick={() => onSelect(buffer)}
    >
      {/* File Icon */}
      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
        <span className="text-xs">{getFileIcon(buffer.file.name)}</span>
      </div>

      {/* File Name */}
      <span className="truncate text-sm font-medium">
        {buffer.file.name}
        {buffer.isDirty && <span className="text-orange-500 ml-1">•</span>}
      </span>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "w-4 h-4 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100",
          "hover:bg-accent/70 hover:text-foreground",
          buffer.active && "opacity-100",
        )}
        onClick={handleClose}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  )
}
