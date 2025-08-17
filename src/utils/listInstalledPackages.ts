import PackageInfo from "@/types/backend/PackageInfo";
import { invoke } from "@tauri-apps/api/core"

const listInstalledPackages = async (projectPath: string) => {
  return await invoke("list_installed_packages", { projectPath }) as PackageInfo[];
}

export default listInstalledPackages;