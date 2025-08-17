import RustPackageInfo from "@/types/backend/PackageInfo"
import PackageInfo from "@/types/frontend/PackageInfo"
import { invoke } from "@tauri-apps/api/core"

const listInstalledPackages = async (projectPath: string): Promise<PackageInfo[]> => {
  const response = await invoke("list_installed_packages", { projectPath })
  return (response as RustPackageInfo[])
    .map(pkg => ({
      name: pkg.name,
      author: pkg.author,
      version: pkg.version,
      description: pkg.description,
      installedVersion: pkg.installed_version
    }))
}

export default listInstalledPackages