import RustPackageInfo from "@/types/backend/PackageInfo"
import PackageInfo from "@/types/frontend/PackageInfo"
import { invoke } from "@tauri-apps/api/core"

const searchPackages = async (query: string, resultNumber: number, projectPath: string): Promise<PackageInfo[]> => {
  const res = await invoke("search_packages", { query, resultNumber, projectPath })
  return (res as RustPackageInfo[])
    .map(pkg => ({
      name: pkg.name,
      author: pkg.author,
      version: pkg.version,
      description: pkg.description,
      installedVersion: pkg.installed_version,
    }))
}

export default searchPackages