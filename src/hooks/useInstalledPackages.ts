import PackageInfo from "@/types/backend/PackageInfo"
import listInstalledPackages from "@/utils/listInstalledPackages"
import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"

const useInstalledPackages = (projectPath: string) => {
  const [installedPackages, setInstalledPackages] = useState<PackageInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    listInstalledPackages(projectPath)
      .then(res => {
        setInstalledPackages(res)
      })
      .catch(async (error) => {
        await invoke("log", { message: error })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [projectPath])

  return { installedPackages, isLoading }
}

export default useInstalledPackages