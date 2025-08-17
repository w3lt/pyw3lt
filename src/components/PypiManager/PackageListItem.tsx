import PackageInfo from "@/types/backend/PackageInfo"
import { Button } from "@/components/ui/button"
import { Download, RotateCw } from "lucide-react"
import { useContext, useState } from "react"
import { ProjectContext } from "@/contexts/ProjectContext"
import installPythonPackage from "@/utils/installPythonPackage"
import { invoke } from "@tauri-apps/api/core"

interface Props {
  info: PackageInfo
}

export default function PackageListItem({ info }: Props) {
  const { currentDirectory } = useContext(ProjectContext)
  const { name, author, version, description } = info

  const [isInstalling, setIsInstalling] = useState(false)

  const handleInstallPackage = () => {
    setIsInstalling(true)
    installPythonPackage(name, currentDirectory, version)
      .catch(async (error) => {
        invoke("log", { message: error })
      })
      .finally(() => setIsInstalling(false))
  }

  return (
    <div
      className="group flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg hover:bg-accent/30 transition-all duration-200 border border-transparent hover:border-border/50"
    >
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <div className="font-semibold text-sm text-foreground truncate min-w-0">{name}</div>
          <div className="text-xs text-muted-foreground/70 font-mono bg-muted/50 px-1.5 py-0.5 rounded flex-shrink-0">
            v{version}
          </div>
        </div>

        {author.trim().length !== 0 && (
          <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium border border-blue-200/50 dark:border-blue-800/50 max-w-full">
            <span className="truncate">{author}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2 sm:line-clamp-2 break-words">
          {description}
        </p>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-full sm:w-8 p-0 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 sm:flex-shrink-0 sm:mt-0.5 flex items-center justify-center gap-2 sm:gap-0"
        title="Install package"
        onClick={handleInstallPackage}
        disabled={isInstalling}
      >
        {isInstalling ? (
          <RotateCw className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </Button>
    </div>
  )
}