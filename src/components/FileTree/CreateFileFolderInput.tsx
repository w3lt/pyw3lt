import { Edit } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { createFile, createFolder } from "@/utils/file"

interface Props {
  type: "file" | "folder"
  parentPath: string
  onCancel: () => void
}

export default function CreateFileFolderInput({
  type,
  parentPath,
  onCancel
}: Props) {
  const [name, setName] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel()
    } else if (e.key === "Enter") {
      e.preventDefault()
      const trimmedName = name.trim()
      if (trimmedName) {
        // Call the appropriate function based on the type
        if (type === "file") {
          // Create a new file
          createFile(parentPath, trimmedName)
            .finally(() => {
              onCancel()
            })
        } else {
          // Create a new folder
          createFolder(parentPath, trimmedName)
            .finally(() => {
              onCancel()
            })
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="bg-background border-2 border-blue-500 rounded-lg w-[500px] p-2">
        <div className="text-sm text-muted-foreground pl-3">
          Location: <span className="font-mono">{parentPath}/</span>
        </div>
        <div className="relative">
          <Edit className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Create a new ${type}...`}
            className="pl-10 border-0 focus-visible:ring-0 text-sm shadow-none"
            autoFocus
            onBlur={onCancel}
          />
        </div>
      </div>
    </div>
  )
}