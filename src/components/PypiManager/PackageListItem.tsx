import { useContext, useState } from "react"
import { ProjectContext } from "@/contexts/ProjectContext"
import installPythonPackage from "@/utils/installPythonPackage"
import { cn } from "@/lib/utils"
import PackageInfo from "@/types/frontend/PackageInfo"
import RemoveButton from "./buttons/RemoveButton"
import InstallButton from "./buttons/InstallButton"
import UpdateButton from "./buttons/UpdateButton"
import uninstallPythonPackage from "@/utils/uninstallPythonPackage"
import log from "@/utils/log"

interface Props {
  info: PackageInfo
  /**
   * Action to be performed after installation/uninstallation
   */
  postAction?: (action: "install" | "uninstall") => void
}

export default function PackageListItem({
  info,
  postAction
}: Props) {
  const { currentDirectory } = useContext(ProjectContext)
  const { name, author, version, description, installedVersion } = info
  const status = () => {
    if (installedVersion) {
      if (version !== installedVersion)
        return "outdated"
      else
        return "installed"
    } else
      return "uninstalled"
  }

  const [isInstalling, setIsInstalling] = useState(false)
  const [isUninstalling, setIsUninstalling] = useState(false)

  const handleInstallPackage = () => {
    setIsInstalling(true)
    installPythonPackage(name, currentDirectory, version)
      .catch(async (error) => {
        log(error)
      })
      .finally(() => {
        setIsInstalling(false)
        postAction?.("install")
      })
  }

  const handleUninstallPackage = () => {
    setIsUninstalling(true)
    uninstallPythonPackage(name, currentDirectory)
      .catch(async (error) => {
        log(error)
      })
      .finally(() => {
        setIsUninstalling(false)
        postAction?.("uninstall")
      })
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
          {installedVersion && (
            <div
              className={cn(
                "text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0",
                status() === "outdated"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50"
                  : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 border border-green-200/50 dark:border-green-800/50",
              )}
            >
              {status() === "outdated" ? `installed: v${installedVersion}` : "installed"}
            </div>
          )}
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

      <div className="flex gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
        {status() === "installed" && (
          <RemoveButton
            onClick={handleUninstallPackage}
            isUninstalling={isUninstalling}
          />
        )}

        {status() === "uninstalled" && (
          <InstallButton
            onClick={handleInstallPackage}
            isInstalling={isInstalling}
          />
        )}

        {status() === "outdated" && (
          <div className="flex gap-1">
            <UpdateButton
              onClick={handleInstallPackage}
              isUpdating={isInstalling}
            />

            <RemoveButton
              onClick={handleUninstallPackage}
              isUninstalling={isUninstalling}
            />
          </div>
        )}
      </div>
    </div>
  )
}