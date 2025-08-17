import PackageInfo from "@/types/frontend/PackageInfo"
import listInstalledPackages from "@/utils/listInstalledPackages"
import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"

const useInstalledPackages = (projectPath: string, reload: boolean) => {
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
  }, [projectPath, reload])

  return { installedPackages, setInstalledPackages, isLoading }
}

export default useInstalledPackages