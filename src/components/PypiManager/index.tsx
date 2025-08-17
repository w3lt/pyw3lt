import UtilityContent from "../UtilityContent"
import { useContext, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import searchPackages from "@/utils/searchPackage"
import { invoke } from "@tauri-apps/api/core"
import PackageListItem from "./PackageListItem"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import SyncStatusBar from "./SyncStatusBar"
import useInstalledPackages from "@/hooks/useInstalledPackages"
import { ProjectContext } from "@/contexts/ProjectContext"
import PackageInfo from "@/types/frontend/PackageInfo"

export default function PypiManager() {
  const { currentDirectory } = useContext(ProjectContext)
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [packages, setPackages] = useState<PackageInfo[]>([])

  const { installedPackages, isLoading } = useInstalledPackages(currentDirectory, query.trim().length === 0)
  useEffect(() => {
    if (isLoading) return
    setPackages(installedPackages)
  }, [isLoading, installedPackages])

  const handleSearch = () => {
    if (query.trim().length === 0) {
      setPackages(installedPackages)
      return
    }

    setIsSearching(true)
    searchPackages(query, 10, currentDirectory)
      .then((results) => {
        setPackages(results)
      })
      .catch(async (error) => {
        await invoke("log", { message: error })
      })
      .finally(() => {
        setIsSearching(false)
      })
  }

  if (isLoading) return null
  return (
    <UtilityContent title="Python Packages">
      <div className="p-2 flex flex-col h-full">
        <div className="relative">
          <input
            placeholder="Search packages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            className="w-full h-8 px-3 text-sm bg-background border border-border rounded-md"
          />
          {isSearching && <Loader2 className="absolute right-2 top-2 w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <SyncStatusBar />
        <ScrollArea className="mt-4 space-y-2 flex-1 overflow-y-auto w-full scrollbar-hide">
          {isSearching ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Searching packages...
            </div>
          ) : (
            packages
              .map((pkg) => (
                <PackageListItem
                  key={pkg.name}
                  info={pkg}
                  postAction={action => {
                    if (action === "install") {
                      setPackages(prev => {
                        const newPrev = [...prev]
                        const index = newPrev.findIndex(p => p.name === pkg.name)
                        if (index !== -1) {
                          newPrev[index] = {
                            ...newPrev[index],
                            installedVersion: pkg.version
                          }
                        }
                        return newPrev
                      })
                    } else if (action === "uninstall") {
                      setPackages(prev => {
                        const newPrev = [...prev]
                        const index = newPrev.findIndex(p => p.name === pkg.name)
                        if (index !== -1) {
                          newPrev[index] = {
                            ...newPrev[index],
                            installedVersion: undefined
                          }
                        }
                        return newPrev
                      })
                    }
                  }}
                />
              ))
          )}
        </ScrollArea>
      </div>
    </UtilityContent>
  )
}